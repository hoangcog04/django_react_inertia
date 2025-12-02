"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Next13ProgressBar } from "next13-progressbar"

import CustomToast from "@/components/custom-toast"

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
      <CustomToast />
      <Next13ProgressBar
        options={{ showSpinner: false }}
        showOnShallow
        color={"#333"}
      />
      {children}
    </QueryClientProvider>
  )
}
