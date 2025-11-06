export interface GenerateRequest {
  jobDescription: string;
  role: string;
}

export const generateResumeContent = async (jobDescription: string, role: string) => {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription, role }),
    });

    // Always read the body ONCE as text
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON from API", e);
      throw new Error(`Server returned invalid JSON: ${text}`);
    }

    if (!response.ok) {
      throw new Error(data?.error || "Unknown error from server");
    }

    return data;
  } catch (err: any) {
    console.error("generateResumeContent error:", err);
    throw new Error(err.message || "Failed to generate resume content");
  }
};
