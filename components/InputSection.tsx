import React from 'react';
import type { CareerInput } from '../types';

interface InputSectionProps extends CareerInput {
  setJobDescription: (value: string) => void;
  setRole: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  quickActions: Array<{ id: string; label: string; disabled?: boolean }>;
  activeAction: string;
  onSelectAction: (id: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  jobDescription,
  setJobDescription,
  role,
  setRole,
  onSubmit,
  isLoading,
  quickActions,
  activeAction,
  onSelectAction,
}) => (
  <section className="relative overflow-hidden px-2 py-10 md:py-16">
    <div className="relative mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-4xl tracking-tight text-slate-900 md:text-[4.1rem]">What are you preparing for today?</h2>
        <p className="mt-3 text-sm text-slate-500 md:text-base">
          Start with interview preparation, then switch to DSA or career prep whenever you need.
        </p>
      </div>

      <form
        className="mx-auto max-w-[56rem] rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f4f7fb)] p-5 shadow-[0_30px_80px_rgba(18,52,86,0.14)]"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid gap-4">
          <input
            className="h-14 rounded-[1.15rem] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            placeholder="Role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            disabled={isLoading}
            required
          />
          <textarea
            className="min-h-[8rem] w-full resize-none rounded-[1.15rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            placeholder="Job description"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => !action.disabled && onSelectAction(action.id)}
                disabled={action.disabled}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  activeAction === action.id
                    ? 'border-sky-200 bg-sky-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600'
                } ${action.disabled ? 'cursor-not-allowed opacity-45' : 'hover:border-sky-200 hover:bg-sky-50'}`}
              >
                {action.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            aria-label="Send"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h11" strokeLinecap="round" />
              <path d="M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </section>
);

export default InputSection;
