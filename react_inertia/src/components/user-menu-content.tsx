"use client"

// import { logout } from "@/routes"
// import { edit } from "@/routes/profile"

// import { Link, router } from "@inertiajs/react"
import Link from "next/link"
import { ROUTES } from "@/constants"
import { useLogout } from "@/services/useAuth"
import { type User } from "@/types"
import { LogOut, Settings } from "lucide-react"
import { useRouter } from "next13-progressbar"
import { toast } from "react-toastify"

import { useMobileNavigation } from "@/hooks/use-mobile-navigation"
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { UserInfo } from "@/components/user-info"

import { Button } from "./ui/button"

interface UserMenuContentProps {
  user: User
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const cleanup = useMobileNavigation()
  const router = useRouter()

  const { mutate: logout } = useLogout()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logout successful")
        cleanup()
        router.push(ROUTES.login)
      },
    })
  }

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Button
            className="w-full flex-1 justify-start"
            variant="ghost"
            onClick={cleanup}
          >
            <Settings className="mr-2" />
            Settings
          </Button>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Button
          className="w-full flex-1 justify-start"
          variant="ghost"
          onClick={handleLogout}
          data-test="logout-button"
        >
          <LogOut className="mr-2" />
          Log out
        </Button>
      </DropdownMenuItem>
    </>
  )
}
