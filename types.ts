export type GeneratedContent = {
  resumeHighlights: string;
  skillsSummary: string;
  coverLetter: string;
  interviewQuestions: string;
  expectedAnswers: string;
};

declare global {
  interface Window {
    aistudio?: {
      openSelectKey: () => Promise<void>;
    };
  }
}

