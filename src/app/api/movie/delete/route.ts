import prisma from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { id } = await req.json();

  const ratings = await prisma.rating.deleteMany({
    where: {
      listItemId: id as string,
    },
  });

  const ret = await prisma.listItem.delete({
    where: { id: id as string },
  });

  return NextResponse.json({ ret });
};
