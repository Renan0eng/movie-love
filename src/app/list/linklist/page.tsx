import React from "react";
import { NextRequest } from "next/server";
import ListLinkView from "@/sections/list/link/link-view";


export default async function Home(req: NextRequest) {

  return (
    <ListLinkView />
  );
}
