"use client"
import * as React from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination"

export interface Props
  extends React.HTMLAttributes<HTMLLIElement> {
  page: number
  setPage: (page: number) => void
  maxPages: number
}

const ListPagination = React.forwardRef<HTMLDataListElement, Props>(
  ({ className, page, setPage, maxPages, ...props }, ref) => {
    return (
      <Pagination>
        <PaginationContent>
          {page - 1 >= 1 &&
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(page - 1)}
                className="rounded-full" />
            </PaginationItem>}
          {page - 1 >= 1 &&
            <PaginationItem>
              <PaginationLink
                onClick={() => setPage(page - 1)}
                className="rounded-full">
                {page - 1}
              </PaginationLink>
            </PaginationItem>}
          <PaginationItem>
            <PaginationLink isActive className="rounded-full">
              {page}
            </PaginationLink>
          </PaginationItem>
          {page + 1 <= maxPages &&
            <PaginationItem>
              <PaginationLink
                onClick={() => setPage(page + 1)}
                className="rounded-full">
                {page + 1}
              </PaginationLink>
            </PaginationItem>}
          {page + 2 <= maxPages &&
            <PaginationItem>
              <PaginationLink
                onClick={() => setPage(page + 2)}
                className="rounded-full">
                {page + 2}
              </PaginationLink>
            </PaginationItem>}
          {page + 1 <= maxPages &&
            <PaginationItem>
              <PaginationEllipsis className="text-primary" />
            </PaginationItem>}
          {page + 1 <= maxPages &&
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (page <= maxPages) {
                    setPage(page + 1)
                  }
                }}
                className="rounded-full" />
            </PaginationItem>}
        </PaginationContent>
      </Pagination>
    )
  }
)

export { ListPagination }
