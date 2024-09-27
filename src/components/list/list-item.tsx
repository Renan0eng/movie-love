"use client"
import * as React from "react"
import Image from "next/image"
import { Checkbox } from "../ui/checkbox"
import { PopoverStar } from "./popover-nota"
import { ListItem as ListItemType } from "@prisma/client"

export interface Props
  extends React.HTMLAttributes<HTMLLIElement> {
  item: ListItemType
  handleAtualizar: () => void
}

const ListItem = React.forwardRef<HTMLDataListElement, Props>(
  ({ className, item, handleAtualizar, ...props }, ref) => {

    const [checked, setChecked] = React.useState(item.activi);

    const [star, setStar] = React.useState(true);

    const handleChecked = () => {
      fetch("/api/movie/activi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activi: !checked,
          id: item.id,
        }),
      });
      setChecked(!checked);
      handleAtualizar();
    }

    return (
      <div className="bg-background/70 w-full rounded-md sm:p-6 p-3 flex justify-between shadow-lg ">
        <div className="flex sm:gap-8 gap-4 items-center sm:w-[calc(100%-200px)] w-[calc(100%-140px)]">
          <Checkbox
            onCheckedChange={handleChecked}
            checked={checked}
            className="text-text-tertiary border-[3px] sm:h-8 sm:w-8 h-6 w-6 rounded-[4px]"
          />
          {/* Truncate aplicado aqui */}
          <span className="text-text font-semibold sm:text-2xl text-md truncate w-[100%] ">
            {item.name}
          </span>
        </div>
        <div className="flex flex-row sm:gap-6 gap-1 items-center">
          <div className="flex flex-row sm:gap-3 gap-2 items-center">
            {/* nota 1 */}
            <span className="text-text-secondary sm:text-md text-sm">
              {/* {item.rating.user1} */} 0
            </span>
            {/* avatares */}
            <div className="flex sm:w-[65px] w-[48px] relative">
              <Image src="/Avatar.png" height={40} width={40} className="rounded-full border-primary border-2 w-8 sm:w-10 h-8 sm:h-10 absolute sm:left-[25px] right-0 bg-background" alt="" />
              <Image src="/Avatar.png" height={40} width={40} className="rounded-full border-primary border-2 w-8 sm:w-10 h-8 sm:h-10  bg-background" alt="" />
            </div>
            {/* nota 2 */}
            <span className="text-text-secondary sm:text-md text-sm">
              {/* {item.rating.user2} */} 0
            </span>
          </div>
          {/* estrela  */}
          <PopoverStar star={star} setStar={setStar} />
        </div>
      </div>
    )
  }
)

export { ListItem }
