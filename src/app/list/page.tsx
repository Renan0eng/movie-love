import React from "react";
import ListView from "../../sections/list/list-view";
import { getLista, validarToken } from "@/lib/utils";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";


export default async function Home() {

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const validToken = await validarToken(token);

  const films = await getLista(token as string);

  const user = await prisma.user.findFirst({
    where: {
      id: validToken.userId
    }
  });

  return (
    <ListView films={films} token={validToken.token} user={user} />
  );
}
