"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { User, Mail, Calendar, Clock, Bell, Shield, Palette, Camera, Save } from "lucide-react"

const profileStats = [
  { label: "Total Meetings", value: "247", icon: Calendar },
  { label: "Active Clients", value: "156", icon: User },
  { label: "Hours Scheduled", value: "1,240", icon: Clock },
  { label: "Response Rate", value: "98%", icon: Mail },
]

export function ProfilePanel() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>
        <Button className="self-start md:self-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="lg:col-span-2 backdrop-blur-sm bg-white/40 border border-white/30 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-white/50">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                    AD
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white shadow-md hover:bg-gray-50"
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Admin User</h3>
                <p className="text-gray-600">Meeting Scheduler Administrator</p>
                <Badge className="mt-2 bg-green-100 text-green-700 border-green-200">Premium Account</Badge>
              </div>
            </div>

            <Separator className="bg-white/30" />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input id="firstName" defaultValue="Admin" className="bg-white/50 border-white/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input id="lastName" defaultValue="User" className="bg-white/50 border-white/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="admin@meetsync.com"
                  className="bg-white/50 border-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </Label>
                <Input id="phone" defaultValue="+1 (555) 123-4567" className="bg-white/50 border-white/30" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <Input id="location" defaultValue="San Francisco, CA" className="bg-white/50 border-white/30" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Settings */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <Card className="backdrop-blur-sm bg-white/40 border border-white/30 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle>Profile Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profileStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-600">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <Card className="backdrop-blur-sm bg-white/40 border border-white/30 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Quick Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Email Notifications</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Auto-scheduling</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Palette className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Dark Mode</span>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Two-Factor Auth</span>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
