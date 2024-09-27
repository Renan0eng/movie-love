import prisma from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { activi, id } = await req.json();

  const ret = await prisma.listItem.update({
    where: { id: id as string },
    data: {
      activi: activi as boolean,
    },
  });

  return NextResponse.json({ ret });
};
