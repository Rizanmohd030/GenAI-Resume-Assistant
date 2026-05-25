import React from 'react';
import type { CareerInput } from '../types';

interface InputSectionProps extends CareerInput {
  setJobDescription: (value: string) => void;
  setRole: (value: string) => void;
  setCompanyContext: (value: string) => void;
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
  companyContext,
  setCompanyContext,
  onSubmit,
  isLoading,
  quickActions,
  activeAction,
  onSelectAction,
}) => (
  <section className="relative overflow-hidden px-1 py-10 md:py-16">
    <div className="relative mx-auto max-w-5xl">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-4xl leading-none tracking-[-0.04em] text-[#1f2933] md:text-[4.5rem]">
          What are you preparing for today?
        </h2>
        
      </div>

      <form
        className="mx-auto max-w-[58rem] rounded-[2rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,250,244,0.72)] p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-[10px] md:rounded-[2rem] md:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid gap-4">
          <input
            className="h-16 rounded-[1.6rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(252,248,242,0.96)] px-5 text-sm text-[#202833] outline-none transition duration-300 placeholder:text-[#9b9488] focus:border-[#2c4467] focus:shadow-[0_0_0_5px_rgba(44,68,103,0.08)]"
            placeholder="Role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            disabled={isLoading}
            required
          />
          <textarea
            className="min-h-[8rem] w-full resize-none rounded-[1.8rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(252,248,242,0.96)] px-5 py-4 text-sm leading-7 text-[#202833] outline-none transition duration-300 placeholder:text-[#9b9488] focus:border-[#2c4467] focus:shadow-[0_0_0_5px_rgba(44,68,103,0.08)]"
            placeholder={`Job description
(Optional) Company name or company-specific hint`}
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            disabled={isLoading}
            required
          />
         
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-[rgba(96,90,81,0.1)] pt-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => !action.disabled && onSelectAction(action.id)}
                disabled={action.disabled}
                className={`rounded-full border px-4 py-2 text-sm transition duration-300 ${
                  activeAction === action.id
                    ? 'border-[rgba(41,63,96,0.18)] bg-[#243b5a] text-[#f9f7f2] shadow-[0_8px_24px_rgba(36,59,90,0.18)]'
                    : 'border-[rgba(96,90,81,0.12)] bg-[rgba(252,248,242,0.8)] text-[#5c584f]'
                } ${action.disabled ? 'cursor-not-allowed opacity-45' : 'hover:border-[rgba(41,63,96,0.18)] hover:bg-[rgba(248,244,238,0.98)]'}`}
              >
                {action.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            aria-label="Send"
            className="ml-auto flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(41,63,96,0.12)] bg-[#243b5a] text-[#f8f5ee] shadow-[0_10px_30px_rgba(36,59,90,0.2)] transition duration-300 hover:bg-[#1f3551] hover:shadow-[0_14px_36px_rgba(36,59,90,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
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
