// app/api/set-token/route.ts
import prisma from "@/lib/db";
import { validarToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ access_token: false });
  }
  const userId = (await validarToken(token)).userId as string;
  console.log("userId", userId);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  console.log("user", user);

  if (!user?.access_token) {
    return NextResponse.json({ access_token: false });
  }

  const response = NextResponse.json({ access_token: true, user });

  return response;
}
