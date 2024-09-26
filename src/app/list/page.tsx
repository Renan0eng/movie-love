import { ListItem } from "@/components/home/nav-item";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from '@iconify/react';
import Image from "next/image";

export default function Home() {

  return (
    <div className="flex w-[90%] gap-8 justify-around flex-col ">
      <div className="flex w-full rounded-xl shadow-xl bg-background-shadow flex-col  min-h-[calc(100vh-200px)] p-8 gap-8" >
        {/* header */}
        <div className="flex justify-between w-full ">
          {/* Icon Btn */}
          <Button className="rounded-full " size="icon-xl" variant="ghost">
            <Icon icon="lucide:plus" className="text-[35px]" />
          </Button>
          {/* Name */}
          <h1 className="text-text text-4xl font-semibold">Movies</h1>
          {/* Icon Btn */}
          <Button className="rounded-full " size="icon-xl" variant="ghost">
            <Icon icon="icon-park-outline:peoples" className="text-[30px]" />
          </Button>
        </div>
        {/* content */}
        <div className="flex flex-col gap-8  ">
          <div className="bg-background/70 w-full rounded-md p-6 flex justify-between">
            <div className="flex gap-8  items-center">
              <Checkbox
                className="text-text-tertiary border-[3px] h-6 w-6 "
              />
              <span className="text-text font-semibold text-2xl">Harry Potter</span>
            </div>
            <div>
              <div>
                {/* nota 1 */}
                <span className="text-text-secondary text-md">
                  4.9
                </span>
                {/* avatares */}
                <div className="flex w-[80px] relative">
                  <Image src="/avatar1.jpg" height={50} width={50} className="rounded-full border-primary border-2 absolute left-[30px]" alt="" />
                  <Image src="/avatar2.jpg" height={50} width={50} className="rounded-full border-primary border-2" alt="" />
                </div>
                {/* nota 2 */}
                <span className="text-text-secondary text-md">
                  3.5
                </span>
                {/* nota 2 */}
                <span className="text-text-secondary text-md">
                  3.5
                </span>
              </div>
              {/* estrela  */}
            </div>
          </div>
        </div>
      </div>
      {/* btns */}
      <div className="flex justify-between">
        <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="mage:qr-code" />Link list</Button>
        <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="bi:gear" />Personalize</Button>
      </div>
    </div >
  );
}
