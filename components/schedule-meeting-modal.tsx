"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Loader2 } from "lucide-react"
import { supabase, type Client } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface ScheduleMeetingModalProps {
  onMeetingScheduled?: () => void
  triggerButton?: React.ReactNode
  selectedClientId?: string
}

export function ScheduleMeetingModal({
  onMeetingScheduled,
  triggerButton,
  selectedClientId,
}: ScheduleMeetingModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client_id: selectedClientId || "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    meeting_type: "",
    location: "",
    status: "scheduled" as "scheduled" | "confirmed",
  })

  useEffect(() => {
    if (selectedClientId) {
      setFormData((prev) => ({ ...prev, client_id: selectedClientId }))
    }
  }, [selectedClientId])

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from("clients").select("*").eq("status", "active").order("name")

      if (error) throw error
      setClients(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch clients.",
        variant: "destructive",
      })
    } finally {
      setLoadingClients(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchClients()
    }
  }, [open])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      client_id: selectedClientId || "",
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      meeting_type: "",
      location: "",
      status: "scheduled",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Combine date and time for start and end
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`)
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`)

      if (endDateTime <= startDateTime) {
        throw new Error("End time must be after start time")
      }

      const { data, error } = await supabase
        .from("meetings")
        .insert([
          {
            title: formData.title,
            description: formData.description || null,
            client_id: formData.client_id,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            meeting_type: formData.meeting_type || null,
            location: formData.location || null,
            status: formData.status,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Success!",
        description: "Meeting has been scheduled successfully.",
      })

      resetForm()
      setOpen(false)
      onMeetingScheduled?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
      <Calendar className="w-4 h-4 mr-2" />
      Schedule Meeting
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Schedule New Meeting
          </DialogTitle>
          <DialogDescription>
            Fill in the meeting details below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Product Strategy Review"
              required
              className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client *</Label>
            {loadingClients ? (
              <div className="flex items-center space-x-2 p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-500">Loading clients...</span>
              </div>
            ) : (
              <Select
                value={formData.client_id}
                onValueChange={(value) => handleInputChange("client_id", value)}
                required
              >
                <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} {client.company && `(${client.company})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange("start_date", e.target.value)}
                required
                className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleInputChange("start_time", e.target.value)}
                required
                className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
                required
                className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleInputChange("end_time", e.target.value)}
                required
                className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_type">Meeting Type</Label>
              <Select value={formData.meeting_type} onValueChange={(value) => handleInputChange("meeting_type", value)}>
                <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="strategy">Strategy</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "scheduled" | "confirmed") => handleInputChange("status", value)}
              >
                <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Conference Room A, Zoom, etc."
              className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Meeting agenda and additional details..."
              className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 min-h-[80px]"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.title ||
                !formData.client_id ||
                !formData.start_date ||
                !formData.start_time ||
                !formData.end_date ||
                !formData.end_time
              }
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Meeting"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
