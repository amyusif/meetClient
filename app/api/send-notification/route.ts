import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend("re_25HWAwsr_KMeudk3YJWYyzfKX1K4JF33e")

export async function POST(request: NextRequest) {
  try {
    const { clientEmail, clientName, emailSubject, emailBody } = await request.json()

    if (!clientEmail || !clientName || !emailSubject || !emailBody) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: "MeetSync <onboarding@resend.dev>", // Replace with your verified domain
      to: [clientEmail],
      subject: emailSubject,
      html: emailBody,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
