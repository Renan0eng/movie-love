// src/app/api/auth/callback/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import prisma from "@/lib/db";
import { validarToken } from "@/lib/utils";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET, // Certifique-se de que está aqui
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    // Se não houver código, redirecionar para a página inicial
    console.log("No code provided");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`); // URL absoluta
  }

  try {
    // Trocar o código pelo token de acesso
    const { tokens } = await client.getToken(code);

    client.setCredentials(tokens);

    // Usar o token para obter dados do usuário
    const userInfoResponse = await client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const user = userInfoResponse.data as {
      sub: string;
      name: string;
      picture: string;
      email: string;
      access_token: string;
    };

    // verifica se o access_token  ja esta lincado a um usuario

    const validAccess = await prisma.user.findFirst({
      where: {
        OR: [
          {
            access_token: {
              equals: tokens.access_token,
            },
          },
          {
            email: {
              equals: user.email,
            },
          },
        ],
      },
    });

    let jwtToken;

    if (validAccess) {
      await prisma.user.update({
        where: {
          id: validAccess.id,
        },
        data: {
          access_token: tokens.access_token,
          email: user.email,
          name: user.name,
          image: user.picture,
        },
      });

      jwtToken = jwt.sign(
        { id: validAccess.id }, // Payload
        process.env.JWT_SECRET as string // Chave secreta
        // { expiresIn: "1h" } // Expiração de 1 hora
      );

      const response = NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/`
      ); // URL absoluta

      response.cookies.set("token", jwtToken, {
        httpOnly: true, // Proteger contra ataques XSS
        // maxAge: 60 * 60, // O token expira em 1 hora
        path: "/", // O cookie é válido para todo o site
      });

      return response;
    }

    const token = request.cookies.get("token")?.value;

    // Verificar se o usuário já existe se não cria um
    const { userId } = await validarToken(token);

    const ret = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        access_token: tokens.access_token,
        email: user.email,
        name: user.name,
        image: user.picture,
      },
    });

    jwtToken = jwt.sign(
      { id: ret.id }, // Payload
      process.env.JWT_SECRET as string // Chave secreta
      // { expiresIn: "1h" } // Expiração de 1 hora
    );

    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/list`
    ); // URL absoluta

    response.cookies.set("token", jwtToken, {
      httpOnly: true, // Proteger contra ataques XSS
      // maxAge: 60 * 60, // O token expira em 1 hora
      path: "/", // O cookie é válido para todo o site
    });

    return response;
  } catch (error) {
    console.error("Error during Google authentication:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`); // URL absoluta
  }
}
