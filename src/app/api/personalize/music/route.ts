// app/api/upload/route.ts
import fs from "fs";
import path from "path";
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

    // se a lista tiver uma música, remove do disco e do banco de dados
    if (list.music) {
      const musicPath = path.join(process.cwd(), "public", list.music);

      if (fs.existsSync(musicPath)) {
        fs.unlinkSync(musicPath);
      }

      await prisma.list.update({
        where: { id: list.id },
        data: { music: null },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
