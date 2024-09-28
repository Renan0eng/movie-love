import prisma from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { name } = await req.json();
  console.log("name", name);

  const ret = await prisma.listItem.create({
    data: {
      name: name as string,
      listId: "cm1mf8os20000zwavt5zasafp",
    },
  });

  return NextResponse.json({ name });
};

export const GET = async (req: NextRequest) => {
  const ret = await prisma.listItem.findMany({
    where: {
      listId: "cm1mf8os20000zwavt5zasafp",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(ret);
};
