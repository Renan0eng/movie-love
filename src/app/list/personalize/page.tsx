import React from "react";
import { getLista, validarToken } from "@/lib/utils";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import PersonalizeView from "@/sections/list/personalize/list-view";


export default async function Home() {

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const validToken = await validarToken(token);

  const films = await prisma.list.findFirst({
    where: {
      users: {
        some: {
          id: validToken.userId
        }
      }
    },
    include: {
      listItems: {
        include: {
          rating: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });

  return (
    <PersonalizeView films={films} />
  );
}
