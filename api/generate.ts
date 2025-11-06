import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: "Content-Type must be application/json" });
  }

  try {
    const { jobDescription, role } = req.body;

    if (!jobDescription || !role) {
      return res.status(400).json({ error: "jobDescription and role are required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not set!");
      return res.status(500).json({ error: "Missing GEMINI_API_KEY on server" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Based on the job description and role, generate JSON with:
      - resumeHighlights (3-5 bullet points)
      - skillsSummary (1 short paragraph)
      - coverLetter (full email-style letter)
      - interviewQuestions (5-7 bullets, format: Q:)
      - expectedAnswers (5-7 bullets, format: A:)
      IMPORTANT: Respond with one valid JSON object and nothing else.
      Job Description: ${jobDescription}
      Role: ${role}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const rawText = response.text?.trim() ?? "";
    console.log("Gemini raw response:", rawText);

    let parsedJSON = {};
    try {
      parsedJSON = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini:", parseError, rawText);
      return res.status(500).json({ error: "Invalid response from AI" /*, rawResponse: rawText */ });
    }

    return res.status(200).json(parsedJSON);

  } catch (err: any) {
    console.error("Backend Gemini Error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
