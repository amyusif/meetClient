"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const meetings = [
  {
    id: 1,
    title: "Product Strategy Review",
    client: "TechCorp Inc.",
    time: "10:00 AM - 11:00 AM",
    date: "2024-12-30",
    type: "strategy",
    attendees: 3,
  },
  {
    id: 2,
    title: "Design System Workshop",
    client: "Creative Studio",
    time: "2:00 PM - 4:00 PM",
    date: "2024-12-30",
    type: "workshop",
    attendees: 5,
  },
  {
    id: 3,
    title: "Quarterly Business Review",
    client: "Enterprise Solutions",
    time: "4:30 PM - 5:15 PM",
    date: "2024-12-30",
    type: "review",
    attendees: 2,
  },
]

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const currentWeek = [
  { date: 30, day: "Mon", isToday: true },
  { date: 31, day: "Tue", isToday: false },
  { date: 1, day: "Wed", isToday: false },
  { date: 2, day: "Thu", isToday: false },
  { date: 3, day: "Fri", isToday: false },
  { date: 4, day: "Sat", isToday: false },
  { date: 5, day: "Sun", isToday: false },
]

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(30)

  const getTypeColor = (type: string) => {
    switch (type) {
      case "strategy":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "workshop":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "review":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Calendar
          </h1>
          <p className="text-gray-600 mt-1">Manage your meetings and schedule</p>
        </div>
        <Button className="self-start md:self-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          New Meeting
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Widget */}
        <Card className="backdrop-blur-sm bg-white/40 border border-white/30 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <span>December 2024</span>
              </span>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-3">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 p-1.5">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {currentWeek.map((day) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`p-1.5 text-sm rounded-lg transition-all duration-200 ${
                    day.isToday
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : selectedDate === day.date
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-white/50"
                  }`}
                >
                  {day.date}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="lg:col-span-3 backdrop-blur-sm bg-white/40 border border-white/30 shadow-lg">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center space-x-3 p-3 rounded-xl bg-white/30 border border-white/20 hover:bg-white/40 transition-all duration-200"
              >
                <div className="w-1.5 h-14 rounded-full bg-gradient-to-b from-blue-500 to-purple-600 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h4 className="font-medium text-gray-800 truncate">{meeting.title}</h4>
                    <Badge className={`${getTypeColor(meeting.type)} text-xs`}>{meeting.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1 truncate">{meeting.client}</p>
                  <p className="text-sm text-gray-500">{meeting.time}</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="flex -space-x-2">
                    {Array.from({ length: meeting.attendees }).map((_, i) => (
                      <Avatar key={i} className="w-7 h-7 ring-2 ring-white">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                          {String.fromCharCode(65 + i)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 h-8 px-2">
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
