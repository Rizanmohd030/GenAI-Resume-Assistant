import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">AI Career Platform</p>
        <h1 className="font-serif text-2xl text-white md:text-3xl">GenAI Career Assistant</h1>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
          Interview + DSA + Career Prep
        </span>
      </div>
    </header>
  );
};

export default Header;
