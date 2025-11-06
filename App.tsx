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
  const [loadingMore, setLoadingMore] = useState(false);
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

  const handleGenerateMore = useCallback(async () => {
    if (!jobDescription || !role) return;
    setLoadingMore(true);
    setError(null);
    try {
      const moreContent = await generateResumeContent(jobDescription, role, 'Generate (6-7) more interview questions and answers based on the job description and role provided.');
      setGeneratedContent(prev => prev && {
        ...prev,
        interviewQuestions: prev.interviewQuestions + '\n' + moreContent.interviewQuestions,
        expectedAnswers: prev.expectedAnswers + '\n' + moreContent.expectedAnswers,
      });
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoadingMore(false);
    }
  }, [jobDescription, role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003973] via-[#e5e5be] to-[#E5E5BE] bg-animate flex flex-col text-slate-100">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-10 flex flex-col items-center relative">
        {/* Animated gradient background behind InputSection */}
        <div className="absolute inset-x-0 top-0 h-[330px] pointer-events-none -z-10">
          <div className="w-full h-full bg-gradient-to-tr from-blue-800/40 via-cyan-200/30 to-white/40 blur-2xl animate-gradient-move"></div>
        </div>
        <div className="w-full max-w-2xl">
          <InputSection
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            role={role}
            setRole={setRole}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            glass
          />
        </div>
        <div className="flex flex-col gap-10 max-w-3xl w-full mx-auto mt-10">
          {isLoading && <Loader />}
          {error && (
            <div className="glass-card border border-rose-600 bg-rose-800/40 text-rose-200 p-4 rounded-2xl">
              {error}
            </div>
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
                onGenerateMore={handleGenerateMore}
                loadingMore={loadingMore}
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
