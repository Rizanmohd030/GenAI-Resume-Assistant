import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="glass-card mx-auto max-w-3xl mt-4 mb-2 p-6 rounded-2xl shadow-lg border border-white/20 bg-white/10 backdrop-blur-lg backdrop-saturate-150 text-center transition duration-300">
      <h1 className="text-3xl md:text-4xl font-bold text-sky-400 drop-shadow">
        GenAI Resume Assistant
      </h1>
      <p className="text-slate-100 mt-2 text-base md:text-lg">
        Instantly tailor your application materials to any job description.
      </p>
    </header>
  );
};

export default Header;
