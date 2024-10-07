import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Extrai o parâmetro de consulta 'file'
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file");

    // Verifica se o nome do arquivo foi fornecido
    if (!fileName) {
      return NextResponse.json(
        { success: false, error: "File name is required" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Verifica se o arquivo existe na pasta uploads
    const filePath = path.join(uploadsDir, fileName);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    // Retorna o arquivo
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": getContentType(fileName), // Define o tipo de conteúdo
        "Content-Disposition": `attachment; filename="${fileName}"`, // Define o nome do arquivo para download
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Função para determinar o tipo de conteúdo baseado na extensão do arquivo
function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".pdf":
      return "application/pdf";
    case ".mp3":
      return "audio/mpeg";
    case ".mp4":
      return "video/mp4";
    // Adicione outros tipos conforme necessário
    default:
      return "application/octet-stream"; // Tipo padrão
  }
}
