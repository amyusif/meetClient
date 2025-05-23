"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScheduleMeetingModal } from "./schedule-meeting-modal"
import { supabase, type Meeting, type Client } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [meetings, setMeetings] = useState<(Meeting & { clients: Client })[]>([])
  const [monthlyMeetings, setMonthlyMeetings] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchMeetings = async () => {
    try {
      setLoading(true)

      // Get meetings for selected date
      const startOfDay = new Date(selectedDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(selectedDate)
      endOfDay.setHours(23, 59, 59, 999)

      const { data: dayMeetings, error: dayError } = await supabase
        .from("meetings")
        .select(`
          *,
          clients (*)
        `)
        .gte("start_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString())
        .order("start_time")

      if (dayError) throw dayError
      setMeetings(dayMeetings || [])

      // Get meeting counts for the entire month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const { data: monthMeetings, error: monthError } = await supabase
        .from("meetings")
        .select("start_time")
        .gte("start_time", startOfMonth.toISOString())
        .lte("start_time", endOfMonth.toISOString())

      if (monthError) throw monthError

      // Count meetings by date
      const meetingCounts: { [key: string]: number } = {}
      monthMeetings?.forEach((meeting) => {
        const date = new Date(meeting.start_time).getDate()
        meetingCounts[date] = (meetingCounts[date] || 0) + 1
      })
      setMonthlyMeetings(meetingCounts)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch meetings.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMeetings()
  }, [selectedDate, currentDate])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (day: number | null) => {
    if (!day) return false
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number | null) => {
    if (!day) return false
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    )
  }

  const selectDate = (day: number | null) => {
    if (!day) return
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(newDate)
  }

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300"
      case "strategy":
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300"
      case "review":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300"
      case "workshop":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300"
    }
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your meetings and schedule</p>
        </div>
        <ScheduleMeetingModal
          onMeetingScheduled={fetchMeetings}
          triggerButton={
            <Button className="self-start md:self-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              New Meeting
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Widget */}
        <Card className="lg:col-span-2 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
              </span>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-3">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => selectDate(day)}
                  disabled={!day}
                  className={`relative p-2 text-sm rounded-lg transition-all duration-200 min-h-[40px] ${
                    !day
                      ? "cursor-default"
                      : isToday(day)
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                        : isSelected(day)
                          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                          : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {day && (
                    <>
                      <span>{day}</span>
                      {monthlyMeetings[day] && (
                        <div className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Schedule */}
        <Card className="lg:col-span-2 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 shadow-lg">
          <CardHeader>
            <CardTitle>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
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
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No meetings</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">No meetings scheduled for this date</p>
                <ScheduleMeetingModal onMeetingScheduled={fetchMeetings} />
              </div>
            ) : (
              meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-white/30 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/20 hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-200"
                >
                  <div className="w-1.5 h-14 rounded-full bg-gradient-to-b from-blue-500 to-purple-600 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate">{meeting.title}</h4>
                      {meeting.meeting_type && (
                        <Badge className={`${getTypeColor(meeting.meeting_type)} text-xs`}>
                          {meeting.meeting_type}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
                      {meeting.clients?.name} {meeting.clients?.company && `(${meeting.clients.company})`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}(
                      {getDuration(meeting.start_time, meeting.end_time)})
                    </p>
                    {meeting.location && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">📍 {meeting.location}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Avatar className="w-8 h-8 ring-2 ring-white/50 dark:ring-gray-600/50">
                      <AvatarImage src={meeting.clients?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                        {meeting.clients?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 h-8 px-2"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
