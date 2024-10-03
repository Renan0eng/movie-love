// src/app/api/auth/login.ts
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function GET() {
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`, // O URI de redirecionamento
  });

  return NextResponse.redirect(authUrl);
}
