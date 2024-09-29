"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { List } from "@prisma/client";
import QRCode from "react-qr-code";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type Props = {
  list: List | null;
  master: boolean;
};

export default function ListLinkView({ list, master }: Props) {

  const [name, setName] = React.useState<string>("");

  const router = useRouter();

  React.useEffect(() => {
    setName(list?.name || "");
  }, [list]);

  const handleNameEdit = () => {
    fetch('/api/list/name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: list?.id, name }),
    }).then(() => {
      console.log('name updated');
    });
  };

  const handleUnConnect = () => {
    fetch('/api/list/unconnect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: list?.id }),
    }).then(() => {
      router.push('/list');
      console.log('unconnected');
    });
  }

  return (
    <div className="flex sm:w-[90%] w-full gap-8 flex-col justify-center">
      {/* title */}
      <h1 className="text-3xl text-center text-text font-bold">Share this link to add films</h1>
      {/* list name */}
      {master ?
        <div className="flex justify-center items-center">
          <Input
            className="border-0 text-2xl text-primary text-center font-bold w-100 rounded-full"
            placeholder="List name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameEdit}
          />
        </div>
        : <h2 className="text-2xl text-center text-primary font-bold">{name}</h2>}
      {/* qr code */}
      <div className="flex w-full justify-center">
        <QRCode value={list?.id || ""} bgColor="#1D1C22" fgColor="#fff" />
      </div>
      {/* btns */}
      <div className="flex justify-between">
        {!master ?
          <Button className="rounded-full gap-2" size="xl" variant="outline" onClick={handleUnConnect}><Icon icon="mingcute:unlink-fill" />Unconnect</Button> :
          <Link href="/list/linklist/scan">
            <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="carbon:scan-alt" />Scan</Button>
          </Link>}
        <Link href="/list">
          <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="carbon:arrow-left" />Back</Button>
        </Link>
      </div>
    </div >
  );
}
