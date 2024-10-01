import React from "react";
import ListView from "../../sections/list/list-view";
import { getLista, validarToken } from "@/lib/utils";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";


export default async function Home() {

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const validToken = await validarToken(token);

  const films = await getLista(token as string);

  return (
    <ListView films={films} token={validToken.token} />
  );
}
