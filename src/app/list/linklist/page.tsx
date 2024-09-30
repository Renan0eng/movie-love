import React from "react";
import { NextRequest } from "next/server";
import ListLinkView from "@/sections/list/link/link-view";
import prisma from "@/lib/db";
import { validarToken } from "@/lib/utils";
import { cookies } from "next/headers";


export default async function Home() {

  let master = false;

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const userId = (await validarToken(token)).userId;

  const lista = await prisma.list.findFirst({
    where: {
      users: {
        some: {
          id: userId || "",
        },
      },
    },
  });

  if (lista?.masterId === userId) {
    master = true;
  }
  return (
    <ListLinkView list={lista} master={master} />
  );
}
