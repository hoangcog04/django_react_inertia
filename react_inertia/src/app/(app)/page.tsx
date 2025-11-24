"use client"

import { IMAGES } from "@/assets/images"
import { useTheme } from "next-themes"

import Image from "@/components/Image"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function Home() {
  const { resolvedTheme } = useTheme()

  return (
    <div className="flex-center min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:border dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-2xl dark:shadow-blue-950/20">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]">
              Hello, Tailwind CSS!
            </h1>
            <p className="mt-2 text-gray-500 dark:text-slate-300">
              Everything is working perfectly 🎉
            </p>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <ThemeToggle />
        </div>

        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground dark:text-slate-400">
            Current theme:{" "}
            <span className="font-semibold text-foreground dark:text-blue-300">
              {resolvedTheme}
            </span>
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src={IMAGES.image}
            alt="Home"
            className="size-60 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 dark:shadow-xl dark:shadow-slate-900/50 dark:ring-1 dark:ring-slate-700/50"
          />
        </div>
      </div>
    </div>
  )
}
