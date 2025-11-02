import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6 border-b border-amber-200 bg-amber-50">
      <h1 className="text-3xl md:text-4xl font-bold text-amber-700">
        GenAI Resume Assistant
      </h1>
      <p className="text-amber-900 mt-2">
        Instantly tailor your application materials to any job description.
      </p>
    </header>
  );
};

export default Header;
