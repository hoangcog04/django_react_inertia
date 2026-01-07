"use client"

import { type PageNumberPagingResponse } from "@/types"
import { useRouter } from "next13-progressbar"

import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const MAX_AROUND = 1

type CustomPaginationProps<T> = {
  records?: PageNumberPagingResponse<T>
  rootPath: string
  className?: string
}
export function CustomPagination<T>({
  records,
  rootPath,
  className,
}: CustomPaginationProps<T>) {
  const router = useRouter()

  if (!records) return null

  const { page_size, page, total_pages, links } = records ?? {}

  const startIndexToRender = Math.max(1, page - MAX_AROUND)
  const endIndexToRender = Math.min(total_pages, page + MAX_AROUND)
  const showLeftEllipsis = page > MAX_AROUND + 1
  const showRightEllipsis = page < total_pages - MAX_AROUND

  const hasNext = !!links.next
  const hasPrev = !!links.previous
  const paramsFromPrevLink = new URLSearchParams(links.previous?.split("?")[1])
  const paramsFromNextLink = new URLSearchParams(links.next?.split("?")[1])
  const prevLink = `${rootPath}?${paramsFromPrevLink.toString()}`
  const nextLink = `${rootPath}?${paramsFromNextLink.toString()}`

  const handlePrevClick = () => {
    router.push(prevLink, { scroll: false })
  }

  const handleNextClick = () => {
    router.push(nextLink, { scroll: false })
  }

  const handlePageClick = (page: number) => {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("perpage", page_size.toString())
    router.push(`${rootPath}?${params.toString()}`, { scroll: false })
  }

  return (
    <Pagination className={cn("", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevClick}
            className="cursor-pointer aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            aria-disabled={!hasPrev}
          />
        </PaginationItem>
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {Array.from({ length: endIndexToRender - startIndexToRender + 1 }).map(
          (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => handlePageClick(startIndexToRender + index)}
                isActive={startIndexToRender + index === page}
                className="cursor-pointer"
              >
                {startIndexToRender + index}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={handleNextClick}
            className="cursor-pointer aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            aria-disabled={!hasNext}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
