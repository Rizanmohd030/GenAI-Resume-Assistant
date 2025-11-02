
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6 border-b border-slate-700">
      <h1 className="text-3xl md:text-4xl font-bold text-sky-400">
        GenAI Resume Assistant
      </h1>
      <p className="text-slate-400 mt-2">
        Instantly tailor your application materials to any job description.
      </p>
    </header>
  );
};

export default Header;
