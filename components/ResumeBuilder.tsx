import React, { useState } from 'react';
import ResumePreview from './ResumePreview';
import { sampleResumeData } from '../assets/resumeTemplate';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  location: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Project {
  id: string;
  name: string;
  technologies: string;
  bullets: string[];
}

export interface Skill {
  id: string;
  category: string;
  items: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  achievements: string[];
}

const textareaClass = 'w-full min-h-[7rem] resize-none rounded-2xl border border-[rgba(96,90,81,0.12)] bg-[rgba(252,248,242,0.96)] px-4 py-3 text-sm leading-6 text-[#202833] outline-none transition duration-300 placeholder:text-[#9b9488] focus:border-[#2c4467] focus:shadow-[0_0_0_5px_rgba(44,68,103,0.08)]';
const cardClass = 'rounded-2xl border border-[rgba(96,90,81,0.10)] bg-[rgba(255,252,248,0.6)] p-5 mb-6 transition-all duration-300 shadow-sm';
const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-[#6b6560] mb-2';

const ResumeBuilder: React.FC = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Raw inputs
  const [notes, setNotes] = useState({
    personal: '',
    experience: '',
    projects: '',
    education: '',
    skills: '',
  });

  // Final structured output
  const [resumeData, setResumeData] = useState<ResumeData>(sampleResumeData);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:3001/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalNotes: notes.personal,
          experienceNotes: notes.experience,
          projectNotes: notes.projects,
          educationNotes: notes.education,
          skillsNotes: notes.skills,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const generatedData: ResumeData = await res.json();
      setResumeData(generatedData);
      setIsEditing(false); // Switch to preview mode
    } catch (err: any) {
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdate = (field: keyof typeof notes, value: string) => {
    setNotes(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="relative z-10 w-full pb-12">
      <div className="mx-auto max-w-[62rem]">
        
        {isEditing ? (
          <div className="rounded-[1.5rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,250,244,0.72)] p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-[10px] md:rounded-[2rem] md:p-10 animate-fadeSlideIn">
            <div className="mb-8 text-center">
              <h3 className="font-serif text-3xl tracking-tight text-[#1f2933] sm:text-4xl">AI Resume Generator</h3>
              <p className="mt-3 text-[#8b8478] max-w-2xl mx-auto">
                Paste your rough notes below. Give us your details, experience, projects, and education in plain text. 
                Our AI will instantly write, structure, and format it into a perfect professional resume.
              </p>
            </div>

            <div className={cardClass}>
              <label className={labelClass}>Personal & Contact Details</label>
              <textarea 
                className={textareaClass} 
                placeholder="e.g. My name is John Doe, I live in NY. Email: john@doe.com. I am a Full Stack Developer with 3 years of experience..." 
                value={notes.personal} 
                onChange={(e) => handleUpdate('personal', e.target.value)} 
              />
            </div>

            <div className={cardClass}>
              <label className={labelClass}>Experience</label>
              <textarea 
                className={textareaClass} 
                placeholder="e.g. Worked at Amazon as an SDE Intern from May to Aug 2023. Built a Node.js microservice that increased throughput by 20%..." 
                value={notes.experience} 
                onChange={(e) => handleUpdate('experience', e.target.value)} 
              />
            </div>

            <div className={cardClass}>
              <label className={labelClass}>Projects</label>
              <textarea 
                className={textareaClass} 
                placeholder="e.g. Built a weather app using React and OpenWeather API. Also made a discord bot in Python..." 
                value={notes.projects} 
                onChange={(e) => handleUpdate('projects', e.target.value)} 
              />
            </div>

            <div className={cardClass}>
              <label className={labelClass}>Education</label>
              <textarea 
                className={textareaClass} 
                placeholder="e.g. BS in Computer Science from XYZ University. Graduated May 2024. GPA 3.8." 
                value={notes.education} 
                onChange={(e) => handleUpdate('education', e.target.value)} 
              />
            </div>

            <div className={cardClass}>
              <label className={labelClass}>Skills & Achievements</label>
              <textarea 
                className={textareaClass} 
                placeholder="e.g. Know JS, TS, React, Node. Won first place in university hackathon 2022." 
                value={notes.skills} 
                onChange={(e) => handleUpdate('skills', e.target.value)} 
              />
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="flex justify-center mt-8">
              <button 
                type="button" 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-[rgba(41,63,96,0.12)] bg-[#243b5a] px-8 py-4 text-base font-medium text-[#f8f5ee] shadow-[0_8px_24px_rgba(36,59,90,0.18)] transition duration-300 hover:bg-[#1f3551] hover:shadow-[0_12px_30px_rgba(36,59,90,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating your professional resume...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Generate Resume
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="text-sm font-medium text-[#6b6560] underline decoration-[#6b6560]/30 underline-offset-4 hover:text-[#2c4467]"
              >
                Skip straight to preview (use default layout)
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,250,244,0.72)] p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-[10px] md:rounded-[2rem] md:p-8 animate-fadeSlideIn">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-serif text-2xl tracking-tight text-[#1f2933]">Your Generated Resume</h3>
              <button 
                type="button" 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 rounded-full border border-[rgba(96,90,81,0.12)] bg-[rgba(252,248,242,0.8)] px-5 py-2.5 text-sm font-medium text-[#5c584f] transition duration-300 hover:border-[rgba(41,63,96,0.18)] hover:bg-[rgba(248,244,238,0.98)] hover:text-[#2c4467]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Editor
              </button>
            </div>
            
            <ResumePreview data={resumeData} onUpdate={setResumeData} />
          </div>
        )}
      </div>
    </section>
  );
};

export default ResumeBuilder;
