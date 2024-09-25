import { ListItem } from "@/components/home/nav-item";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import Image from "next/image";

export default function Home() {

  return (
    <div className="flex bg-background w-full min-h-screen flex-col pt-14 pb-14 pl-[15%] gap-24">
      {/* Header web mobile*/}
      <div className="flex w-[80%] justify-between items-center top-0">
        {/* Logo */}
        <div className="">
          <h1 className="text-text text-5xl">MOVIE LOVE <span className="text-primary">.</span></h1>
        </div>
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
          <Button className="rounded-full " size="lg" variant="default">Sign in</Button>
        </div>
      </div>
      {/* Main web mobile */}
      <div className="flex w-[80%] gap-8 justify-around">
        <div className="flex flex-col gap-8">
          <p className="text-text-tertiary font-bold text-xl">Your Movie List</p>
          <h1 className="text-text text-8xl">Welcome to <br />MOVIE LOVE</h1>
          <p className="text-text-tertiary font-bold text-xl">A simple to use and complete list of various features</p>
          <p className="text-text-tertiary font-bold text-xl">try it for free</p>
          <div className="flex gap-10">
            <Button className="rounded-full " size="xl" variant="outline">Create your list</Button>
            {
              [{
                link: "/",
                icon: "mdi:github"
              },
              {
                link: "/",
                icon: "ri:linkedin-fill"
              },
              {
                link: "/",
                icon: "mdi:instagram"
              },
              ].map((item) => (
                <Button key={item.link} className="rounded-full " size="icon-xl" variant="outline">
                  <Icon icon={item.icon} className="text-[25px]" />
                </Button>
              ))
            }
          </div>
        </div>
        <div className="relative flex justify-center items-center w-[40%]">
          <Icon
            icon="icon-park-outline:list"
            className="text-9xl text-primary absolute  inset-0 m-auto flex justify-center items-center"
          />
          <div
            className="w-full aspect-square rounded-full border-2 border-primary border-dashed absolute inset-0 m-auto"
          />
        </div>

      </div>
      {/* Footer web */}
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
            }
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
