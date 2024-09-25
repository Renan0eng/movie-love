import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const navVariants = cva(
  "text-lg font-bold hover:text-primary transition-colors duration-200 flex items-center gap-1 text-text",
  {
    variants: {
      variant: {
        default:
          "",
        active:
          "text-primary underline-offset-8 underline underline-4"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface Props
  extends React.HTMLAttributes<HTMLLIElement>,
  VariantProps<typeof navVariants> {
  item: {
    name: string
    link: string
    active: boolean
  }
  asChild?: boolean
}

const ListItem = React.forwardRef<HTMLDataListElement, Props>(
  ({ className, item, ...props }, ref) => {
    return (
      <li
        className={cn(navVariants({ variant: item.active ? "active" : "default", className }))}
        {...props}>
        <a href={item.link}>
          {item.name}
        </a>
      </li>
    )
  }
)

export { ListItem }
