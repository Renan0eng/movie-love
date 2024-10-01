"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { List } from "@prisma/client";
import QRCode from "react-qr-code";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ListItemTypeWithUser } from "@/app/list/linklist/page";

type Props = {
  list: ListItemTypeWithUser | null;
  master: boolean;
};

export default function ListLinkView({ list, master }: Props) {

  const pathName = usePathname();

  const [name, setName] = React.useState<string>("");

  const [copySuccess, setCopySuccess] = React.useState(false);

  const [copyText, setCopyText] = React.useState("Copy");

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

  const handleUnConnect = (id: string) => {
    fetch('/api/list/unconnect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    }).then(() => {
      console.log('unconnected');
    });
  }

  React.useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

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
      {/* code  copy paste */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-text text-lg">Copy this code to share or copy the link</p>
        <div className="flex gap-4 justify-center items-center cursor-copy"
          onClick={() => {
            navigator.clipboard.writeText(list?.id || "");
            setCopyText("Code copied !");
            setCopySuccess(true);
          }}
        >
          <p className="text-center text-primary text-2xl font-bold">
            Copy code
          </p> <Icon icon="streamline:copy-paste" className="text-primary text-3xl" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4 justify-center items-center cursor-copy"
          onClick={() => {
            navigator.clipboard.writeText(`https://movie.renannardi.com/list/linklist/url/${list?.id || ""}`);
            setCopyText("Code copied !");
            setCopySuccess(true);
          }}
        >
          <p className="text-center text-primary text-2xl font-bold">
            Copy link
          </p> <Icon icon="carbon:link"
            className="text-primary text-3xl" />
        </div>
      </div>
      <Alert
        variant="success"
        className="flex gap-4 text-center items-center justify-center rounded-full"
        active={copySuccess}
      >
        <AlertTitle>
          <Icon icon="streamline:copy-paste" className="text-success text-xl" />
        </AlertTitle>
        <AlertDescription>
          {copyText}
        </AlertDescription>
      </Alert>
      {/* btns */}
      <div className="flex justify-between">
        {!master ?
          <Button className="rounded-full gap-2" size="xl" variant="outline" onClick={() => {
            handleUnConnect(list?.id || "")
            router.push('/list');
          }}><Icon icon="mingcute:unlink-fill" />Unconnect</Button> :
          <Link href="/list/linklist/scan">
            <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="carbon:scan-alt" />Scan</Button>
          </Link>}
        <Link href="/list">
          <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="carbon:arrow-left" />Back</Button>
        </Link>
      </div>
      {/* User list */}
      {master && <div className="flex flex-col gap-4 w-full">
        <h2 className="text-2xl text-center text-text font-bold">Users</h2>
        <div className="flex flex-col gap-4">
          {list?.users.map((user) => {
            return (
              <div key={user.id} className="flex gap-4 justify-center items-center">
                <Icon icon="ic:outline-people" className="text-3xl text-primary" />
                <p className="text-lg text-text">{user.id}</p>
                <p className="text-lg text-text">-</p>
                <p className="text-lg text-text">{user.name}</p>
                <Button className="rounded-full gap-2" size="icon-xl" variant="outline" onClick={() => handleUnConnect(user.id)}>
                  <Icon icon="mdi:trash-outline" className="text-3xl text-primary" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>}
    </div >
  );
}
