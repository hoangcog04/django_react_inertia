import React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type CustomCardProps = {
  loading?: boolean
  title?: string
  description?: string
  height?: string
  isShowHeader?: boolean
  isShowFooter?: boolean
  children: React.ReactNode
  footerChildren?: React.ReactNode
  className?: string
}

export default function CustomCard({
  loading = false,
  title = "",
  description = "",
  height = "h-auto",
  isShowHeader = true,
  isShowFooter = false,
  children,
  footerChildren,
  className,
}: CustomCardProps) {
  return (
    <Card
      className={cn("relative gap-4 overflow-hidden rounded-[5px]", className)}
    >
      {isShowHeader && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="pb-2.5">{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent className={`px-2.5 py-2.5 ${height}`}>
        {children}
      </CardContent>
      {isShowFooter && (
        <CardFooter className="flex justify-center">
          {footerChildren}
        </CardFooter>
      )}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-black/40">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </Card>
  )
}
