import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient("https://dqrrfzbrkqjwqoyiipry.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcnJmemJya3Fqd3FveWlpcHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjM3NDQsImV4cCI6MjA2MzU5OTc0NH0.JbNHXv1QRU6AfoZPLloqdt_TMAFNCuuSOs_TzOHn5LA")

export type Client = {
  id: string
  name: string
  company?: string
  email: string
  phone?: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
  notes?: string
  avatar_url?: string
}
