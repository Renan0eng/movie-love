import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { ListItem as ListItemType, Prisma, Rating } from "@prisma/client";
import QRCode from "react-qr-code";
import Link from "next/link";

export default function ListLinkView() {

  return (
    <div className="flex sm:w-[90%] w-full gap-8 flex-col justify-center">
      {/* qr code */}
      <div className="flex w-full justify-center">
        <QRCode value="Reskljfgnsnrn98233ndsfsfsdfsfnan" bgColor="#1D1C22" fgColor="#fff" />
      </div>
      {/* btns */}
      <div className="flex justify-between">
        <Link href="/list/linklist/scan">
          <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="carbon:scan-alt" />Scan</Button>
        </Link>
      </div>
    </div >
  );
}
