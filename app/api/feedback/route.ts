import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { type, subject, message } = await request.json()

    const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL

    if (!WEBHOOK_URL) {
      console.log('Feedback received (Discord webhook not configured):', { type, subject, message })
      return NextResponse.json({ message: 'Feedback logged successfully!' }, { status: 200 })
    }

    const embed = {
      title: `[HumanEval Feedback] ${subject || 'No Subject'}`,
      description: message,
      color: 0x00f0ff,
      fields: [
        {
          name: 'Type',
          value: type || 'General',
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
    }

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    })

    if (response.ok) {
      return NextResponse.json({ message: 'Feedback submitted successfully!' }, { status: 200 })
    } else {
      console.warn('Webhook transmission returned non-200, continuing gracefully')
      return NextResponse.json({ message: 'Feedback received.' }, { status: 200 })
    }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json({ message: 'Feedback received.' }, { status: 200 })
  }
}