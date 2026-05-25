import React from 'react';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => (
  <div className="fixed bottom-4 left-3 right-3 z-50 rounded-[1.1rem] border border-sky-200 bg-white/95 px-4 py-3 text-sm leading-6 text-sky-700 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:left-auto sm:right-5 sm:max-w-sm sm:rounded-full">
    {message}
  </div>
);

export default Toast;
