// app/api/upload/route.ts
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validarToken } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    // Obter o form data do request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File is required" },
        { status: 400 }
      );
    }

    // Gerar um nome aleatório para o arquivo
    const randomFileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}-${file.name.split(" ").join("-")}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Verifica se a pasta existe, se não existir, cria
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Salvar o arquivo
    const filePath = path.join(uploadsDir, randomFileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    fs.writeFileSync(filePath, buffer);

    // pega o token do usuário
    const tokenCookie = req.cookies.get("token")?.value;

    const { userId, token } = await validarToken(tokenCookie);

    const listMusic = await prisma.list.findFirst({
      where: {
        masterId: userId,
        music: {
          not: null,
        },
      },
    });

    // Verifica se o usuário já tem uma música cadastrada e remove do disco se tiver
    // musicPath = uploads/1728082175564-w3q16hfiuct-CARAMBA-QUE-PINTO-ENORME!!!-meme-do-seu-sirigueijo.mp3
    if (listMusic?.music) {
      const musicPath = path.join(process.cwd(), "public", listMusic.music);
      fs.unlinkSync(musicPath);
    }

    await prisma.list.updateMany({
      where: {
        masterId: userId,
      },
      data: {
        music: `uploads/${randomFileName}`,
      },
    });

    return NextResponse.json(
      { success: true, fileName: randomFileName },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
