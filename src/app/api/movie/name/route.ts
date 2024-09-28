import prisma from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { name, id } = await req.json();

  const ret = await prisma.listItem.update({
    where: { id: id as string },
    data: {
      name: name as string,
    },
  });

  return NextResponse.json({ ret });
};
