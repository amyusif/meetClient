"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, MessageSquare, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AddClientModal } from "@/components/add-client-modal"
import { LiveClock } from "@/components/live-clock"

const stats = [
  {
    title: "Total Meetings",
    value: "24",
    change: "+12%",
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Active Clients",
    value: "156",
    change: "+8%",
    icon: Users,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Messages",
    value: "89",
    change: "+23%",
    icon: MessageSquare,
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Completion Rate",
    value: "94%",
    change: "+5%",
    icon: TrendingUp,
    color: "from-orange-500 to-orange-600",
  },
]

const upcomingMeetings = [
  {
    title: "Product Strategy Review",
    client: "TechCorp Inc.",
    time: "10:00 AM",
    duration: "1h",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "confirmed",
  },
  {
    title: "Design System Workshop",
    client: "Creative Studio",
    time: "2:00 PM",
    duration: "2h",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "pending",
  },
  {
    title: "Quarterly Business Review",
    client: "Enterprise Solutions",
    time: "4:30 PM",
    duration: "45m",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "confirmed",
  },
]

export function DashboardOverview() {
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
        {stats.map((stat, index) => (
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
        {/* Upcoming Meetings */}
        <Card className="lg:col-span-2 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingMeetings.map((meeting, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-xl bg-white/30 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/20 hover:bg-white/40 dark:hover:bg-gray-700/40 transition-colors"
              >
                <Avatar className="w-10 h-10 ring-2 ring-white/50 dark:ring-gray-600/50 flex-shrink-0">
                  <AvatarImage src={meeting.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {meeting.client.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate">{meeting.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{meeting.client}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{meeting.time}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{meeting.duration}</p>
                </div>
                <Badge
                  variant={meeting.status === "confirmed" ? "default" : "secondary"}
                  className={`flex-shrink-0 ${meeting.status === "confirmed" ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-0" : ""}`}
                >
                  {meeting.status}
                </Badge>
              </div>
            ))}
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
            <button className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md">
              Schedule New Meeting
            </button>
            <AddClientModal />
            <button className="w-full p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 font-medium hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200">
              Send Message
            </button>
            <button className="w-full p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 font-medium hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200">
              Generate Report
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
