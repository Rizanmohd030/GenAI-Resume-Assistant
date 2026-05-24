import React, { useEffect, useState } from 'react';
import InputSection from './components/InputSection';
import Loader from './components/Loader';
import InterviewSection from './components/InterviewSection';
import DsaSection from './components/DsaSection';
import CareerPrepSection from './components/CareerPrepSection';
import Toast from './components/Toast';
import { generateCareerContent } from './services/geminiService';
import type {
  CareerInput,
  CareerPrepSectionData,
  DsaSectionData,
  GeneratedContent,
  GenerationFocus,
  InterviewSectionData,
} from './types';

const App: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [role, setRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('0-2 years');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [activeSection, setActiveSection] = useState('interview');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFocus, setLoadingFocus] = useState<GenerationFocus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedAction, setSelectedAction] = useState<'interview' | 'dsa' | 'career'>('interview');
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [bookmarkedProblemIds, setBookmarkedProblemIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const solved = window.localStorage.getItem('career-assistant-solved');
      const bookmarked = window.localStorage.getItem('career-assistant-bookmarked');

      if (solved) setSolvedProblemIds(JSON.parse(solved));
      if (bookmarked) setBookmarkedProblemIds(JSON.parse(bookmarked));
    } catch (storageError) {
      console.error('Failed to read local storage', storageError);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('career-assistant-solved', JSON.stringify(solvedProblemIds));
  }, [solvedProblemIds]);

  useEffect(() => {
    window.localStorage.setItem('career-assistant-bookmarked', JSON.stringify(bookmarkedProblemIds));
  }, [bookmarkedProblemIds]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const userInput: CareerInput = {
    jobDescription,
    role,
    experienceLevel,
  };

  const runGeneration = async (focus: GenerationFocus = 'full') => {
    if (!jobDescription || !role || !experienceLevel) return;

    setError(null);
    if (focus === 'full') {
      setIsLoading(true);
    } else {
      setLoadingFocus(focus);
    }

    try {
      const next = await generateCareerContent({ ...userInput, focus });
      setGeneratedContent((current) => {
        if (!current || focus === 'full') return next;
        if (focus === 'interview') return { ...current, interview: next.interview };
        if (focus === 'dsa') return { ...current, dsa: next.dsa };
        return { ...current, careerPrep: next.careerPrep };
      });

      if (focus === 'interview' || focus === 'full') setActiveSection('interview');
      if (focus === 'dsa') setActiveSection('dsa');
      if (focus === 'career') setActiveSection('career');

      setToastMessage(
        focus === 'full'
          ? 'Fresh career prep generated.'
          : focus === 'interview'
            ? 'Interview Q&A ready.'
            : focus === 'dsa'
              ? 'DSA recommendations refreshed.'
              : 'Career prep content refreshed.'
      );
    } catch (generationError: any) {
      setError(generationError.message || 'Something went wrong while generating content.');
    } finally {
      setIsLoading(false);
      setLoadingFocus(null);
    }
  };

  const handleToggleSolved = (id: string) => {
    setSolvedProblemIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
    setToastMessage('Updated solved problems.');
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedProblemIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
    setToastMessage('Updated bookmarks.');
  };

  const handleCareerFieldChange = (field: keyof CareerPrepSectionData, value: string | string[]) => {
    setGeneratedContent((current) =>
      current
        ? {
            ...current,
            careerPrep: {
              ...current.careerPrep,
              [field]: value,
            },
          }
        : current
    );
  };

  const handleDownloadPdf = () => {
    if (!generatedContent) return;

    const printable = `
      <html>
        <head>
          <title>GenAI Career Assistant Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111827; }
            h1, h2 { margin-bottom: 12px; }
            h2 { margin-top: 28px; }
            ul { padding-left: 20px; }
            p, li { line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>GenAI Career Assistant</h1>
          <p><strong>Role:</strong> ${role}</p>
          <p><strong>Experience Level:</strong> ${experienceLevel}</p>
          <h2>Resume Highlights</h2>
          <ul>${generatedContent.careerPrep.resumeHighlights.map((item) => `<li>${item}</li>`).join('')}</ul>
          <h2>Skills Summary</h2>
          <p>${generatedContent.careerPrep.skillsSummary}</p>
          <h2>ATS Keywords</h2>
          <p>${generatedContent.careerPrep.atsKeywords.join(', ')}</p>
          <h2>LinkedIn Summary</h2>
          <p>${generatedContent.careerPrep.linkedInSummary}</p>
          <h2>Cover Letter</h2>
          <p>${generatedContent.careerPrep.coverLetter.replace(/\n/g, '<br/>')}</p>
          <h2>Project Improvement Suggestions</h2>
          <ul>${generatedContent.careerPrep.projectImprovementSuggestions.map((item) => `<li>${item}</li>`).join('')}</ul>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      setToastMessage('Popup blocked. Allow popups to export PDF.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(printable);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setToastMessage('Opened printable PDF view.');
  };

  const quickActions = [
    { id: 'interview', label: 'Interview Q&A' },
    { id: 'dsa', label: 'DSA Preparation' },
    { id: 'career', label: 'Career Prep' },
  ];

  const handlePrimarySubmit = () => {
    runGeneration(selectedAction);
  };

  const isBusy = isLoading || loadingFocus !== null;
  const visibleInterview = Boolean(generatedContent && selectedAction === 'interview');
  const visibleDsa = Boolean(generatedContent && selectedAction === 'dsa');
  const visibleCareer = Boolean(generatedContent && selectedAction === 'career');

  const handleSelectAction = (id: 'interview' | 'dsa' | 'career') => {
    setSelectedAction(id);
    setActiveSection(id);

    if (!jobDescription || !role || isBusy) return;

    if (!generatedContent) return;

    if (id === 'interview') {
      return;
    }

    runGeneration(id);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,#f7f8fc_0%,#f6f7fb_48%,#eef3fb_100%)]" />
      <div className="pointer-events-none fixed left-[5%] top-28 h-[74vh] w-[52vw] rounded-[3rem] bg-[linear-gradient(180deg,#0f4d7f,#235f93)] shadow-[0_40px_120px_rgba(21,75,117,0.25)]" />
      <div className="pointer-events-none fixed right-[6%] top-24 h-[78vh] w-[34vw] rounded-[3rem] bg-[linear-gradient(180deg,#f8f8f5,#eef2f7)] shadow-[0_40px_100px_rgba(148,163,184,0.15)]" />
      <div className="pointer-events-none fixed left-[4%] top-24 h-[82vh] w-[92vw] rounded-[3rem] border border-slate-200/80" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-8 md:px-6">

        <main className="mt-6 flex-1">
          <InputSection
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            role={role}
            setRole={setRole}
            experienceLevel={experienceLevel}
            onSubmit={handlePrimarySubmit}
            isLoading={isBusy}
            quickActions={quickActions}
            activeAction={selectedAction}
            onSelectAction={(id) => handleSelectAction(id as 'interview' | 'dsa' | 'career')}
          />

          <div className="mt-8">
            {error && (
              <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-[0_20px_45px_rgba(244,63,94,0.08)]">
                {error}
              </div>
            )}

            {isBusy && <Loader />}

            {!isLoading && generatedContent && (
              <>
                {visibleInterview && (
                  <InterviewSection
                    data={generatedContent.interview as InterviewSectionData}
                    onGenerateMore={() => runGeneration('interview')}
                    isGeneratingMore={loadingFocus === 'interview'}
                  />
                )}

                {visibleDsa && (
                  <DsaSection
                    data={generatedContent.dsa as DsaSectionData}
                    solvedProblemIds={solvedProblemIds}
                    bookmarkedProblemIds={bookmarkedProblemIds}
                    onToggleSolved={handleToggleSolved}
                    onToggleBookmark={handleToggleBookmark}
                  />
                )}

                {visibleCareer && (
                  <CareerPrepSection
                    data={generatedContent.careerPrep as CareerPrepSectionData}
                    onFieldChange={handleCareerFieldChange}
                    onRegenerate={() => runGeneration('career')}
                    isRegenerating={loadingFocus === 'career'}
                    onDownloadPdf={handleDownloadPdf}
                  />
                )}
              </>
            )}

            {!isLoading && !generatedContent && (
              <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 text-center text-slate-600 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                Enter a role and job description, choose Interview Q&amp;A, DSA Preparation, or Career Prep, then press
                send. If you do nothing, Interview Q&amp;A stays selected by default.
              </div>
            )}
          </div>
        </main>
      </div>

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
};

export default App;
