"use client";
import React, { useEffect } from "react";
import { ListPagination } from "@/components/list/list-pagination";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { ListItemPublic } from "@/components/personalize/list-item-public";
import { Input } from "@/components/ui/input";
import MusicPlayer from "@/components/personalize/music-player/music-player";

export type ListTypeWithRating = Prisma.ListGetPayload<{
  include: {
    listItems: {
      include: {
        rating: {
          include: {
            user: true
          }
        }
      }
    }
  }
}>;

type Props = {
  films: ListTypeWithRating | null
}

export default function PublicView({ films }: Props) {
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState(films?.listItems);

  useEffect(() => {
    const timer = setInterval(() => {
      handleAtualizar();
    }, 5000);
    document.body.style.backgroundImage = `url(${process.env.NEXT_PUBLIC_BASE_URL}/${films?.image})`;
    document.body.style.backgroundSize = 'cover'; // Adiciona para cobrir toda a tela
    document.body.style.backgroundPosition = 'center'; // Centraliza a imageFromDBm
    document.body.style.backgroundAttachment = 'fixed'; // Fixa a imagem
    return () => clearInterval(timer);
  }, []);

  const handleAtualizar = async () => {
    const res = await fetch("/api/list", {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache"
      }
    });
    const { data } = await res.json();
    if (data) {
      setData(data.listItems);
      document.body.style.backgroundImage = `url(${process.env.NEXT_PUBLIC_BASE_URL}/${data.image})`;
      document.body.style.backgroundSize = 'cover'; // Adiciona para cobrir toda a tela
      document.body.style.backgroundPosition = 'center'; // Centraliza a imageFromDBm
      document.body.style.backgroundAttachment = 'fixed'; // Fixa a imagem
    }
  };


  return (
    <div className="flex sm:w-[90%] w-full gap-8 justify-around flex-col rounded-xl">
      <div className="flex w-full rounded-xl shadow-xl flex-col sm:p-8 p-[4px] sm:gap-8 gap-2 py-3"
        style={{ backgroundColor: "rgba(30, 30, 30, 0.95)" }}
      >

        {/* Header */}
        <div className="flex justify-center w-full p-2 sm:p-0">
          <h1 className="text-primary sm:text-4xl text-xl font-semibold text-center">{films?.name}</h1>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 min-h-96 p-3">
          {data &&
            data
              .slice((page - 1) * 10, page * 10)
              .map((item) => (
                <ListItemPublic key={item.id} item={item} handleAtualizar={handleAtualizar} />
              ))
          }
        </div>

        {/* Pagination */}
        <ListPagination page={page} setPage={setPage} maxPages={data ? ((data.length > 0 ? data.length - 1 : 0) / 10) + 1 : 0} />
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <Link href="/list">
          <Button className="rounded-full gap-2 bg-primary/20" size="xl" variant="outline"><Icon icon="carbon:arrow-left" />Back</Button>
        </Link>
      </div>
      <MusicPlayer url={films?.music} ifAultoPlay={films?.autoPlay} />
    </div>
  );
}
