import Link from "next/link"
import { IMAGES } from "@/assets/images"
import { ROUTES } from "@/constants"

import Image from "@/components/image"

export default function Welcome() {
  // temp: always show the login button
  // const isLogin = auth.user
  const isLogin = true
  // temp: always show the register button
  const canRegister = true

  return (
    <>
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-blue-50 to-white p-6 text-[#1b1b18] dark:bg-[#0a0a0a] dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 lg:p-8">
        <header className="not-has-[nav]:hidden w-full max-w-[335px] text-sm lg:max-w-4xl">
          <nav className="flex items-center justify-end gap-4">
            {isLogin ? (
              <Link
                href={ROUTES.dashboard}
                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={ROUTES.login}
                  className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                >
                  Log in
                </Link>
                {canRegister && (
                  <Link
                    href={ROUTES.register}
                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                  >
                    Register
                  </Link>
                )}
              </>
            )}
          </nav>
        </header>

        <div className="duration-750 starting:opacity-0 flex w-full items-center justify-center opacity-100 transition-opacity lg:grow">
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

            <div className="flex justify-center">
              <Image
                src={IMAGES.image}
                alt="Home"
                className="size-60 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 dark:shadow-xl dark:shadow-slate-900/50 dark:ring-1 dark:ring-slate-700/50"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
