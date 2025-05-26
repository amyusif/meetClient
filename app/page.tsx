"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { CalendarView } from "@/components/calendar-view"
import { ClientsManagement } from "@/components/clients-management"
import { MessagesView } from "@/components/messages-view"
import { ProfilePanel } from "@/components/profile-panel"
import { DashboardOverview } from "@/components/dashboard-overview"
import { LoginPage } from "@/components/login-page"
import { Topbar } from "@/components/topbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["dashboard", "calendar", "clients", "messages", "profile"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading MeetSync...</p>
        </div>
      </div>
    )
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <LoginPage />
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />
      case "calendar":
        return <CalendarView />
      case "clients":
        return <ClientsManagement />
      case "messages":
        return <MessagesView />
      case "profile":
        return <ProfilePanel />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SidebarProvider>
        <Topbar notificationCount={5} />
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset>
          <div className="flex-1 space-y-4 p-4 pt-20 md:p-8 md:pt-20">
            <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/20 rounded-3xl shadow-2xl min-h-[calc(100vh-5rem)] p-4 md:p-6">
              {renderContent()}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
