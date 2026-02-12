"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type BreadcrumbItem as BreadcrumbItemType } from "@/types"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const findBreadcrumbPath = (
  items: BreadcrumbItemType[],
  paths: string[],
  level = 0
): BreadcrumbItemType[] => {
  for (const item of items) {
    if (item.key === paths[level]) {
      if (level === paths.length - 1) {
        return [item]
      }

      if (item.items) {
        const childPath = findBreadcrumbPath(item.items, paths, level + 1)
        if (childPath) {
          return [item, ...childPath]
        }
      }
    }
  }

  return []
}

export function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: BreadcrumbItemType[]
}) {
  const pathname = usePathname()

  const arrayPathname: string[] = pathname
    .split("/")
    .filter(Boolean) // keep truthy, e.g: empty string
    .filter((p) => isNaN(Number(p))) // remove number, e.g: 61
  const activeBreadcrumbs = findBreadcrumbPath(breadcrumbs, arrayPathname)

  return (
    <>
      {activeBreadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {activeBreadcrumbs.map((item, index) => {
              const isLast = index === activeBreadcrumbs.length - 1
              return (
                <Fragment key={index}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-semibold">
                        {item.title}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </>
  )
}
