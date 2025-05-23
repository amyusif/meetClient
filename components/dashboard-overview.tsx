"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, MessageSquare, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddClientModal } from "@/components/add-client-modal"
import { ScheduleMeetingModal } from "./schedule-meeting-modal"
import { LiveClock } from "@/components/live-clock"
import { supabase, type Meeting, type Client } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function DashboardOverview() {
  const [meetings, setMeetings] = useState<(Meeting & { clients: Client })[]>([])
  const [stats, setStats] = useState({
    totalMeetings: 0,
    activeClients: 0,
    messages: 0,
    completionRate: "0%",
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const fetchTodaysMeetings = async () => {
    try {
      const today = new Date()
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

      const { data, error } = await supabase
        .from("meetings")
        .select(`
          *,
          clients (*)
        `)
        .gte("start_time", startOfDay)
        .lte("start_time", endOfDay)
        .order("start_time")

      if (error) throw error
      setMeetings(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch today's meetings.",
        variant: "destructive",
      })
    }
  }

  const fetchStats = async () => {
    try {
      // Get total meetings this month
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      const { count: meetingsCount } = await supabase
        .from("meetings")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth)

      // Get active clients
      const { count: clientsCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")

      // Get conversations count
      const { count: conversationsCount } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })

      // Calculate completion rate
      const { count: completedMeetings } = await supabase
        .from("meetings")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .gte("created_at", startOfMonth)

      const completionRate =
        meetingsCount && meetingsCount > 0 ? Math.round(((completedMeetings || 0) / meetingsCount) * 100) : 0

      setStats({
        totalMeetings: meetingsCount || 0,
        activeClients: clientsCount || 0,
        messages: conversationsCount || 0,
        completionRate: `${completionRate}%`,
      })
    } catch (error: any) {
      console.error("Error fetching stats:", error)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    await Promise.all([fetchTodaysMeetings(), fetchStats()])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.round(diffMs / (1000 * 60))

    if (diffMins < 60) {
      return `${diffMins}m`
    } else {
      const hours = Math.floor(diffMins / 60)
      const mins = diffMins % 60
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-0"
      case "scheduled":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-0"
      case "completed":
        return "bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-0"
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-0"
      default:
        return "bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-0"
    }
  }

  const statsData = [
    {
      title: "Total Meetings",
      value: stats.totalMeetings.toString(),
      change: "+12%",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Clients",
      value: stats.activeClients.toString(),
      change: "+8%",
      icon: Users,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Conversations",
      value: stats.messages.toString(),
      change: "+23%",
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Completion Rate",
      value: stats.completionRate,
      change: "+5%",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <LiveClock />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">{stat.value}</p>
                  <p className="text-xs md:text-sm text-green-600 dark:text-green-400 mt-1">
                    {stat.change} from last month
                  </p>
                </div>
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
                >
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading meetings...</span>
              </div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No meetings today</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Your schedule is clear for today</p>
                <ScheduleMeetingModal onMeetingScheduled={fetchData} />
              </div>
            ) : (
              meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-white/30 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/20 hover:bg-white/40 dark:hover:bg-gray-700/40 transition-colors"
                >
                  <Avatar className="w-10 h-10 ring-2 ring-white/50 dark:ring-gray-600/50 flex-shrink-0">
                    <AvatarImage src={meeting.clients?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {meeting.clients?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate">{meeting.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {meeting.clients?.name} {meeting.clients?.company && `(${meeting.clients.company})`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {formatTime(meeting.start_time)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getDuration(meeting.start_time, meeting.end_time)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <ScheduleMeetingModal
              onMeetingScheduled={fetchData}
              triggerButton={
                <button className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md">
                  Schedule New Meeting
                </button>
              }
            />
            <AddClientModal onClientAdded={fetchData} />
            <Button
              onClick={() => router.push("/?tab=messages")}
              className="w-full p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 font-medium hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200"
            >
              Send Message
            </Button>
            <button className="w-full p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 font-medium hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200">
              Generate Report
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
