import { GoogleGenAI } from "@google/genai";
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
        "importance": "string"
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
      "importance": "string"
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
    const body = req.body as GenerateRequest;
    const { jobDescription, role, experienceLevel, focus = "full" } = body;

    if (!jobDescription || !role || !experienceLevel) {
      return res.status(400).json({ error: "jobDescription, role, and experienceLevel are required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY on server" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const focusGuidance =
      focus === "interview"
        ? "Emphasize fresh interview questions and answers while still returning all schema fields."
        : focus === "dsa"
          ? "Emphasize DSA recommendations, fresh daily challenge ideas, and role-specific coding prep while still returning all schema fields."
          : focus === "career"
            ? "Emphasize stronger resume bullets, ATS keywords, cover letter, LinkedIn summary, and project suggestions while still returning all schema fields."
            : "Balance all three product sections equally.";

    const prompt = `
${systemPrompt}

User context:
- Target role: ${role}
- Experience level: ${experienceLevel}
- Focus: ${focus}
- Job description:
${jobDescription}

Generation rules:
- Provide 10 interview questions covering all four categories with mixed difficulty.
- Provide 8 DSA recommendations across multiple topics and include one daily challenge.
- Make career-prep content highly tailored to the job description.
- ${focusGuidance}
- Use practical, production-ready language.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

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
