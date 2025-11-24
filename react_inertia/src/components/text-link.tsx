import { ComponentProps } from "react"
// import { Link } from "@inertiajs/react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type LinkProps = ComponentProps<typeof Link>

export default function TextLink({
  className = "",
  children,
  ...props
}: LinkProps) {
  return (
    <Link
      className={cn(
        "hover:decoration-current! text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out dark:decoration-neutral-500",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
