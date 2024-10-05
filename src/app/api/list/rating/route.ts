import prisma from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { validarToken } from "@/lib/utils";

// Tipagem para o payload do JWT
interface JwtPayload {
  id: string;
}

export const POST = async (req: NextRequest) => {
  // Obter o JWT do cabeçalho do cookie token
  let tokenCookie = req.cookies.get("token")?.value;

  const { userId, token } = await validarToken(tokenCookie);

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

export const DELETE = async (req: NextRequest) => {
  try {
    // Extrai o ID da URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Supondo que o ID venha na query string

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID não fornecido" },
        { status: 400 }
      );
    }

    // Deleta o registro no banco de dados
    await prisma.rating.delete({
      where: {
        id: id,
      },
    });

    // Retorna a resposta de sucesso
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar rating:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
};
