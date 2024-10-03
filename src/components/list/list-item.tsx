"use client";
import * as React from "react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { PopoverStar } from "./popover-nota";
import { ListItem as ListItemType, User } from "@prisma/client";
import { Input } from "../ui/input";
import { ListItemTypeWithRating } from "@/sections/list/list-view";

export interface Props extends React.HTMLAttributes<HTMLLIElement> {
  item: ListItemTypeWithRating;
  handleAtualizar: () => void;
  user: User | null;
}

const ListItem = React.forwardRef<HTMLDataListElement, Props>(
  ({ className, item, handleAtualizar, user, ...props }, ref) => {
    const [checked, setChecked] = React.useState(item.activi);
    const [name, setName] = React.useState(item.name);

    React.useEffect(() => {
      setChecked(item.activi);
    }, [item.activi]);

    React.useEffect(() => {
      setName(item.name);
    }, [item.name]);

    const handleChecked = async () => {
      try {
        const res = await fetch("/api/movie/activi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activi: !checked,
            id: item.id,
          }),
        });
        if (res.ok) {
          setChecked(!checked); // Atualiza o estado localmente
          handleAtualizar(); // Atualiza a lista após a mudança
        }
      } catch (error) {
        console.error("Erro ao atualizar checkbox:", error);
      }
    };

    const handleAtualizarInput = async (name: string) => {
      try {
        const res = await fetch("/api/movie/name", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            id: item.id,
          }),
        });
        if (res.ok) {
          handleAtualizar(); // Atualiza a lista após a mudança
        }
      } catch (error) {
        console.error("Erro ao atualizar nome:", error);
      }
    };

    const handleDelete = async () => {
      if (name === "") {
        try {
          const res = await fetch("/api/movie/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: item.id,
            }),
          });
          if (res.ok) {
            handleAtualizar(); // Atualiza a lista após a exclusão
          }
        } catch (error) {
          console.error("Erro ao excluir item:", error);
        }
      }
    };

    const handleBlur = async () => {
      await handleAtualizarInput(name);
      await handleDelete();
    };

    return (
      <div className="bg-background/70 w-full rounded-xl sm:p-6 p-3 flex justify-between shadow-lg hover:bg-slate-700">
        <div className="flex sm:gap-4 items-center sm:w-[calc(100%-200px)] w-full">
          <Checkbox
            onCheckedChange={handleChecked}
            checked={checked} // Sincronizado com o estado
            className="text-text-tertiary border-[3px] sm:h-8 sm:w-8 h-6 w-6 rounded-[4px]"
          />
          {/* Truncate aplicado aqui */}
          <span className="text-text font-semibold truncate w-[100%] ">
            <Input
              value={name}
              className="w-full border-0 sm:text-2xl text-md px-1"
              onChange={(e) => {
                setName(e.target.value);
              }}
              onBlur={handleBlur}
            />
          </span>
        </div>
        <div className="flex flex-row sm:gap-6 gap-1 items-center">
          {item.rating.length > 0 &&
            <div className="flex flex-row sm:gap-3 gap-2 items-center">
              {item.rating[0]?.rating && <span className="text-text-secondary sm:text-md text-sm">{item.rating[0]?.rating}</span>}
              <div className="flex sm:w-[65px] w-[48px] relative">
                {item.rating[1]?.rating && <img
                  src={item.rating[1]?.user?.image || "/Avatar.png"}
                  height={40}
                  width={40}
                  className="rounded-full border-primary border-2 w-8 sm:w-10 h-8 sm:h-10 absolute sm:left-[25px] right-0 bg-background"
                  alt=""
                />}
                {item.rating[0]?.rating && <img
                  src={item.rating[0]?.user?.image || "/Avatar.png"}
                  height={40}
                  width={40}
                  className="rounded-full border-primary border-2 w-8 sm:w-10 h-8 sm:h-10 bg-background"
                  alt=""
                />}
              </div>
              {/* <span className="text-text-secondary sm:text-md text-sm">{item.rating[1]?.rating}</span> */}
              {item.rating[1]?.rating && <span className="text-text-secondary sm:text-md text-sm">{item.rating[1]?.rating}</span>}
            </div>}
          <PopoverStar item={item.rating.filter(rating => rating.userId === user?.id)[0]} id={item.id} handleAtualizar={handleAtualizar} value={item.rating.filter(rating => rating.userId === user?.id)[0]?.rating} />
        </div>
      </div>
    );
  }
);

export { ListItem };
