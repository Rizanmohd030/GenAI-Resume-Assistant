import React from 'react';

interface SidebarProps {
  sections: Array<{ id: string; label: string; eyebrow: string }>;
  activeSection: string;
  onSelect: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection, onSelect }) => (
  <aside className="sticky top-6 h-fit rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
    <p className="px-3 text-xs uppercase tracking-[0.35em] text-slate-500">Sections</p>
    <nav className="mt-4 space-y-2">
      {sections.map((section, index) => {
        const isActive = section.id === activeSection;
        return (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={`w-full rounded-[1.35rem] border px-4 py-4 text-left transition ${
              isActive
                ? 'border-sky-200 bg-sky-600 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-slate-900'
            }`}
          >
            <p className={`text-xs uppercase tracking-[0.3em] ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>0{index + 1}</p>
            <p className="mt-2 text-base font-medium">{section.label}</p>
            <p className={`mt-1 text-sm ${isActive ? 'text-sky-100/80' : 'text-slate-400'}`}>{section.eyebrow}</p>
          </button>
        );
      })}
    </nav>
  </aside>
);

export default Sidebar;
