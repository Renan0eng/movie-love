import React from "react";
import { ListItem } from "@/components/list/list-item";
import { ListPagination } from "@/components/list/list-pagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from '@iconify/react';
import Image from "next/image";
import ListView from "../sections/list-view";
import prisma from "@/lib/db";
import { ListItem as ListItemType } from "@prisma/client";

export default async function Home() {

  const films = await prisma.listItem.findMany({
    where: {
      listId: "cm1l192py0001b0q4ibdgshfq",
    },
    orderBy: {
      createdAt: "asc",
    },
  }) as ListItemType[];

  return (
    <ListView films={films} />
  );
}
