import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="glass-card mx-auto max-w-2xl mb-4 p-5 rounded-2xl shadow-md border border-white/20 bg-white/10 backdrop-blur-lg backdrop-saturate-150 text-center transition duration-300">
      <p className="text-sm text-sky-300">
        Built by{" "}
        <a
          href="https://www.linkedin.com/in/rizan-mohammed-ismail-b059b7269"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 font-bold hover:underline"
        >
          Rizan Mohammed Ismail
        </a>
      </p>
    </footer>
  );
};

export default Footer;
