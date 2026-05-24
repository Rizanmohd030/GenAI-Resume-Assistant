import React from 'react';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => (
  <div className="fixed bottom-5 right-5 z-50 rounded-full border border-sky-200 bg-white/95 px-4 py-3 text-sm text-sky-700 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
    {message}
  </div>
);

export default Toast;
