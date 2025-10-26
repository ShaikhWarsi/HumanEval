import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { type, subject, message } = await request.json();

  // Replace with your Discord webhook URL
  const WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    return NextResponse.json({ message: 'Discord webhook URL not configured.' }, { status: 500 });
  }

  const embed = {
    title: `New Feedback: ${subject}`,
    description: message,
    color: 0x00FF00, // Green color
    fields: [
      {
        name: 'Type',
        value: type,
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (response.ok) {
      return NextResponse.json({ message: 'Feedback submitted successfully!' }, { status: 200 });
    } else {
      const errorData = await response.json();
      console.error('Discord webhook error:', errorData);
      return NextResponse.json({ message: 'Failed to send feedback to Discord.' }, { status: response.status });
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}