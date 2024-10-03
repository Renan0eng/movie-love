"use client"
import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Icon } from '@iconify/react';
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const starVariants = cva(
  "text-text sm:text-4xl text-3xl transition-colors duration-200",
  {
    variants: {
      variant: {
        default:
          "",
        active:
          "text-yellow-500"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface Props
  extends React.HTMLAttributes<HTMLLIElement> {
  handleAtualizar: () => void
  id: string
  value: number
  item: Rating
}

const PopoverStar = React.forwardRef<HTMLDataListElement, Props>(
  ({ className, id, handleAtualizar, value, item, ...props }, ref) => {
    const [popoverOpen, setPopoverOpen] = React.useState(false);

    const [star, setStar] = React.useState(false);

    React.useEffect(() => {
      if (item?.rating) {
        setStar(true);
      }
    }, [item]);

    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild >
          <Icon icon="ic:outline-star" className={cn(starVariants({ variant: star ? "active" : "default" }))} />
        </PopoverTrigger>
        <PopoverContent className="w-80 rounded-xl bg-background-shadow border-white/10">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <div className="space-y-2">
                <h4 className="font-medium leading-none text-text">Rating</h4>
                <p className="text-sm text-text-secondary">
                  Give a rating to the film.
                </p>
              </div>
              <div>
                <Button className="rounded-full" size="icon-xl" variant="ghost"
                  onClick={() => {
                    fetch(`api/list/rating?id=${item.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                      .then((response) => {
                        if (response.ok) {
                          console.log('Success');
                          handleAtualizar();
                        }
                      })
                      .catch((error: any) => {
                        console.error('Error:', error);
                      });
                    setStar(false);
                    setPopoverOpen(false);
                  }}
                >
                  <Icon icon="ic:outline-delete" className="text-3xl" />
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <RatingInput setPopoverOpen={setPopoverOpen} setStar={setStar} id={id} handleAtualizar={handleAtualizar} value={value} />
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)

export { PopoverStar }


import { useState } from "react";
import { Button } from "../ui/button";
import { ListItemTypeWithRating } from "@/sections/list/list-view";
import { Item } from "@radix-ui/react-select";
import { Rating } from "@prisma/client";

type RatingInputProps = {
  handleAtualizar: () => void;
  totalStars?: number;
  setPopoverOpen: (value: boolean) => void;
  setStar: (star: boolean) => void;
  id: string;
  value: number;
};

const RatingInput = ({ totalStars = 5, setPopoverOpen, setStar, id, handleAtualizar, value }: RatingInputProps) => {
  const [rating, setRating] = useState(value);  // Usar o valor inicial passado por props
  const [hover, setHover] = useState(0);    // Armazena a estrela que o usuário está passando o mouse

  React.useEffect(() => {
    setRating(value); // Atualiza o rating sempre que o value mudar
  }, [value]);

  React.useEffect(() => {
    console.log("id", id);
  }, [id]);

  const handleRating = (ratingValue: number) => {
    fetch('api/list/rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating: ratingValue, id: id }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Success');
          handleAtualizar();
        }
      })
      .catch((error: any) => {
        console.error('Error:', error);
      });

    setRating(ratingValue); // Atualiza o estado do rating
    setPopoverOpen(false); // Fecha o popover após a avaliação
    setStar(true); // Define que o item foi avaliado
  };

  return (
    <div className="flex flex-row space-x-1"> {/* Adicionando espaçamento entre as estrelas */}
      {[...Array(totalStars)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <label key={index} className="flex items-center"> {/* Flex para centralizar o ícone */}
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              style={{ display: "none" }} // Oculta o input
            />
            <div
              className={`flex justify-center items-center cursor-pointer transition-colors duration-400 text-gray-400 `}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRating(ratingValue)}
              aria-label={`Avaliar com ${ratingValue} estrela${ratingValue > 1 ? 's' : ''}`} // Acessibilidade
              role="button" // Acessibilidade
              tabIndex={0} // Permite que o elemento receba foco
            >
              <Icon
                style={{
                  // color: "#FFD700" 
                  color: ratingValue <= (hover || rating) ? "#FFD700" : "#C0C0C0" // Altera a cor da estrela
                }}
                icon="ic:outline-star"
                width={40} // Aumenta a largura para melhor toque
                height={40} // Aumenta a altura para melhor toque
              />
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default RatingInput;
