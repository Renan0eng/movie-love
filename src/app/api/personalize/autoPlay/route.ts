// app/api/autoPlay/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validarToken } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    // pega o token do usuário
    const tokenCookie = req.cookies.get("token")?.value;

    const { userId, token } = await validarToken(tokenCookie);

    const list = await prisma.list.findFirst({
      where: {
        masterId: userId,
      },
    });

    if (!list) {
      return NextResponse.json(
        { success: false, error: "List not found" },
        { status: 404 }
      );
    }

    // pega os dados do corpo da requisição
    const { autoPlay } = await req.json();

    console.log(autoPlay);

    await prisma.list.update({
      where: { id: list.id },
      data: { autoPlay },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
