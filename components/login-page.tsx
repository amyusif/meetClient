"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Calendar, Users, MessageSquare, TrendingUp, Loader2, Mail, Lock, Info } from "lucide-react"
import { useAuth } from "@/lib/auth"
import Image from "next/image"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await signIn(email, password)

    if (result.error) {
      setError(result.error)
    }

    setLoading(false)
  }

  const handleDemoLogin = async () => {
    setEmail("admin")
    setPassword("admin")
    setError("")
    setLoading(true)

    const result = await signIn("admin", "admin")

    if (result.error) {
      setError(result.error)
    }

    setLoading(false)
  }

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Effortlessly manage meetings and appointments with intelligent calendar integration",
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Keep track of all your clients with detailed profiles and interaction history",
    },
    {
      icon: MessageSquare,
      title: "Real-time Communication",
      description: "Stay connected with built-in messaging and notification systems",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Get valuable insights into your business performance and client engagement",
    },
  ]

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Welcome to MeetSync
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to access your admin dashboard</p>
          </div>

          {/* Login Card */}
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-700/20 shadow-2xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-semibold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="text"
                      placeholder="admin"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 focus:ring-blue-500 dark:focus:ring-blue-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 focus:ring-blue-500 dark:focus:ring-blue-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Demo Login Section */}
              <div className="mt-4 space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">Or try demo</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Try Demo Login
                </Button>

                {/* Demo Credentials Info */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Demo Credentials:</p>
                  <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                    <p>
                      <strong>Email:</strong> admin
                    </p>
                    <p>
                      <strong>Password:</strong> admin
                    </p>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">
                    Click "Try Demo Login" or enter credentials manually
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 MeetSync. All rights reserved.</p>
            <p className="mt-1">
              Need help?{" "}
              <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Contact Support</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration and Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;#ffffff&quot; fillOpacity=&quot;.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center p-8 xl:p-12 text-white overflow-y-auto">
          {/* Main Illustration */}
          <div className="mb-6">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-3xl backdrop-blur-sm"></div>
              <div className="relative p-6">
                <Image
                  src="/images/dashboard-mockup.png"
                  alt="Dashboard Preview"
                  width={500}
                  height={300}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl xl:text-3xl font-bold mb-3">Powerful Admin Dashboard</h2>
              <p className="text-blue-100 text-base xl:text-lg">
                Everything you need to manage your meetings and clients efficiently
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1 text-sm">{feature.title}</h3>
                    <p className="text-blue-100 text-xs">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Illustration */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-100">Trusted by 1000+ businesses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
