import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/92 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
        >
          <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-24 animate-pulse rounded-[1.25rem] bg-slate-100" />
          <div className="mt-4 space-y-3">
            <div className="h-3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-4/6 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
