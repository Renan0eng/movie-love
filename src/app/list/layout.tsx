import Logo from "@/components/home/logo";
import Menu from "@/components/home/menu";
import prisma from "@/lib/db";
import { validarToken } from "@/lib/utils";
import { User } from "@prisma/client";
import { cookies } from "next/headers";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const token = cookies().get('token')?.value;

  console.log("token:", token);

  const userId = (await validarToken(token)).userId;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })

  return (
    <div className="flex bg-background w-full  flex-col sm:pt-14 pt-8 pb-14 xl:px-[15%] sm:px-[5%] px-1 sm:gap-24 gap-8 justify-center items-center">
      {/* Header web mobile*/}
      <Logo />
      <Menu user={user} />
      {children}
    </div>
  );
}
