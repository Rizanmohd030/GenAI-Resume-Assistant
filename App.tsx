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
  const [companyContext, setCompanyContext] = useState('');
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
  const [shouldRevealResults, setShouldRevealResults] = useState(false);

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

  useEffect(() => {
    if (!shouldRevealResults) return;

    const resultsAnchor = document.getElementById('results-anchor');
    resultsAnchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [shouldRevealResults, generatedContent, error]);

  const userInput: CareerInput = {
    jobDescription,
    role,
    companyContext,
    experienceLevel,
  };

  const runGeneration = async (focus: GenerationFocus = 'full') => {
    if (!jobDescription || !role || !experienceLevel) return;

    setError(null);
    setShouldRevealResults(true);
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
          <p><strong>Company Context:</strong> ${companyContext || 'Not provided'}</p>
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
    runGeneration(generatedContent ? selectedAction : 'full');
  };

  const isBusy = isLoading || loadingFocus !== null;
  const isInitialLoading = isBusy && !generatedContent;
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
    <div className="relative min-h-screen overflow-hidden bg-[#f6f1e8] text-[#1f2933]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.68),transparent_34%),linear-gradient(180deg,#f7f2ea_0%,#f4efe6_52%,#f1ece2_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.18]" style={{ backgroundImage: 'radial-gradient(rgba(28,38,49,0.08) 0.55px, transparent 0.55px)', backgroundSize: '18px 18px' }} />
      <div className="pointer-events-none fixed left-[-10%] top-16 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(82,105,134,0.12),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none fixed right-[-8%] top-[18rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(176,161,135,0.12),transparent_72%)] blur-3xl" />
      <div className="relative mx-auto w-full max-w-[1440px] px-4 pt-8 md:px-6">
        <div className="pointer-events-none absolute inset-x-0 inset-y-0 rounded-[2.5rem] border border-[rgba(96,90,81,0.08)]" />

        <div className="relative flex min-h-screen flex-col">
          <main className="mt-6 flex-1">
            <InputSection
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              role={role}
              setRole={setRole}
              companyContext={companyContext}
              setCompanyContext={setCompanyContext}
              experienceLevel={experienceLevel}
              onSubmit={handlePrimarySubmit}
              isLoading={isBusy}
              quickActions={quickActions}
              activeAction={selectedAction}
              onSelectAction={(id) => handleSelectAction(id as 'interview' | 'dsa' | 'career')}
            />

            <div id="results-anchor" className="relative z-10 -mt-2 w-full min-h-[16rem] pb-8 md:-mt-4">
              {error && (
                <div className="rounded-[1.6rem] border border-rose-200/70 bg-[rgba(255,245,244,0.9)] p-4 text-sm text-rose-700 shadow-[0_10px_40px_rgba(190,24,93,0.06)]">
                  {error}
                </div>
              )}

              {isInitialLoading && <Loader />}

              {generatedContent && (
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
            </div>
          </main>
        </div>
      </div>

      <div className="relative z-10 flex justify-center px-4 pb-6 pt-6 md:px-6">
        <p className="text-sm text-[#8b8478]">
          build by{' '}
          <a
            href="https://rizanmi.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="font-serif text-[1.2rem] text-[#4b5563] transition hover:text-[#243b5a]"
          >
            <strong>Rizan</strong>
          </a>
        </p>
      </div>

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
};

export default App;
