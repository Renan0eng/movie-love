import prisma from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Tipagem para o payload do JWT
interface JwtPayload {
  id: string;
}

export const POST = async (req: NextRequest) => {
  // Obter o JWT do cabeçalho do cookie token
  let token = req.cookies.get("token")?.value;

  console.log("token:", token);

  let userId: string | null = null;

  if (!token) {
    // Se não houver token, cria um novo usuário e gera um novo JWT
    userId = await criarNovoUsuario();

    token = jwt.sign(
      { id: userId }, // Payload do JWT
      process.env.JWT_SECRET as string // Chave secreta usada para assinar o token
      // { expiresIn: "1h" } // O token expira em 1 hora
    );
  } else {
    try {
      // Verifica se o token é válido
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      userId = decoded.id;
    } catch (err) {
      // Se o token for inválido, cria um novo
      userId = await criarNovoUsuario();

      token = jwt.sign(
        { id: userId }, // Payload
        process.env.JWT_SECRET as string // Chave secreta
        // { expiresIn: "1h" } // Expiração de 1 hora
      );
    }
  }

  // cria uma nota para o filme

  const { id, rating }: { id: string; rating: number } = await req.json();

  const ratingExists = await prisma.rating.findFirst({
    where: {
      listItemId: id,
      userId: userId,
    },
  });

  if (ratingExists) {
    await prisma.rating.update({
      where: {
        id: ratingExists.id,
      },
      data: {
        rating: rating,
      },
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("token", token, {
      httpOnly: true, // Proteger contra ataques XSS
      // maxAge: 60 * 60, // O token expira em 1 hora
      path: "/", // O cookie é válido para todo o site
    });

    return response;
  }

  const newRating = await prisma.rating.create({
    data: {
      rating: rating,
      listItemId: id,
      userId: userId,
    },
  });

  // Envia o token JWT no cabeçalho 'Set-Cookie'
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", token, {
    httpOnly: true, // Proteger contra ataques XSS
    // maxAge: 60 * 60, // O token expira em 1 hora
    path: "/", // O cookie é válido para todo o site
  });

  return response;
};

// Função para criar um novo usuário fictício
const criarNovoUsuario = async (): Promise<string> => {
  const newUser = await prisma.user.create({
    data: {
      name: "New User", // Pode personalizar este valor
    },
  });
  return newUser.id; // Retorna o ID do novo usuário
};
