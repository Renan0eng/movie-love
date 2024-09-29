"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { ListItem as ListItemType, Prisma, Rating } from "@prisma/client";
import QRCode from "react-qr-code";
import Link from "next/link";


export type ListItemTypeWithRating = Prisma.ListItemGetPayload<{
  include: {
    rating: true
  }
}>

type Props = {
  films: ListItemTypeWithRating[]
}

export default function ListLinkView({
  films
}: Props) {

  const [page, setPage] = React.useState(1)

  const [data, setData] = React.useState(films)

  const [newItemPopover, setNewItemPopover] = React.useState(false)

  React.useEffect(() => {
    // cria um timer para atualizar a lista a cada 5 segundos
    const timer = setInterval(() => {
      handleAtualizar()
    }, 5000)
    return () => clearInterval(timer)
  }, [])


  const handleAtualizar = async () => {
    const res = await fetch("/api/movie", {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache"
      }
    });
    const data = await res.json();
    setData(data);
  };

  const handleAddNew = async () => {
    fetch("/api/movie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "New Movie",
      }),
    }).then(() => {
      handleAtualizar();
    });
  }

  return (
    <div className="flex sm:w-[90%] w-full gap-8 flex-col justify-center">
      {/* qr code */}
      <div className="flex w-full justify-center">
        <QRCode value="" bgColor="#1D1C22" fgColor="#fff" />
      </div>
      {/* btns */}
      <div className="flex justify-between">
        <Link href="/list/link/scan">
          <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="carbon:scan-alt" />Scan</Button>
        </Link>
      </div>
    </div >
  );
}
