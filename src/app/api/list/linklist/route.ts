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

  // Remove as listas lincadas ao usuário e deleta elas

  console.log("userId", userId);

  await prisma.list.deleteMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
  });

  // linka a nova lista ao usuário
  const { code } = await req.json();

  console.log("code:", code);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lists: {
        connect: {
          id: code,
        },
      },
    },
  });

  const ret = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {},
  });

  // Envia o token JWT no cabeçalho 'Set-Cookie'
  const response = NextResponse.json({ ret });
  response.cookies.set("token", token, {
    httpOnly: true, // Proteger contra ataques XSS
    maxAge: 60 * 60, // O token expira em 1 hora
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
