"use client"
import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Icon } from '@iconify/react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { Button } from "../ui/button";

export interface Props
  extends React.HTMLAttributes<HTMLLIElement> {
  handleAtualizar: () => void
}

const PopoverNew = React.forwardRef<HTMLDataListElement, Props>(
  ({ className, handleAtualizar, ...props }, ref) => {

    const refForm = React.useRef<HTMLFormElement>(null);

    const [popoverOpen, setPopoverOpen] = React.useState(false);

    const [name, setName] = React.useState("");

    const handleSave = () => {
      fetch("/api/movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
        }),
      });
      setPopoverOpen(false);
      handleAtualizar();
    }

    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild >
          <Button className="rounded-full h-10 w-10 sm:h-12 sm:w-12" size="icon-xl" variant="ghost">
            <Icon icon="lucide:plus" className="sm:text-[35px] text-[30px]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 rounded-xl bg-background-shadow border-white/10">
          <div className="grid gap-2">
            <div className="space-y-2">
              <h4 className="font-medium leading-none text-text">New movie</h4>
              <p className="text-sm text-text-secondary">
                Name of your movie
              </p>
            </div>
            <form className="flex gap-4 flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              ref={refForm}
            >
              <div className="grid w-full items-center gap-4 text-text">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Name of your movie" className="rounded-full" onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <Button
                className="rounded-full"
                size="sm"
                variant="outline"
                type="submit"
              >
                Save
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)

export { PopoverNew }
