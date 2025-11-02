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
  <div className="bg-white p-6 rounded-lg shadow-xl border border-amber-100">
    <h2 className="text-lg font-semibold text-amber-700 mb-4">Describe Your Target Job</h2>
    <textarea
      className="w-full mb-4 p-2 rounded text-amber-900 border border-amber-200 bg-amber-50"
      rows={5}
      placeholder="Paste job description here..."
      value={jobDescription}
      onChange={(e) => setJobDescription(e.target.value)}
      disabled={isLoading}
    />
    <input
      className="w-full mb-4 p-2 rounded text-amber-900 border border-amber-200 bg-amber-50"
      type="text"
      placeholder="Desired Role (e.g., MERN Stack Developer)"
      value={role}
      onChange={(e) => setRole(e.target.value)}
      disabled={isLoading}
    />
    <button
      className="bg-amber-500 text-white font-bold py-2 px-6 rounded hover:bg-amber-600 transition"
      onClick={onSubmit}
      disabled={isLoading}
    >
      {isLoading ? "Generating..." : "Generate Resume & Interview Pack"}
    </button>
  </div>
);

export default InputSection;
