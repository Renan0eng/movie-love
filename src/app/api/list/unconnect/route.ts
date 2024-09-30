import prisma from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { validarToken } from "@/lib/utils";

export const POST = async (req: NextRequest) => {
  // Obter o JWT do cabeçalho do cookie token
  console.log("req.cookies");

  const token = req.cookies.get("token")?.value;

  const userId = (await validarToken(token)) as string;

  console.log("userId", userId);

  const { id }: { id: string } = await req.json();

  // deconecta o usuario da lista

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lists: {
        disconnect: {
          id: id,
        },
      },
    },
  });

  // Envia o token JWT no cabeçalho 'Set-Cookie'
  const response = NextResponse.json({ success: true });

  return response;
};
