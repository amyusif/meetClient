"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, Mail, Phone, Calendar, Loader2, Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddClientModal } from "@/components/add-client-modal"
import { ScheduleMeetingModal } from "@/components/schedule-meeting-modal"
import { supabase, type Client } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function ClientsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const [notifyingClient, setNotifyingClient] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setClients(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch clients. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const sendNotification = async (client: Client) => {
    try {
      setNotifyingClient(client.id)

      // Get the client's next upcoming meeting
      const { data: meetings, error: meetingsError } = await supabase
        .from("meetings")
        .select("*")
        .eq("client_id", client.id)
        .gte("start_time", new Date().toISOString())
        .order("start_time")
        .limit(1)

      if (meetingsError) throw meetingsError

      if (!meetings || meetings.length === 0) {
        toast({
          title: "No upcoming meetings",
          description: `${client.name} doesn't have any upcoming meetings to notify about.`,
          variant: "destructive",
        })
        return
      }

      const nextMeeting = meetings[0]
      const meetingDate = new Date(nextMeeting.start_time)
      const today = new Date()
      const daysUntilMeeting = Math.ceil((meetingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      // Create the email content
      const emailSubject = `🗓️ Meeting Reminder: ${nextMeeting.title} - ${daysUntilMeeting} ${daysUntilMeeting === 1 ? "Day" : "Days"} to Go!`
      const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Reminder</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
        .content { padding: 40px 30px; }
        .meeting-card { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
        .days-counter { font-size: 48px; font-weight: bold; margin: 10px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .meeting-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-label { font-weight: 600; color: #4a5568; }
        .detail-value { color: #2d3748; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; transition: transform 0.2s; }
        .cta-button:hover { transform: translateY(-2px); }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #718096; font-size: 14px; }
        .emoji { font-size: 24px; margin: 0 5px; }
        .urgent { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); }
        .soon { background: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%); }
        .normal { background: linear-gradient(135deg, #48dbfb 0%, #0abde3 100%); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🗓️ Meeting Reminder</h1>
            <p>Your upcoming appointment is approaching!</p>
        </div>
        
        <div class="content">
            <p>Dear <strong>${client.name}</strong>,</p>
            
            <p>We hope this message finds you well! We wanted to remind you about your upcoming meeting with us.</p>
            
            <div class="meeting-card ${daysUntilMeeting <= 1 ? "urgent" : daysUntilMeeting <= 3 ? "soon" : "normal"}">
                <div class="emoji">${daysUntilMeeting <= 1 ? "🚨" : daysUntilMeeting <= 3 ? "⚡" : "⏰"}</div>
                <div class="days-counter">${daysUntilMeeting}</div>
                <div>${daysUntilMeeting === 1 ? "Day" : "Days"} Until Your Meeting</div>
                ${daysUntilMeeting <= 1 ? '<div style="font-size: 14px; margin-top: 10px;">⚠️ URGENT: Meeting is tomorrow or today!</div>' : ""}
            </div>
            
            <div class="meeting-details">
                <h3 style="margin-top: 0; color: #2d3748;">📋 Meeting Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Meeting Title:</span>
                    <span class="detail-value">${nextMeeting.title}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date & Time:</span>
                    <span class="detail-value">${meetingDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })} at ${meetingDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}</span>
                </div>
                ${
                  nextMeeting.location
                    ? `
                <div class="detail-row">
                    <span class="detail-label">📍 Location:</span>
                    <span class="detail-value">${nextMeeting.location}</span>
                </div>
                `
                    : ""
                }
                ${
                  nextMeeting.meeting_type
                    ? `
                <div class="detail-row">
                    <span class="detail-label">🏷️ Meeting Type:</span>
                    <span class="detail-value">${nextMeeting.meeting_type}</span>
                </div>
                `
                    : ""
                }
                ${
                  nextMeeting.description
                    ? `
                <div class="detail-row">
                    <span class="detail-label">📝 Description:</span>
                    <span class="detail-value">${nextMeeting.description}</span>
                </div>
                `
                    : ""
                }
            </div>
            
            <p>We're looking forward to our productive session together! Please make sure to:</p>
            <ul style="color: #4a5568; padding-left: 20px;">
                <li>📝 Prepare any materials or questions you'd like to discuss</li>
                <li>🔗 Test your internet connection if it's a virtual meeting</li>
                <li>📱 Save our contact information in case you need to reach us</li>
                <li>⏰ Set a reminder 15 minutes before the meeting</li>
                ${daysUntilMeeting <= 2 ? "<li>🎯 <strong>Double-check the meeting time and location</strong></li>" : ""}
            </ul>
            
            <div style="text-align: center;">
                <a href="mailto:admin@meetsync.com?subject=Re: ${emailSubject.replace(/['"]/g, "")}" class="cta-button">
                    📧 Reply to Confirm Attendance
                </a>
            </div>
            
            <p style="margin-top: 30px;">If you need to reschedule or have any questions, please don't hesitate to contact us as soon as possible.</p>
            
            <p>Best regards,<br>
            <strong>The MeetSync Team</strong><br>
            📞 +1 (555) 123-4567<br>
            📧 admin@meetsync.com<br>
            🌐 www.meetsync.com</p>
        </div>
        
        <div class="footer">
            <p>This is an automated reminder from MeetSync.</p>
            <p>© 2024 MeetSync. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `

      // Send the actual email via API
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientEmail: client.email,
          clientName: client.name,
          emailSubject,
          emailBody,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email")
      }

      toast({
        title: "✅ Email sent successfully!",
        description: `Meeting reminder sent to ${client.name} at ${client.email}. ${daysUntilMeeting} ${daysUntilMeeting === 1 ? "day" : "days"} until their meeting.`,
      })
    } catch (error: any) {
      console.error("Notification error:", error)
      toast({
        title: "❌ Failed to send email",
        description: error.message || "Please check your email configuration and try again.",
        variant: "destructive",
      })
    } finally {
      setNotifyingClient(null)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300"
      : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleMessageClient = (clientId: string) => {
    router.push(`/?tab=messages&clientId=${clientId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Clients Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your client relationships and contacts</p>
        </div>
        <AddClientModal onClientAdded={fetchClients} />
      </div>

      {/* Search and Filters */}
      <Card className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 w-full"
              />
            </div>
            <Button
              variant="outline"
              className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 w-full sm:w-auto"
            >
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading clients...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && clients.length === 0 && (
        <Card className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No clients yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by adding your first client</p>
            <AddClientModal onClientAdded={fetchClients} />
          </CardContent>
        </Card>
      )}

      {/* Clients Grid */}
      {!loading && filteredClients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-11 h-11 ring-2 ring-white/50 dark:ring-gray-600/50">
                      <AvatarImage src={client.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">{client.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {client.company || "No company"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Client</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMessageClient(client.id)}>Send Message</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 dark:text-red-400">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Added {formatDate(client.created_at)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Joined: {formatDate(client.created_at)}</span>
                  </div>
                </div>

                {client.notes && (
                  <div className="p-2 bg-white/30 dark:bg-gray-700/30 rounded-lg border border-white/20 dark:border-gray-600/20">
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{client.notes}</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-1">
                  <ScheduleMeetingModal
                    selectedClientId={client.id}
                    onMeetingScheduled={fetchClients}
                    triggerButton={
                      <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                        Schedule
                      </Button>
                    }
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMessageClient(client.id)}
                    className="flex-1 bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/30"
                  >
                    Message
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendNotification(client)}
                    disabled={notifyingClient === client.id}
                    className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                    title="Send meeting reminder email"
                  >
                    {notifyingClient === client.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Search Results */}
      {!loading && clients.length > 0 && filteredClients.length === 0 && (
        <Card className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 shadow-lg">
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No clients found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
