"use client"
import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Icon } from '@iconify/react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

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
  setStar: (star: boolean) => void
  star: boolean
}

const PopoverStar = React.forwardRef<HTMLDataListElement, Props>(
  ({ className, setStar, star, ...props }, ref) => {
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild >
          <Icon icon="ic:outline-star" className={cn(starVariants({ variant: star ? "active" : "default" }))} />
        </PopoverTrigger>
        <PopoverContent className="w-80 rounded-xl bg-background-shadow border-white/10">
          <div className="grid gap-2">
            <div className="space-y-2">
              <h4 className="font-medium leading-none text-text">Rating</h4>
              <p className="text-sm text-text-secondary">
                Give a rating to the film.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <RatingInput setPopoverOpen={setPopoverOpen} setStar={setStar} />
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

type RatingInputProps = {
  totalStars?: number;
  setPopoverOpen: (value: boolean) => void;
  setStar: (star: boolean) => void;
};

const RatingInput = ({ totalStars = 5, setPopoverOpen, setStar }: RatingInputProps) => {
  const [rating, setRating] = useState(0);  // Armazena o valor da avaliação
  const [hover, setHover] = useState(0);    // Armazena a estrela que o usuário está passando o mouse

  const handleRating = (value: number) => {
    setRating(value);
    setPopoverOpen(false);
    setStar(true);
  };

  return (
    <div className="flex flex-row">
      {[...Array(totalStars)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <label key={index} >
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleRating(ratingValue)}
              style={{ display: "none" }}
            />
            <Icon
              icon="ic:outline-star"
              className={`text-white cursor-pointer transition-colors duration-400 ${ratingValue <= (hover || rating) ? "text-yellow-400" : "text-gray-400"
                }`}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRating(ratingValue)}
              width={30}
              height={30}
            />
          </label>
        );
      })}
    </div>
  );
};

export default RatingInput;
