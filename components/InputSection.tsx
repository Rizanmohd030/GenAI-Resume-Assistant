import React from 'react';

interface InputSectionProps {
  jobDescription: string;
  setJobDescription: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  glass?: boolean; // Optional for glass theme
}

const InputSection: React.FC<InputSectionProps> = ({
  jobDescription,
  setJobDescription,
  role,
  setRole,
  onSubmit,
  isLoading,
  glass,
}) => (
  <div className={glass
    ? "glass-card border border-white/20 bg-white/10 backdrop-blur-lg backdrop-saturate-150 rounded-2xl shadow-xl p-8 transition duration-300"
    : "bg-white rounded-lg shadow-md p-8"}>
    <form onSubmit={e => { e.preventDefault(); onSubmit(); }}>
      <label className="block mb-4 text-lg font-semibold">Job Description</label>
      <textarea
        className="block w-full p-2 mb-6 bg-white/20 border backdrop-blur text-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
        rows={4}
        value={jobDescription}
        onChange={e => setJobDescription(e.target.value)}
        disabled={isLoading}
        required
      />
      <label className="block mb-4 text-lg font-semibold">Desired Role</label>
      <input
        className="block w-full p-2 mb-6 bg-white/20 border backdrop-blur text-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        value={role}
        onChange={e => setRole(e.target.value)}
        disabled={isLoading}
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-sky-500/80 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-sky-600/80 transition-colors duration-300 w-full"
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
    </form>
  </div>
);

export default InputSection;
