import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { DifficultyLevel, DsaTopic, GenerateRequest, QuestionCategory } from "../types";

const allowedDifficulties: DifficultyLevel[] = ["Easy", "Medium", "Hard"];
const allowedCategories: QuestionCategory[] = ["HR", "Technical", "Behavioral", "Role-Specific"];
const allowedTopics: DsaTopic[] = [
  "Arrays",
  "Strings",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Sliding Window",
  "Recursion",
  "Greedy",
];
const allowedPlatforms = ["LeetCode", "GeeksforGeeks", "HackerRank", "NeetCode"] as const;

const normalizeDifficulty = (value: unknown): DifficultyLevel => {
  return allowedDifficulties.includes(value as DifficultyLevel) ? (value as DifficultyLevel) : "Medium";
};

const normalizeCategory = (value: unknown): QuestionCategory => {
  return allowedCategories.includes(value as QuestionCategory) ? (value as QuestionCategory) : "Technical";
};

const normalizeTopic = (value: unknown): DsaTopic => {
  return allowedTopics.includes(value as DsaTopic) ? (value as DsaTopic) : "Arrays";
};

const normalizePlatform = (value: unknown) => {
  return allowedPlatforms.includes(value as (typeof allowedPlatforms)[number])
    ? (value as (typeof allowedPlatforms)[number])
    : "LeetCode";
};

const asStringArray = (value: unknown, fallback: string[] = []) => {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => String(item).trim()).filter(Boolean);
};

const createId = (prefix: string, index: number) => `${prefix}-${index + 1}`;

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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const systemPrompt = `
You are an expert AI career preparation assistant.
Return exactly one valid JSON object with no markdown, no backticks, and no prose outside JSON.
The response must follow this schema:
{
  "interview": {
    "questions": [
      {
        "id": "string",
        "category": "HR | Technical | Behavioral | Role-Specific",
        "difficulty": "Easy | Medium | Hard",
        "question": "string",
        "answer": "string"
      }
    ],
    "mockInterviewTips": ["string"],
    "timerSuggestionSeconds": number
  },
  "dsa": {
    "recommendations": [
      {
        "id": "string",
        "title": "string",
        "difficulty": "Easy | Medium | Hard",
        "topic": "Arrays | Strings | Trees | Graphs | Dynamic Programming | Sliding Window | Recursion | Greedy",
        "platform": "LeetCode | GeeksforGeeks | HackerRank | NeetCode",
        "link": "https://...",
        "explanation": "string",
        "importance": "string",
        "pseudocodeSteps": ["string"]
      }
    ],
    "dailyChallenge": {
      "id": "string",
      "title": "string",
      "difficulty": "Easy | Medium | Hard",
      "topic": "Arrays | Strings | Trees | Graphs | Dynamic Programming | Sliding Window | Recursion | Greedy",
      "platform": "LeetCode | GeeksforGeeks | HackerRank | NeetCode",
      "link": "https://...",
      "explanation": "string",
      "importance": "string",
      "pseudocodeSteps": ["string"]
    },
    "blind75Recommendations": ["string"]
  },
  "careerPrep": {
    "resumeHighlights": ["string"],
    "skillsSummary": "string",
    "atsKeywords": ["string"],
    "coverLetter": "string",
    "linkedInSummary": "string",
    "projectImprovementSuggestions": ["string"]
  }
}
Keep items concise, specific, role-aware, and interview-relevant.
Ensure URLs are real-looking direct links for the recommended platforms.
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  if (!String(req.headers["content-type"] || "").includes("application/json")) {
    return res.status(400).json({ error: "Content-Type must be application/json" });
  }

  try {
    // Dynamically import the Google GenAI client to ensure any import-time
    // errors (missing native bindings, incompatible runtime, etc.) are
    // caught and turned into a JSON error response instead of crashing the
    // serverless function with a non-JSON HTML/text error page.
    const { GoogleGenAI } = await import("@google/genai");

    const body = req.body as GenerateRequest;

    // Dynamically import aiRouter helpers to avoid ESM resolution issues
    // in serverless runtime (Vercel). Import the compiled .js module path
    // to match Node ESM resolution in production.
    const aiRouter = await import('./aiRouter.js').catch(async (e) => {
      // Try without .js as a fallback
      return import('./aiRouter');
    });

    const { getAvailableProviderCount, getModelFallbackChain, getProviderSelection } = aiRouter as any;
    const { jobDescription, role, companyContext, experienceLevel, focus = "full" } = body;

    if (!jobDescription || !role || !experienceLevel) {
      return res.status(400).json({ error: "jobDescription, role, and experienceLevel are required" });
    }

    const availableProviders = getAvailableProviderCount(body);
    if (availableProviders === 0) {
      return res.status(500).json({
        error:
          "Missing Gemini API keys on server. Set GEMINI_API_KEY, GEMINI_API_KEY_1..., GEMINI_API_KEYS, or model-specific pools.",
      });
    }

    const focusGuidance =
      focus === "interview"
        ? "Emphasize fresh interview questions and answers while still returning all schema fields."
        : focus === "dsa"
          ? "Emphasize highly role-specific DSA recommendations derived from the job description, the company context, and the likely interview bar for that role while still returning all schema fields."
          : focus === "career"
            ? "Emphasize stronger resume bullets, ATS keywords, cover letter, LinkedIn summary, and project suggestions while still returning all schema fields."
            : "Balance all three product sections equally.";

    const prompt = `
