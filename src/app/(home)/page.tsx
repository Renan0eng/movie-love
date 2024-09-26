"use client";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <div className="flex w-[80%] gap-8 justify-around">
      <div className="flex flex-col gap-8">
        <p className="text-text-tertiary font-bold text-xl">Your Movie List</p>
        <h1 className="text-text text-8xl font-bold">Welcome to <br />MOVIE LOVE</h1>
        <p className="text-text-tertiary font-bold text-xl">A simple to use and complete list of various features</p>
        <p className="text-text-tertiary font-bold text-xl">try it for free</p>
        <div className="flex gap-10">
          {/* Navega para /list */}
          {/* <Button className="rounded-full" size="xl" variant="outline">Create your list</Button> */}
          <Button className="rounded-full" size="xl" variant="outline"
            link="/list"
          // onClick={() => {
          //   router.push("/list");
          // }}
          >Create your list</Button>
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
  );
}
