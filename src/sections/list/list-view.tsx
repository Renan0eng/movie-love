"use client";
import React, { useEffect } from "react";
import { ListItem } from "@/components/list/list-item";
import { ListPagination } from "@/components/list/list-pagination";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { ListItem as ListItemType, Prisma, Rating, User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";


export type ListItemTypeWithRating = Prisma.ListItemGetPayload<{
  include: {
    rating: {
      include: {
        user: true
      }
    }
  }
}>

type Props = {
  films: ListItemTypeWithRating[]
  token: string
  user: User | null
}

export default function ListView({
  films,
  token,
  user
}: Props) {

  const router = useRouter();

  React.useEffect(() => {
    if (!token) {
      router.refresh();
    }
    fetch('/api/set-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      }),
    })
      .then(response => response.json())
      .then(() => {
        console.log('Success');
        router.refresh();

      })
      .catch((error) => {
        console.error('Error:', error);
        console.log('Error:', error);
      });
  }, [token]);

  const [page, setPage] = React.useState(1)

  const [data, setData] = React.useState(films)

  const [newItem, setNewItem] = React.useState(false)

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

  useEffect(() => {
    let maxPages = 0;
    const length = data.length;
    if (length > 0) {
      maxPages = Math.ceil(length / 10);
    }

    if (maxPages === 0) {
      maxPages = 1;
    }

    if (maxPages < page) {
      setPage(maxPages);
    }
    if (newItem) {
      setPage(maxPages);
      setNewItem(false);
    }
  }, [data]);

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
      setNewItem(true);
      handleAtualizar();
      let maxPages = 0;
      const length = data.length;
      if (length > 0) {
        maxPages = Math.ceil(length / 10);
      }

      if (maxPages === 0) {
        maxPages = 1;
      }

      setPage(maxPages);
    });
  }


  return (
    <div className="flex sm:w-[90%] w-full gap-8 justify-around flex-col">
      <div className="flex w-full rounded-xl shadow-xl bg-background-shadow flex-col sm:p-8 p-[4px] sm:gap-8 gap-2 py-3" >
        {/* header */}
        <div className="flex justify-center w-full p-2 sm:p-0">
          {/* Icon Btn */}

          {/* Name */}
          <h1 className="text-text sm:text-4xl text-xl font-semibold text-center">Movies</h1>
          {/* Icon Btn */}
          {/* <Button className="rounded-full h-10 w-10 sm:h-12 sm:w-12" size="icon-xl" variant="ghost">
            <Icon icon="icon-park-outline:peoples" className="sm:text-[30px] text-[25px]" />
          </Button> */}
        </div>
        {/* content */}
        <div className="flex flex-col gap-2 min-h-96 p-3">
          <Button className="gap-2 rounded-xl" size="xl" onClick={handleAddNew} variant="outline">
            <Icon icon="lucide:plus" className="sm:text-[35px] text-[30px]" />Add new
          </Button>
          {
            data
              .slice((page - 1) * 10, page * 10)
              .map((item) => {
                return (
                  <ListItem key={item.id} item={item} handleAtualizar={handleAtualizar} user={user} />
                )
              })
          }
        </div>

        {/* Pagination */}
        <ListPagination page={page} setPage={setPage} maxPages={data ? ((data.length > 0 ? data.length - 1 : 0) / 10) + 1 : 0} />
      </div>
      {/* btns */}
      <div className="flex justify-between">
        <Link href="/list/linklist">
          <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="mage:qr-code" />Link list</Button>
        </Link>
        <Link href="/list/personalize">
          <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="bi:gear" />Personalize</Button>
        </Link>
      </div>
    </div >
  );
}
