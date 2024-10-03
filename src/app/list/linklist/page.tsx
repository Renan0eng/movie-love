import React from "react";
import { NextRequest } from "next/server";
import ListLinkView from "@/sections/list/link/link-view";
import prisma from "@/lib/db";
import { validarToken } from "@/lib/utils";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { list } from "postcss";

// export type ListItemTypeWithRating = Prisma.ListItemGetPayload<{
//   include: {
//     rating: true
//   }
// }>

export type ListItemTypeWithUser = Prisma.ListGetPayload<{
  include: {
    users: true
  }
}>

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
    include: {
      users: {
        where: {
          id: {
            not: userId
          }
        },
      }
    },
  });

  lista?.users.forEach((user) => {
    if (user.id === userId) {
      master = true;
    }
  });

  if (lista?.masterId === userId) {
    master = true;
  }

  return (
    <ListLinkView list={lista} master={master} />
  );
}
