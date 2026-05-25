import React from 'react';

const Loader: React.FC = () => {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/92 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5 md:rounded-[2rem] md:p-6">
      <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-52 animate-pulse rounded-full bg-slate-100 sm:w-64" />
          <div className="space-y-3">
            <div className="h-4 animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-11/12 animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-8/12 animate-pulse rounded-full bg-slate-100" />
          </div>

          <div className="mt-5 space-y-4">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4 sm:p-5"
              >
                <div className="flex flex-wrap gap-2">
                  <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-7 w-16 animate-pulse rounded-full bg-slate-200" />
                </div>
                <div className="mt-4 h-6 w-4/5 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-4 space-y-3">
                  <div className="h-3 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-3 w-10/12 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-3 w-7/12 animate-pulse rounded-full bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4 sm:p-5">
          <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-32 animate-pulse rounded-[1.1rem] bg-slate-200/80" />
          <div className="mt-5 space-y-3">
            <div className="h-3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-11/12 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-9/12 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-8/12 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div className="mt-5 h-10 w-36 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </section>
  );
};

export default Loader;
