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

    // Verifica se o arquivo é uma imagem
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validImageTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only JPG, PNG, and GIF are allowed.",
        },
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

    const listImage = await prisma.list.findFirst({
      where: {
        masterId: userId,
        image: {
          not: null,
        },
      },
    });

    // Verifica se o usuário já tem uma imagem cadastrada e remove do disco se tiver
    if (listImage?.image) {
      const imagePath = path.join(process.cwd(), "public", listImage.image);
      fs.unlinkSync(imagePath);
    }

    await prisma.list.updateMany({
      where: {
        masterId: userId,
      },
      data: {
        image: `uploads/${randomFileName}`,
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
