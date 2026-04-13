import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code || code.trim() === "") {
      return NextResponse.json(
        { error: "No code provided" },
        { status: 400 }
      );
    }

    const variationSeed = Math.random().toString(36).substring(7);

    const prompt = `
Return STRICT JSON only. No extra text.

Format:
{
  "roast": "string",
  "feedback": {
    "Bugs": "string",
    "Optimization": "string",
    "Readability": "string"
  },
  "improvedCode": "ONLY the full improved code. No explanations, no markdown, no comments outside code.",
  "detected": {
    "language": "string",
    "tech": "string"
  }
}

Code:
${code}

Make it funny but useful.

IMPORTANT RULES:
- Do NOT include explanations in "improvedCode"
- Do NOT repeat the input code unless improved
- "improvedCode" must be complete and usable
- Keep roast short (max 2-3 lines)
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
      }),
    });

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        roast: text,
        feedback: {
          Bugs: "Parsing failed",
          Optimization: "",
          Readability: "",
        },
        improvedCode: "// Failed to parse AI response",
        detected: {
          language: "Unknown",
          tech: "Unknown",
        },
      };
    }

    return NextResponse.json({
      roast: parsed.roast || "",
      feedback: parsed.feedback || {},
      improvedCode: parsed.improvedCode || "",
      detected: parsed.detected || {
        language: "Unknown",
        tech: "Unknown",
      },
    });

  } catch (err) {
    return NextResponse.json({
      roast: "Backend crashed harder than your code.",
      feedback: {
        Bugs: "Server error",
        Optimization: "",
        Readability: "",
      },
      improvedCode: "// Failed",
    });
  }
}