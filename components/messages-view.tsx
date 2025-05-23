"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, Paperclip, MoreHorizontal } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    lastMessage: "Thanks for the meeting today. Looking forward to the next steps!",
    time: "2 min ago",
    unread: 2,
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Creative Studio",
    lastMessage: "Can we reschedule tomorrow's meeting?",
    time: "1 hour ago",
    unread: 1,
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "Enterprise Solutions",
    lastMessage: "The proposal looks great. When can we discuss the timeline?",
    time: "3 hours ago",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
  },
  {
    id: 4,
    name: "David Kim",
    company: "StartupXYZ",
    lastMessage: "Perfect! See you at 3 PM.",
    time: "1 day ago",
    unread: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
  },
]

const messages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    content: "Hi! Thanks for taking the time to meet with us today.",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    content: "It was my pleasure! I'm excited about the potential collaboration.",
    time: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    content: "Great! We'd like to move forward with the proposal. When would be a good time to discuss the next steps?",
    time: "10:35 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "You",
    content: "How about we schedule a follow-up meeting for next week? I'll send you some available time slots.",
    time: "10:37 AM",
    isOwn: true,
  },
  {
    id: 5,
    sender: "Sarah Johnson",
    content: "Thanks for the meeting today. Looking forward to the next steps!",
    time: "2 min ago",
    isOwn: false,
  },
]

export function MessagesView() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-gray-600 mt-1">Communicate with your clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <Card className="backdrop-blur-sm bg-white/40 border border-white/30 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle>Conversations</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/30"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0.5 max-h-[calc(100vh-16rem)] overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-3 text-left hover:bg-white/30 transition-colors ${
                    selectedConversation === conversation.id ? "bg-white/40 border-r-2 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-10 h-10 ring-2 ring-white/50">
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {conversation.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800 truncate">{conversation.name}</h4>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-1">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.company}</p>
                      <p className="text-sm text-gray-500 truncate mt-0.5">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="bg-blue-500 text-white border-0 text-xs flex-shrink-0 ml-1">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 backdrop-blur-sm bg-white/40 border border-white/30 shadow-lg flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b border-white/20 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-9 h-9 ring-2 ring-white/50">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    SJ
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-800">Sarah Johnson</h3>
                  <p className="text-xs text-gray-600">TechCorp Inc. • Online</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-22rem)]">
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isOwn
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-white/60 border border-white/30 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="p-3 border-t border-white/20">
            <div className="flex items-end space-x-2">
              <Button variant="ghost" size="sm" className="mb-1 h-8 w-8 p-0">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 min-h-[40px] max-h-32 bg-white/50 border-white/30 resize-none py-2"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white mb-1 h-8 w-8 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
