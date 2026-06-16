import type { VercelRequest, VercelResponse } from "@vercel/node";

const systemPrompt = `
You are an expert, professional resume writer.
The user has provided rough notes about their background. Your job is to transform these notes into a complete, structured, highly professional resume.
- Expand short notes into strong, action-oriented bullet points using the STAR method (Situation, Task, Action, Result) where possible.
- Ensure the tone is highly professional, confident, and ATS-friendly.
- Fix grammar, improve vocabulary, and structure the content properly.
- If the user provides very little info for a section, extrapolate reasonably based on standard industry practices for their stated role, but keep it realistic.

You MUST return exactly ONE valid JSON object with NO markdown, NO backticks, and NO prose outside the JSON.
The response must strictly follow this schema:
{
  "personal": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "portfolio": "string",
    "summary": "string (A strong 2-4 sentence professional summary)"
  },
  "education": [
    {
      "id": "string (unique)",
      "institution": "string",
      "location": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string",
      "gpa": "string"
    }
  ],
  "experience": [
    {
      "id": "string (unique)",
      "company": "string",
      "role": "string",
      "startDate": "string",
      "endDate": "string",
      "bullets": ["string (professional bullet point 1)", "string (professional bullet point 2)"]
    }
  ],
  "projects": [
    {
      "id": "string (unique)",
      "name": "string",
      "technologies": "string (comma separated list)",
      "bullets": ["string (professional bullet point 1)"]
    }
  ],
  "skills": [
    {
      "id": "string (unique)",
      "category": "string (e.g., 'Languages', 'Frontend', 'Backend', 'Tools')",
      "items": "string (comma separated list of skills)"
    }
  ],
  "achievements": ["string", "string"]
}
`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getErrorStatus = (error: unknown) => {
  if (!error || typeof error !== "object") return undefined;
  const candidate = error as { status?: unknown; code?: unknown };
  if (typeof candidate.status === "number") return candidate.status;
  if (typeof candidate.code === "number") return candidate.code;
  return undefined;
};

const isRateLimitError = (error: unknown) => {
  const status = getErrorStatus(error);
  if (status === 429) return true;
  if (!error || typeof error !== "object") return false;
  const message = "message" in error ? String((error as { message?: unknown }).message || "") : "";
  const normalized = message.toLowerCase();
  return (
    message.includes("429") ||
    normalized.includes("rate limit") ||
    normalized.includes("quota exceeded") ||
    normalized.includes("resource exhausted") ||
    normalized.includes("bom1::")
  );
};

const isTransientProviderError = (error: unknown) => {
  const status = getErrorStatus(error);
  if (status && status >= 500) return true;
  if (!error || typeof error !== "object") return false;
  const message = "message" in error ? String((error as { message?: unknown }).message || "") : "";
  const normalized = message.toLowerCase();
  return (
    normalized.includes("function_invocation_failed") ||
    normalized.includes("internal") ||
    normalized.includes("server error") ||
    normalized.includes("unavailable")
  );
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { GoogleGenAI } = await import("@google/genai");
    
    // Dynamic import of aiRouter logic
    const aiRouter = await import('./aiRouter.js').catch(async () => import('./aiRouter'));
    const { getAvailableProviderCount, getModelFallbackChain, getProviderSelection } = aiRouter as any;

    const { personalNotes, experienceNotes, projectNotes, educationNotes, skillsNotes } = req.body;

    const prompt = `
${systemPrompt}

Here are the user's raw notes:
---
[PERSONAL & CONTACT DETAILS]
${personalNotes || "Not provided"}

[EXPERIENCE NOTES]
${experienceNotes || "Not provided"}

[PROJECT NOTES]
${projectNotes || "Not provided"}

[EDUCATION NOTES]
${educationNotes || "Not provided"}

[SKILLS & ACHIEVEMENTS NOTES]
${skillsNotes || "Not provided"}
---

Remember, output strictly valid JSON matching the schema. Expand short bullets, format nicely, and be highly professional.
`;

    // We can mock a GenerateRequest just to use the existing routing logic
    const mockReq = { role: "Software Engineer", experienceLevel: "Mid-level", jobDescription: prompt, focus: "full" };
    const availableProviders = getAvailableProviderCount(mockReq);

    if (availableProviders === 0) {
      return res.status(500).json({ error: "Missing Gemini API keys on server." });
    }

    let responseText = "";
    let lastError: unknown = null;

    const modelChain = getModelFallbackChain("gemini-2.5-pro"); // Use Pro model for high-quality writing

    for (const model of modelChain) {
      for (let attempt = 0; attempt < availableProviders; attempt += 1) {
        const provider = getProviderSelection(mockReq, { modelOverride: model as any, poolSuffix: `m${model}` });
        if (!provider) break;

        try {
          const ai = new GoogleGenAI({ apiKey: provider.key });
          const response = await ai.models.generateContent({
            model: provider.model,
            contents: prompt,
            config: { responseMimeType: "application/json" },
          });
          responseText = response.text?.trim() ?? "";
          break;
        } catch (error) {
          lastError = error;
          const isRateLimit = isRateLimitError(error);
          const isTransient = isTransientProviderError(error);

          if (!isRateLimit && !isTransient) throw error;
          if (attempt === availableProviders - 1) break;
          if (isRateLimit && attempt < availableProviders - 1) await sleep(500 + attempt * 200);
        }
      }
      if (responseText) break;
    }

    if (!responseText) {
      throw lastError || new Error("Failed to generate resume");
    }

    const parsed = JSON.parse(responseText);
    return res.status(200).json(parsed);

  } catch (err: any) {
    console.error("Backend Generate Resume Error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
