export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type QuestionCategory = 'HR' | 'Technical' | 'Behavioral' | 'Role-Specific';
export type DsaTopic =
  | 'Arrays'
  | 'Strings'
  | 'Trees'
  | 'Graphs'
  | 'Dynamic Programming'
  | 'Sliding Window'
  | 'Recursion'
  | 'Greedy';

export interface CareerInput {
  jobDescription: string;
  role: string;
  experienceLevel: string;
}

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  question: string;
  answer: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  topic: DsaTopic;
  platform: 'LeetCode' | 'GeeksforGeeks' | 'HackerRank' | 'NeetCode';
  link: string;
  explanation: string;
  importance: string;
}

export interface InterviewSectionData {
  questions: InterviewQuestion[];
  mockInterviewTips: string[];
  timerSuggestionSeconds: number;
}

export interface DsaSectionData {
  recommendations: DsaProblem[];
  dailyChallenge: DsaProblem;
  blind75Recommendations: string[];
}

export interface CareerPrepSectionData {
  resumeHighlights: string[];
  skillsSummary: string;
  atsKeywords: string[];
  coverLetter: string;
  linkedInSummary: string;
  projectImprovementSuggestions: string[];
}

export interface GeneratedContent {
  interview: InterviewSectionData;
  dsa: DsaSectionData;
  careerPrep: CareerPrepSectionData;
}

export type GenerationFocus = 'full' | 'interview' | 'dsa' | 'career';

export interface GenerateRequest extends CareerInput {
  focus?: GenerationFocus;
}

declare global {
  interface Window {
    aistudio?: {
      openSelectKey: () => Promise<void>;
    };
  }
}
