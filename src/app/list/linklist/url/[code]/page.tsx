"use server";
import React from "react";
import prisma from "@/lib/db";
import { validarToken } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LinkCodeView from "@/sections/list/link/url/scan-view";

export default async function Home({ params: { code } }: { params: { code: string } }) {

  // Obter os cookies atuais
  const cookieStore = cookies();
  let token = cookieStore.get('token')?.value;

  // Validar o token
  const validToken = await validarToken(token);

  console.log(token);

  if (!token) {
    // tela de criação de usuário
    return <LinkCodeView token={validToken.token} code={code} />;
  }

  // Verifica se o token é válido
  if (!validToken) {
    console.log("Token inválido");
    redirect(`/`); // Redireciona caso o token seja inválido
  }

  const userId = validToken.userId;

  // Verificar se o userId está válido
  if (!userId) {
    console.log("Usuário inválido");
    redirect(`/`);
  }

  // Verifica se a lista é válida
  const validList = await prisma.list.findFirst({
    where: {
      id: code,
    },
  });

  // Valida se a lista ja esta vinculada ao usuário

  const linkedList = await prisma.list.findFirst({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
      id: code,
    },
  });

  if (linkedList) {
    redirect(`/list`);
  }

  if (!validList) {
    redirect(`/`);
  }

  // Remove as listas lincadas ao usuário
  const list = await prisma.list.findFirst({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
  });

  if (list) {
    const listItems = await prisma.listItem.findMany({
      where: {
        listId: list?.id,
      },
    });

    for (const item of listItems) {
      // Busca as avaliações do item
      const ratings = await prisma.rating.findMany({
        where: {
          listItemId: item.id,
        },
      });

      // Deleta as avaliações
      for (const rating of ratings) {
        await prisma.rating.delete({
          where: {
            id: rating.id,
          },
        });
      }

      // Deleta o item da lista
      await prisma.listItem.delete({
        where: {
          id: item.id,
        },
      });
    }

    // Deleta a lista
    await prisma.list.delete({
      where: {
        id: list?.id,
      },
    });
  }

  // Linca a nova lista ao usuário
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lists: {
        connect: {
          id: code,
        },
      },
    },
  });

  // Redireciona para a lista
  redirect(`/list`);
}
