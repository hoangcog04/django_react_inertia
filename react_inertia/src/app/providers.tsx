"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const Next13ProgressBar = dynamic(
  () => import("next13-progressbar").then((m) => m.Next13ProgressBar),
  { ssr: false }
)

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Next13ProgressBar
        options={{ showSpinner: false }}
        showOnShallow
        color={"#333"}
      />
      {children}
    </QueryClientProvider>
  )
}
