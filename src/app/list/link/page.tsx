import React from "react";
import { getLista } from "@/lib/utils";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import ListLinkView from "@/sections/list/link/link-view";


export default async function Home(req: NextRequest) {

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const films = await getLista(token as string);

  return (
    <ListLinkView films={films} />
  );
}
