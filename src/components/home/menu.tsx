"use client"
import { User } from "@prisma/client";
import Image from "next/image";
import { use, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import AuthButton from "../auth/auth-button";

type Props = {
  user: User | null;
};

export default function Menu({ user }: Props) {

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  return (

    <Popover>
      <PopoverTrigger asChild>
        <div className="absolute top-8 right-8">
          <img src={user?.image ? user?.image : "/Avatar.png"} height={40} width={40} className="rounded-full border-primary border-2  bg-background" alt="" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="flex rounded-xl bg-background-shadow border-0 flex-col gap-4 justify-center items-center p-4 w-full"
      >
        <div className="space-y-2">
          <h4 className="font-medium leading-none text-text">{user?.name}</h4>
        </div>
        {/* menu list */}
        <div className="grid gap-2">
          <AuthButton access_token={!!user?.access_token} />
        </div>
      </PopoverContent>
    </Popover>
  );
}