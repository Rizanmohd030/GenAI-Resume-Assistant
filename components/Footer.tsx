import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mx-auto mt-10 flex w-full max-w-7xl items-center justify-between rounded-[2rem] border border-white/10 bg-slate-950/60 px-6 py-5 text-sm text-slate-400 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <p>Production-style AI career prep dashboard built for role-specific readiness.</p>
      <p className="hidden md:block">Structured Gemini outputs • Reusable React components • Tailwind UI</p>
    </footer>
  );
};

export default Footer;
