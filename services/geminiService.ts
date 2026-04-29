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
    let text = "";
    try {
      text = await response.text();
    } catch (e) {
      console.error("Failed to read text from API", e);
      throw new Error("Server returned an invalid response.");
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON from API", e);
      // Since it's not JSON, it might be an HTML error page (like a 404 from Vite proxy)
      if (!response.ok) {
         throw new Error(`API returned ${response.status} ${response.statusText}. Ensure the backend is running.`);
      }
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
