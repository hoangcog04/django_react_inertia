// import { useSidebar } from "@/contexts/sidebar-provider"
import { User, type SharedData } from "@/types"
// import { usePage } from "@inertiajs/react"
import { ChevronsUpDown } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserInfo } from "@/components/user-info"
import { UserMenuContent } from "@/components/user-menu-content"

const mockUser: User = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://github.com/shadcn.png",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export function NavUser() {
  // const { auth } = usePage<SharedData>().props
  const { state } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex w-full items-center gap-2 overflow-hidden rounded-md text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <UserInfo user={mockUser} />
              <ChevronsUpDown className="ml-auto size-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={
              isMobile ? "bottom" : state === "collapsed" ? "left" : "bottom"
            }
          >
            <UserMenuContent user={mockUser} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
