// src/app/api/auth/login.ts
import { NextResponse } from "next/server";

export async function GET() {
  // limpa o cookie de sessão

  const response = NextResponse.json({ logout: true });

  response.cookies.delete("token");

  return response;
}
