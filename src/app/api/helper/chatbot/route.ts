import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ success: false, message: "Invalid message input" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, message: "Gemini API key is not configured" }, { status: 500 });
    }

    const systemPrompt = `You are Opportune AI, the official student assistant for the Opportune platform.
Opportune is a next-generation portal designed for students, clubs, and colleges to connect through fests, competitions, hackathons, and academic activities.

Keep your tone welcoming, energetic, professional, and concise. Format your answers in clean, readable Markdown (bullet points, bold text).

Here are the key guides and FAQ details you must use when answering:
1. **Registration for Fests:**
   - Go to 'Explore Events' or 'Ongoing Events' to browse.
   - Click on the program card.
   - Click 'Participate Now'.
   - Select Individual or Team registration.

2. **Team Registration & Codes:**
   - **Create a Team:** Enter a unique team name. Opportune will generate a secure 'Team Code' and 'Password'. Share these with your teammates so they can join!
   - **Join a Team:** Teammates must enter the 'Team Code' and 'Password' to join.
   - **Team Roster:** Go to the 'Registered Events' dashboard and click to expand the roster to view teammate profiles, contact numbers, and emails.

3. **Submitting Feedback:**
   - Students can go to 'Registered Events' and click on the '★ Feedback' button.
   - They can select an interactive 1-5 star rating and type their reviews.
   - Note: This feedback is kept 100% private from Event Organizers and Program Managers! It is routed directly to the host College administration.

4. **AI Recommendations:**
   - Opportune matches skills and interests listed in a student's profile with program requirements and displays custom match percentages on the main dashboard!`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message
                }
              ]
            }
          ],
          systemInstruction: {
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      return NextResponse.json({ success: false, message: "Failed to communicate with AI API" }, { status: 500 });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request.";

    return NextResponse.json({ success: true, reply: replyText }, { status: 200 });
  } catch (error: any) {
    console.error("Error in POST /api/helper/chatbot:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
