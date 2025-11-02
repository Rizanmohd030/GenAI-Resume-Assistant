import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import Loader from './components/Loader';
import { generateResumeContent } from './services/geminiService';
import type { GeneratedContent } from './types';

const App: React.FC = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [role, setRole] = useState("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!jobDescription || !role) return;
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    try {
      const content = await generateResumeContent(jobDescription, role);
      setGeneratedContent(content);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [jobDescription, role]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <InputSection
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          role={role}
          setRole={setRole}
          onSubmit={handleGenerate}
          isLoading={isLoading}
        />
        <div className="flex flex-col gap-8 max-w-3xl mx-auto mt-10">
          {isLoading && (
            <Loader />
          )}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div>
          )}
          {!isLoading && !error && generatedContent && (
            <>
              <OutputSection title="Resume Highlights" content={generatedContent.resumeHighlights} />
              <OutputSection title="Skills Summary" content={generatedContent.skillsSummary} />
              <OutputSection title="Cover Letter Draft" content={generatedContent.coverLetter} />
              <OutputSection
                title="Interview Questions & Expected Answers"
                questions={generatedContent.interviewQuestions}
                answers={generatedContent.expectedAnswers}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
