import Logo from "@/components/home/logo";
import { ListItem } from "@/components/home/nav-item";
import AuthButton from "@/components/auth/auth-button";
import { cookies } from "next/headers";
import { validarToken } from "@/lib/utils";
import prisma from "@/lib/db";
import { User } from "@prisma/client";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const token = cookies().get('token')?.value;

  const userId = (await validarToken(token)).userId;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  }) as User;


  return (
    <div className="flex bg-background w-full min-h-screen flex-col pt-14 pb-14 pl-[15%] gap-24">
      {/* Header web mobile*/}
      <div className="flex w-[80%] justify-between items-center top-0">
        {/* Logo */}
        <Logo />
        {/* Nav */}
        <div className="flex gap-8 text-center">
          <ul className="gap-10 hidden sm:flex">
            {
              [
                {
                  name: "Home",
                  link: "/",
                  active: true,
                },
                {
                  name: "Demo",
                  link: "/demo",
                  active: false,
                },
                {
                  name: "Contact",
                  link: "/contact",
                  active: false,
                },
              ]
                .map((item) => (
                  <ListItem key={item.name} item={item} />
                ))}
          </ul>
          <AuthButton access_token={!!user?.access_token} />
        </div>
      </div>
      {children}
      <div className="flex justify-between w-[80%]">
        {
          [
            {
              value: "R$0.00",
              movie: "4"
            },
            {
              value: "R$14.99",
              movie: "10"
            },
            {
              value: "R$49.99",
              movie: "∞"
            },
          ].map((item) => (
            <div className="text-text-secondary flex items-center gap-5">
              <span className="text-7xl font-bold">{item.movie}</span><span className="font-semibold">Movies<br />{item.value}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}
