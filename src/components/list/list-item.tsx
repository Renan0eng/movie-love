"use client";
import * as React from "react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { PopoverStar } from "./popover-nota";
import { ListItem as ListItemType } from "@prisma/client";
import { Input } from "../ui/input";

export interface Props extends React.HTMLAttributes<HTMLLIElement> {
  item: ListItemType;
  handleAtualizar: () => void;
}

const ListItem = React.forwardRef<HTMLDataListElement, Props>(
  ({ className, item, handleAtualizar, ...props }, ref) => {
    const [checked, setChecked] = React.useState(item.activi);
    const [name, setName] = React.useState(item.name);
    const [star, setStar] = React.useState(true);

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
        <div className="flex sm:gap-8 gap-4 items-center sm:w-[calc(100%-200px)] w-[calc(100%-140px)]">
          <Checkbox
            onCheckedChange={handleChecked}
            checked={checked} // Sincronizado com o estado
            className="text-text-tertiary border-[3px] sm:h-8 sm:w-8 h-6 w-6 rounded-[4px]"
          />
          {/* Truncate aplicado aqui */}
          <span className="text-text font-semibold sm:text-2xl text-md truncate w-[100%] ">
            <Input
              value={name}
              className="w-full border-0"
              onChange={(e) => {
                setName(e.target.value);
              }}
              onBlur={handleBlur}
            />
          </span>
        </div>
        <div className="flex flex-row sm:gap-6 gap-1 items-center">
          <div className="flex flex-row sm:gap-3 gap-2 items-center">
            <span className="text-text-secondary sm:text-md text-sm">0</span>
            <div className="flex sm:w-[65px] w-[48px] relative">
              <Image
                src="/Avatar.png"
                height={40}
                width={40}
                className="rounded-full border-primary border-2 w-8 sm:w-10 h-8 sm:h-10 absolute sm:left-[25px] right-0 bg-background"
                alt=""
              />
              <Image
                src="/Avatar.png"
                height={40}
                width={40}
                className="rounded-full border-primary border-2 w-8 sm:w-10 h-8 sm:h-10 bg-background"
                alt=""
              />
            </div>
            <span className="text-text-secondary sm:text-md text-sm">0</span>
          </div>
          <PopoverStar star={star} setStar={setStar} />
        </div>
      </div>
    );
  }
);

export { ListItem };
