"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, Paperclip, MoreHorizontal, MessageSquare } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { supabase, type Conversation, type Message, type Client } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"

export function MessagesView() {
  const [conversations, setConversations] = useState<(Conversation & { clients: Client })[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          clients (*)
        `)
        .order("last_message_time", { ascending: false })

      if (error) throw error
      setConversations(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch conversations.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("sent_at")

      if (error) throw error
      setMessages(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch messages.",
        variant: "destructive",
      })
    }
  }

  const createConversationForClient = async (clientId: string) => {
    try {
      // Check if conversation already exists
      const { data: existingConv, error: checkError } = await supabase
        .from("conversations")
        .select("*")
        .eq("client_id", clientId)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError
      }

      if (existingConv) {
        setSelectedConversation(existingConv.id)
        await fetchMessages(existingConv.id)
        return
      }

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from("conversations")
        .insert([
          {
            client_id: clientId,
            last_message: "Conversation started",
            last_message_time: new Date().toISOString(),
            unread_count: 0,
          },
        ])
        .select()
        .single()

      if (createError) throw createError

      await fetchConversations()
      setSelectedConversation(newConv.id)
      setMessages([])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create conversation.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    // Check if we need to create a conversation for a specific client
    const clientId = searchParams.get("clientId")
    if (clientId) {
      createConversationForClient(clientId)
    }
  }, [searchParams.get("clientId")]) // Only run when clientId changes

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.clients?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.clients?.company?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    setSendingMessage(true)
    try {
      const { error: messageError } = await supabase.from("messages").insert([
        {
          conversation_id: selectedConversation,
          sender_type: "admin",
          content: newMessage.trim(),
        },
      ])

      if (messageError) throw messageError

      // Update conversation
      const { error: convError } = await supabase
        .from("conversations")
        .update({
          last_message: newMessage.trim(),
          last_message_time: new Date().toISOString(),
        })
        .eq("id", selectedConversation)

      if (convError) throw convError

      setNewMessage("")
      await fetchMessages(selectedConversation)
      await fetchConversations()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      })
    } finally {
      setSendingMessage(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  const selectedConvData = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Communicate with your clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <Card className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle>Conversations</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No Messages</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Start a conversation by messaging a client from the Clients page
                </p>
              </div>
            ) : (
              <div className="space-y-0.5 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-3 text-left hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors ${
                      selectedConversation === conversation.id
                        ? "bg-white/40 dark:bg-gray-700/40 border-r-2 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-10 h-10 ring-2 ring-white/50 dark:ring-gray-600/50">
                          <AvatarImage src={conversation.clients?.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {conversation.clients?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate">
                            {conversation.clients?.name || "Unknown"}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-1">
                            {formatTime(conversation.last_message_time)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conversation.clients?.company || "No company"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {conversation.last_message || "No messages yet"}
                        </p>
                      </div>
                      {conversation.unread_count > 0 && (
                        <Badge className="bg-blue-500 text-white border-0 text-xs flex-shrink-0 ml-1">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 shadow-lg flex flex-col">
          {selectedConversation && selectedConvData ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-white/20 dark:border-gray-600/20 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-9 h-9 ring-2 ring-white/50 dark:ring-gray-600/50">
                      <AvatarImage src={selectedConvData.clients?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {selectedConvData.clients?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {selectedConvData.clients?.name || "Unknown"}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {selectedConvData.clients?.company || "No company"} • Online
                      </p>
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
                    <div
                      key={message.id}
                      className={`flex ${message.sender_type === "admin" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.sender_type === "admin"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-white/60 dark:bg-gray-700/60 border border-white/30 dark:border-gray-600/30 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${message.sender_type === "admin" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}
                        >
                          {formatTime(message.sent_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-3 border-t border-white/20 dark:border-gray-600/20">
                <div className="flex items-end space-x-2">
                  <Button variant="ghost" size="sm" className="mb-1 h-8 w-8 p-0">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 min-h-[40px] max-h-32 bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 resize-none py-2"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white mb-1 h-8 w-8 p-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  No conversation selected
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
