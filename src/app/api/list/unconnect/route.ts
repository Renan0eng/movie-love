import prisma from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { validarToken } from "@/lib/utils";

export const POST = async (req: NextRequest) => {
  // Obter o JWT do cabeçalho do cookie token
  console.log("req.cookies");

  const token = req.cookies.get("token")?.value;

  const userId = (await validarToken(token)).userId as string;

  console.log("userId", userId);

  const { id, idUser }: { id: string; idUser: string } = await req.json();

  if (idUser) {
    console.log("idUser", idUser);
    console.log("id", id);

    // deleta os ranks do usuario na lista

    await prisma.rating.deleteMany({
      where: {
        userId: idUser,
      },
    });

    await prisma.user.update({
      where: {
        id: idUser,
      },
      data: {
        lists: {
          disconnect: {
            id: id,
          },
        },
      },
    });

    //

    const response = NextResponse.json({ success: true });

    return response;
  }

  // deleta os ranks do usuario na lista

  await prisma.rating.deleteMany({
    where: {
      userId: userId,
    },
  });

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
