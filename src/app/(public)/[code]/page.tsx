import React from "react";
import { getLista, validarToken } from "@/lib/utils";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import PublicView from "@/sections/public/public-view";
import MusicPlayer from "@/components/personalize/music-player/music-player";


export default async function Home({ params: { code } }: { params: { code: string } }) {

  const films = await prisma.list.findFirst({
    where: {
      id: code
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
    <PublicView films={films} code={code} />
  );
}
