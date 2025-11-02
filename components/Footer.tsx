import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="text-center p-4 mt-8 border-t border-slate-700">
      <p className="text-sm text-slate-500">
        Built by{" "}
        <a
          href="https://www.linkedin.com/in/rizan-mohammed-ismail-b059b7269"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Rizan Mohammed Ismail
        </a>
      </p>
    </footer>
  );
};

export default Footer;
