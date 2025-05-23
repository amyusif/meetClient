"use client"

import { useState, useEffect } from "react"

export function LiveClock() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="text-left md:text-right bg-white/30 dark:bg-gray-800/30 rounded-xl px-4 py-2 border border-white/20 dark:border-gray-700/20">
      <p className="text-sm text-gray-500 dark:text-gray-400">Live</p>
      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{formatTime(currentTime)}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">{formatDate(currentTime)}</p>
    </div>
  )
}
