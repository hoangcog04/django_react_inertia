import React from "react"
import Link from "next/link"
import { type BreadcrumbItem } from "@/types"

type CustomPageHeadingProps = {
  heading: string
  breadcrumbs: BreadcrumbItem[]
}
export default function CustomPageHeading({
  heading,
  breadcrumbs,
}: CustomPageHeadingProps) {
  return (
    <div className="border-sidebar-border/70 page-heading border-b bg-white px-[20px] py-[25px]">
      <h2 className="mb-1.5 text-2xl font-normal">{heading}</h2>
      <ol className="custom-breadcrumb flex flex-1">
        {breadcrumbs.map((breadcrumb) => (
          <li key={breadcrumb.title}>
            <Link href={breadcrumb.href}>{breadcrumb.title}</Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
