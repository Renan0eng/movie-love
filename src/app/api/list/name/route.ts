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

  const token = req.cookies.get("token")?.value;

  const userId = (await validarToken(token)).userId as string;

  const { name }: { name: string } = await req.json();

  await prisma.list.updateMany({
    data: {
      name: name,
    },
    where: {
      masterId: userId,
    },
  });

  // Envia o token JWT no cabeçalho 'Set-Cookie'
  const response = NextResponse.json({ success: true });

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
