// import { Link, usePage } from "@inertiajs/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type NavItem } from "@/types"
import { isSameUrl, resolveUrl } from "@/utils/helpers"
import { ChevronDownIcon, ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({ items = [] }: { items: NavItem[] }) {
  // const page = usePage()
  const pathname = usePathname()

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.items && item.items.length > 0 ? (
              <Collapsible
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(resolveUrl(item.href))}
                    tooltip={{ children: item.title }}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {/* explain: group-data-[<attribute>]/<group-name>:<utility-class> */}
                    {/* tailwind check class group/collapsible for attribute state=open then rotate 90deg */}
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isSameUrl(pathname, subItem.url)}
                        >
                          <Link href={resolveUrl(subItem.url)} prefetch>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(resolveUrl(item.href))}
                tooltip={{ children: item.title }}
              >
                <Link href={resolveUrl(item.href)} prefetch>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
