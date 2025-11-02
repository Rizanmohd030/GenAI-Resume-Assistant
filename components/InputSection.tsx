import React from 'react';

interface InputSectionProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  jobDescription,
  setJobDescription,
  role,
  setRole,
  onSubmit,
  isLoading
}) => (
  <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
    <h2 className="text-lg font-semibold text-sky-400 mb-4">Describe Your Target Job</h2>
    <textarea
      className="w-full mb-4 p-2 rounded text-slate-800"
      rows={5}
      placeholder="Paste job description here..."
      value={jobDescription}
      onChange={(e) => setJobDescription(e.target.value)}
      disabled={isLoading}
    />
    <input
      className="w-full mb-4 p-2 rounded text-slate-800"
      type="text"
      placeholder="Desired Role (e.g., MERN Stack Developer)"
      value={role}
      onChange={(e) => setRole(e.target.value)}
      disabled={isLoading}
    />
    <button
      className="bg-purple-600 text-white font-bold py-2 px-6 rounded hover:bg-purple-700 transition"
      onClick={onSubmit}
      disabled={isLoading}
    >
      {isLoading ? "Generating..." : "Generate Resume & Interview Pack"}
    </button>
  </div>
);

export default InputSection;
