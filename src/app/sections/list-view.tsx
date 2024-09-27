"use client";
import React from "react";
import { ListItem } from "@/components/list/list-item";
import { ListPagination } from "@/components/list/list-pagination";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { PopoverNew } from "@/components/list/popover-new-item";
import { ListItem as ListItemType } from "@prisma/client";

type Props = {
  films: ListItemType[]
}

export default function ListView({
  films
}: Props) {

  const [page, setPage] = React.useState(1)

  const [data, setData] = React.useState(films)

  const [newItemPopover, setNewItemPopover] = React.useState(false)

  const handleAtualizar = async () => {
    const res = await fetch("/api/movie", {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache"
      }
    });
    const data = await res.json();
    setData(data);
    setNewItemPopover(false);
  };



  return (
    <div className="flex sm:w-[90%] w-full gap-8 justify-around flex-col ">
      <div className="flex w-full rounded-xl shadow-xl bg-background-shadow flex-col sm:p-8 p-[4px] sm:gap-8 gap-2" >
        {/* header */}
        <div className="flex justify-between w-full p-2 sm:p-0">
          {/* Icon Btn */}
          <PopoverNew handleAtualizar={handleAtualizar} />
          {/* Name */}
          <h1 className="text-text sm:text-4xl text-xl font-semibold">Movies</h1>
          {/* Icon Btn */}
          <Button className="rounded-full h-10 w-10 sm:h-12 sm:w-12" size="icon-xl" variant="ghost">
            <Icon icon="icon-park-outline:peoples" className="sm:text-[30px] text-[25px]" />
          </Button>
        </div>
        {/* content */}
        <div className="flex flex-col gap-2 min-h-96">
          {
            data
              .slice((page - 1) * 10, page * 10)
              .map((item) => {
                return (
                  <ListItem key={item.id} item={item} handleAtualizar={handleAtualizar} />
                )
              })
          }
        </div>

        {/* Pagination */}
        <ListPagination page={page} setPage={setPage} maxPages={(films.length / 10) + 1} />
      </div>
      {/* btns */}
      <div className="flex justify-between">
        <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="mage:qr-code" />Link list</Button>
        <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="bi:gear" />Personalize</Button>
      </div>
    </div >
  );
}
