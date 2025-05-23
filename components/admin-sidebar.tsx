"use client"

import { Calendar, Users, MessageSquare, User, LayoutDashboard } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    id: "dashboard",
  },
  {
    title: "Calendar",
    icon: Calendar,
    id: "calendar",
    badge: "3",
  },
  {
    title: "Clients",
    icon: Users,
    id: "clients",
    badge: "12",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    id: "messages",
    badge: "5",
  },
  {
    title: "Profile",
    icon: User,
    id: "profile",
  },
]

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  return (
    <Sidebar className="border-r-0">
      <div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border-r border-white/20 dark:border-gray-700/20 h-full">
        <SidebarHeader className="p-4 pb-2 mt-14">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-2">
          <SidebarMenu className="space-y-1.5">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => setActiveTab(item.id)}
                  isActive={activeTab === item.id}
                  className={`w-full justify-start space-x-3 h-11 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-200/50 dark:border-blue-400/50 shadow-md"
                      : "hover:bg-white/30 dark:hover:bg-gray-800/30 hover:backdrop-blur-sm"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ml-0.5 ${activeTab === item.id ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
                  />
                  <span
                    className={`font-medium ${activeTab === item.id ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {item.title}
                  </span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="ml-auto mr-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-0 px-1.5 py-0 h-5"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4 pt-2">
          <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-xl p-3 border border-white/20 dark:border-gray-700/20">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">MeetSync</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">v1.0.0</p>
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </div>
    </Sidebar>
  )
}
