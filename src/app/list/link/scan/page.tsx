import React from "react";
import { NextRequest } from "next/server";
import LinkScanView from "@/sections/list/link/scan/scan-view";


export default async function Home(req: NextRequest) {

  return (
    <LinkScanView />
  );
}