${systemPrompt}

User context:
- Target role: ${role}
- Company context: ${companyContext?.trim() || "Not provided"}
- Experience level: ${experienceLevel}
- Focus: ${focus}
- Job description:
${jobDescription}

Generation rules:
-  Provide 10 interview questions covering all four categories with mixed difficulty.
- Interview answers must be concise, precise, practical, and directly useful for real interviews.
- Avoid long theoretical explanations or generic AI-style paragraphs.
- Answers should sound like strong candidate responses suitable for quick revision before interviews.
- Prefer structured answers with clarity, confidence, and practical reasoning.
- Keep most answers between 3 to 6 lines unless deeper explanation is necessary.
- Provide 8 DSA recommendations across multiple topics and include one daily challenge.
- DSA recommendations must be different for different job descriptions and company contexts. Do not return the same generic list for every prompt.
- Infer the most relevant DSA topics from the job description. For example: backend/platform roles may emphasize graphs, trees, heaps, hash maps, and system-oriented problem solving; frontend roles may emphasize arrays, strings, sliding window, and practical coding fluency; ML/data roles may emphasize arrays, matrices, heaps, graphs, and optimization patterns.
- When a company context is provided, adapt the DSA list to that likely interview style and difficulty bar.
- For each DSA recommendation, explain why it is relevant for this specific role or company context, not just why it is generally useful.
- For each DSA recommendation and the daily challenge, include 4 to 7 short pseudocode steps that describe the solving approach without giving full code.
- Pseudocode must stay language-agnostic and should guide thinking, not reveal a copy-paste answer.
- Make career-prep content highly tailored to the job description.
- When company context is provided, make the answers and suggestions specific to that company, product space, or hiring emphasis.
- ${focusGuidance}
- Use practical, production-ready language.
`;

    let response: Awaited<ReturnType<any["models"]["generateContent"]>> | null = null;
    let lastError: unknown = null;

    // Try the chosen model first, then fall back to cheaper models if Gemini returns a transient internal error or rate limit.
    const primaryProvider = getProviderSelection(body);
    const modelChain = primaryProvider ? getModelFallbackChain(primaryProvider.model) : ["gemini-2.5-flash"];

    for (const model of modelChain) {
      for (let attempt = 0; attempt < availableProviders; attempt += 1) {
        const provider = getProviderSelection(body, { modelOverride: model as any, poolSuffix: `m${model}` });
        if (!provider) break;

        try {
          const ai = new GoogleGenAI({ apiKey: provider.key });
          response = await ai.models.generateContent({
            model: provider.model,
            contents: prompt,
            config: { responseMimeType: "application/json" },
          });
          console.info(`[AI Router] focus=${focus} model=${provider.model} pool=${provider.poolName}`);
          break;
        } catch (error) {
          lastError = error;

          const isRateLimit = isRateLimitError(error);
          const isTransient = isTransientProviderError(error);
          const shouldRetry = isRateLimit || isTransient;

          if (!shouldRetry) {
            throw error;
          }

          if (attempt === availableProviders - 1) {
            // Exhausted attempts for this model, try next model in chain
            console.warn(`[AI Router] ${isRateLimit ? "Rate limited" : "Transient error"} on ${model}, trying next model`);
            break;
          }

          // Add small delay before retrying (helps with rate limits)
          if (isRateLimit && attempt < availableProviders - 1) {
            await sleep(500 + attempt * 200);
          }
        }
      }

      if (response) break;
    }

    if (!response) {
      throw lastError || new Error("Failed to generate content");
    }

    const rawText = response.text?.trim() ?? "";
    const parsed = JSON.parse(rawText);

    const questions = Array.isArray(parsed?.interview?.questions)
      ? parsed.interview.questions.map((item: any, index: number) => ({
          id: String(item?.id || createId("question", index)),
          category: normalizeCategory(item?.category),
          difficulty: normalizeDifficulty(item?.difficulty),
          question: String(item?.question || "").trim(),
          answer: String(item?.answer || "").trim(),
        }))
      : [];

    const recommendations = Array.isArray(parsed?.dsa?.recommendations)
      ? parsed.dsa.recommendations.map((item: any, index: number) => ({
          id: String(item?.id || createId("problem", index)),
          title: String(item?.title || "").trim(),
          difficulty: normalizeDifficulty(item?.difficulty),
          topic: normalizeTopic(item?.topic),
          platform: normalizePlatform(item?.platform),
          link: String(item?.link || "").trim(),
          explanation: String(item?.explanation || "").trim(),
          importance: String(item?.importance || "").trim(),
          pseudocodeSteps: asStringArray(item?.pseudocodeSteps, [
            "Clarify the input, output, and edge cases first.",
            "Identify the core data structure or pattern to use.",
            "Walk through the main algorithm step by step.",
            "Verify the result on a small example before coding.",
          ]),
        }))
      : [];

    const dailyChallengeSource = parsed?.dsa?.dailyChallenge || recommendations[0] || {};
    const payload = {
      interview: {
        questions,
        mockInterviewTips: asStringArray(parsed?.interview?.mockInterviewTips, [
          "Use the STAR framework for behavioral stories.",
          "Keep technical answers structured: context, approach, tradeoffs, outcome.",
          "Practice concise answers first, then expand when asked.",
        ]),
        timerSuggestionSeconds:
          Number.isFinite(parsed?.interview?.timerSuggestionSeconds) && parsed.interview.timerSuggestionSeconds > 0
            ? parsed.interview.timerSuggestionSeconds
            : 90,
      },
      dsa: {
        recommendations,
        dailyChallenge: {
          id: String(dailyChallengeSource?.id || "daily-1"),
          title: String(dailyChallengeSource?.title || "Two Sum").trim(),
          difficulty: normalizeDifficulty(dailyChallengeSource?.difficulty),
          topic: normalizeTopic(dailyChallengeSource?.topic),
          platform: normalizePlatform(dailyChallengeSource?.platform),
          link: String(dailyChallengeSource?.link || "https://leetcode.com/problems/two-sum/").trim(),
          explanation: String(
            dailyChallengeSource?.explanation || "A fast warm-up problem focused on efficient lookup patterns."
          ).trim(),
          importance: String(
            dailyChallengeSource?.importance || "Frequently used to test hash map fundamentals in interviews."
          ).trim(),
          pseudocodeSteps: asStringArray(dailyChallengeSource?.pseudocodeSteps, [
            "Scan the array once while tracking values seen so far.",
            "For each value, compute the complement needed to reach the target.",
            "If the complement was seen earlier, return the matching indices.",
            "Otherwise store the current value with its index and continue.",
          ]),
        },
        blind75Recommendations: asStringArray(parsed?.dsa?.blind75Recommendations, [
          "Two Sum",
          "Valid Anagram",
          "Maximum Subarray",
          "Binary Tree Level Order Traversal",
        ]),
      },
      careerPrep: {
        resumeHighlights: asStringArray(parsed?.careerPrep?.resumeHighlights),
        skillsSummary: String(parsed?.careerPrep?.skillsSummary || "").trim(),
        atsKeywords: asStringArray(parsed?.careerPrep?.atsKeywords),
        coverLetter: String(parsed?.careerPrep?.coverLetter || "").trim(),
        linkedInSummary: String(parsed?.careerPrep?.linkedInSummary || "").trim(),
        projectImprovementSuggestions: asStringArray(parsed?.careerPrep?.projectImprovementSuggestions),
      },
    };

    return res.status(200).json(payload);
  } catch (err: any) {
    console.error("Backend Gemini Error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
