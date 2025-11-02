import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedContent } from "../types";

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    resumeHighlights: {
      type: Type.STRING,
      description: "A bulleted list of 3-5 resume highlights, each on a new line.",
    },
    skillsSummary: {
      type: Type.STRING,
      description: "A concise paragraph summarizing key technical and soft skills.",
    },
    coverLetter: {
      type: Type.STRING,
      description: "A full draft of a professional cover letter. Use newline for paragraphs.",
    },
    interviewQuestions: {
      type: Type.STRING,
      description: "A bulleted list (5-7) of typical interview questions for this job.",
    },
    expectedAnswers: {
      type: Type.STRING,
      description: "A bulleted list of ideal answers, matching the interview questions above in order.",
    },
  },
  required: [
    "resumeHighlights",
    "skillsSummary",
    "coverLetter",
    "interviewQuestions",
    "expectedAnswers"
  ],
};

export const generateResumeContent = async (
  jobDescription: string,
  role: string
): Promise<GeneratedContent> => {
  const prompt = `
    Based on the following job description and role, generate:
    1. resumeHighlights: 3-5 resume rules/skills (bullet, '*')
    2. skillsSummary: Concise summary for resume - key tech and soft skills
    3. coverLetter: Full draft, addressed to a hiring manager
    4. interviewQuestions: 5-7 interview questions (tech + behavioral, bullet '*')
    5. expectedAnswers: Matching list of ideal brief answers to each question (bullet '*')
    
    Job Description:
    ---
    ${jobDescription}
    ---
    
    Desired Role:
    ---
    ${role}
    ---
    
    IMPORTANT: Output ONLY valid JSON matching the schema above.
    Do NOT include explanation, commentary, markdown, or triple backticks—output ONLY a single JSON object with NO extra text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    let jsonText = response.text ? response.text.trim() : "";
    console.log("Gemini raw response:", jsonText);

    // Remove ```json or ``` if present
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```json|```/g, "").trim();
    }

    try {
      const parsedContent = JSON.parse(jsonText) as GeneratedContent;
      return parsedContent;
    } catch (parseError) {
      console.error("Unable to parse Gemini response:", parseError);
      throw new Error("Gemini response could not be parsed. Raw output: " + jsonText);
    }
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw new Error("Failed to generate content. Please check your API key and try again.");
  }
};
