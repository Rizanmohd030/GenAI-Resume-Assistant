import React from 'react';

const Loader: React.FC = () => {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-[rgba(96,90,81,0.12)] bg-[rgba(255,252,247,0.84)] p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-[10px] sm:p-5 md:rounded-[2rem] md:p-6">
      
      {/* Header */}
      <div>
        <div className="h-3 w-24 animate-pulse rounded-full bg-[rgba(96,90,81,0.10)]" />

        <div className="mt-4 h-10 w-64 animate-pulse rounded-full bg-[rgba(96,90,81,0.08)]" />

        <div className="mt-5 space-y-3">
          <div className="h-3 animate-pulse rounded-full bg-[rgba(96,90,81,0.08)]" />
          <div className="h-3 w-10/12 animate-pulse rounded-full bg-[rgba(96,90,81,0.08)]" />
        </div>
      </div>

      {/* Question Cards */}
      <div className="mt-8 space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-[1.5rem] border border-[rgba(96,90,81,0.08)] bg-[rgba(250,246,240,0.92)] p-5"
          >
            <div className="flex items-start justify-between gap-4">
              
              <div className="flex flex-1 gap-4">
                
                {/* Number */}
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-[rgba(96,90,81,0.10)]" />

                <div className="flex-1">
                  
                  {/* Tags */}
                  <div className="flex gap-2">
                    <div className="h-7 w-16 animate-pulse rounded-full bg-[rgba(96,90,81,0.08)]" />
                    <div className="h-7 w-20 animate-pulse rounded-full bg-[rgba(96,90,81,0.08)]" />
                  </div>

                  {/* Question */}
                  <div className="mt-4 h-6 w-4/5 animate-pulse rounded-full bg-[rgba(96,90,81,0.10)]" />

                  {/* Answer */}
                  <div className="mt-5 space-y-3">
                    <div className="h-3 animate-pulse rounded-full bg-[rgba(96,90,81,0.08)]" />
                    <div className="h-3 w-11/12 animate-pulse rounded-full bg-[rgba(96,90,81,0.08)]" />
                    <div className="h-3 w-9/12 animate-pulse rounded-full bg-[rgba(96,90,81,0.08)]" />
                  </div>
                </div>
              </div>

              {/* Copy Button */}
              <div className="h-10 w-16 animate-pulse rounded-full bg-[rgba(96,90,81,0.08)]" />
            </div>
          </div>
        ))}

        {/* Bottom Button */}
        <div className="flex justify-center pt-3">
          <div className="h-11 w-56 animate-pulse rounded-full bg-[rgba(96,90,81,0.10)]" />
        </div>
      </div>
    </section>
  );
};

export default Loader;