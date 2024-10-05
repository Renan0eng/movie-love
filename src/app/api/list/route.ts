// app/api/upload/route.ts
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validarToken } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    // pega o token do usuário
    const tokenCookie = req.cookies.get("token")?.value;

    const { userId, token } = await validarToken(tokenCookie);

    const list = await prisma.list.findFirst({
      where: {
        masterId: userId,
      },
      include: {
        listItems: {
          include: {
            rating: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!list) {
      return NextResponse.json(
        { success: false, error: "List not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: list }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
