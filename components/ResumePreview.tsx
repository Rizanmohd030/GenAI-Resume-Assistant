import React, { useRef, useCallback } from 'react';
import type { ResumeData } from './ResumeBuilder';

interface ResumePreviewProps {
  data: ResumeData;
  onUpdate: (data: ResumeData) => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, onUpdate }) => {
  const handleDownloadPdf = () => {
    const printContent = generatePrintHTML(data);
    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      alert('Please allow popups to download PDF.');
      return;
    }
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 400);
  };

  const { personal, education, experience, projects, skills, achievements } = data;

  // ─── Inline edit helpers ───
  const updatePersonalField = (field: keyof typeof personal, value: string) => {
    onUpdate({ ...data, personal: { ...data.personal, [field]: value } });
  };

  const updateEduField = (id: string, field: string, value: string) => {
    onUpdate({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  const updateExpField = (id: string, field: string, value: string) => {
    onUpdate({
      ...data,
      experience: data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  const updateExpBullet = (id: string, index: number, value: string) => {
    onUpdate({
      ...data,
      experience: data.experience.map((e) =>
        e.id === id ? { ...e, bullets: e.bullets.map((b, i) => (i === index ? value : b)) } : e
      ),
    });
  };

  const addExpBullet = (id: string) => {
    onUpdate({
      ...data,
      experience: data.experience.map((e) =>
        e.id === id ? { ...e, bullets: [...e.bullets, 'New bullet point — click to edit'] } : e
      ),
    });
  };

  const removeExpBullet = (id: string, index: number) => {
    onUpdate({
      ...data,
      experience: data.experience.map((e) =>
        e.id === id && e.bullets.length > 1 ? { ...e, bullets: e.bullets.filter((_, i) => i !== index) } : e
      ),
    });
  };

  const updateProjField = (id: string, field: string, value: string) => {
    onUpdate({
      ...data,
      projects: data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  const updateProjBullet = (id: string, index: number, value: string) => {
    onUpdate({
      ...data,
      projects: data.projects.map((p) =>
        p.id === id ? { ...p, bullets: p.bullets.map((b, i) => (i === index ? value : b)) } : p
      ),
    });
  };

  const addProjBullet = (id: string) => {
    onUpdate({
      ...data,
      projects: data.projects.map((p) =>
        p.id === id ? { ...p, bullets: [...p.bullets, 'New bullet point — click to edit'] } : p
      ),
    });
  };

  const removeProjBullet = (id: string, index: number) => {
    onUpdate({
      ...data,
      projects: data.projects.map((p) =>
        p.id === id && p.bullets.length > 1 ? { ...p, bullets: p.bullets.filter((_, i) => i !== index) } : p
      ),
    });
  };

  const updateSkillField = (id: string, field: string, value: string) => {
    onUpdate({
      ...data,
      skills: data.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    });
  };

  const updateAchievement = (index: number, value: string) => {
    onUpdate({
      ...data,
      achievements: data.achievements.map((a, i) => (i === index ? value : a)),
    });
  };

  const addAchievement = () => {
    onUpdate({ ...data, achievements: [...data.achievements, 'New achievement — click to edit'] });
  };

  const removeAchievement = (index: number) => {
    if (data.achievements.length > 1) {
      onUpdate({ ...data, achievements: data.achievements.filter((_, i) => i !== index) });
    }
  };

  // Build contact parts
  const contactParts: { text: string; isLink?: boolean; field: keyof typeof personal }[] = [];
  if (personal.phone) contactParts.push({ text: personal.phone, field: 'phone' });
  if (personal.email) contactParts.push({ text: personal.email, isLink: true, field: 'email' });
  if (personal.linkedin) contactParts.push({ text: `LinkedIn: ${personal.linkedin}`, isLink: true, field: 'linkedin' });
  if (personal.github) contactParts.push({ text: `GitHub: ${personal.github}`, isLink: true, field: 'github' });
  if (personal.portfolio) contactParts.push({ text: `Portfolio: ${personal.portfolio}`, isLink: true, field: 'portfolio' });
  if (personal.location) contactParts.push({ text: personal.location, field: 'location' });

  const editableStyle: React.CSSProperties = {
    outline: 'none',
    borderRadius: '3px',
    transition: 'background 0.2s, box-shadow 0.2s',
    cursor: 'text',
  };

  const editableHoverClass = 'editable-field';

  return (
    <div>
      {/* Action buttons */}
      <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 rounded-full border border-[rgba(41,63,96,0.12)] bg-[#243b5a] px-6 py-2.5 text-sm font-medium text-[#f8f5ee] shadow-[0_8px_24px_rgba(36,59,90,0.18)] transition duration-300 hover:bg-[#1f3551] hover:shadow-[0_12px_30px_rgba(36,59,90,0.22)]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download PDF
        </button>
        <span className="text-xs text-[#9b9488]">💡 Click any text below to edit directly</span>
      </div>

      {/* Editable resume styles */}
      <style>{`
        .editable-field:hover {
          background: rgba(44, 68, 103, 0.04) !important;
          box-shadow: 0 0 0 2px rgba(44, 68, 103, 0.08) !important;
        }
        .editable-field:focus {
          background: rgba(44, 68, 103, 0.06) !important;
          box-shadow: 0 0 0 2px rgba(44, 68, 103, 0.15) !important;
        }
        .bullet-row:hover .bullet-actions {
          opacity: 1;
        }
        .bullet-actions {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .add-bullet-btn {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .section-block:hover .add-bullet-btn {
          opacity: 1;
        }
      `}</style>

      {/* Full A4 page preview */}
      <div className="overflow-x-auto overflow-y-hidden rounded-2xl border border-[rgba(96,90,81,0.12)] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div
          className="resume-page mx-auto px-12 py-10 sm:px-14 sm:py-12"
          style={{
            maxWidth: '820px',
            minHeight: '1122px', /* A4 height at 96dpi */
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            fontSize: '13px',
            color: '#1f2937',
            lineHeight: '1.5',
            position: 'relative',
          }}
        >
          {/* ── NAME ── */}
          <EditableBlock
            value={personal.fullName || 'YOUR NAME'}
            onChange={(v) => updatePersonalField('fullName', v)}
            tag="h1"
            style={{
              textAlign: 'center',
              fontSize: '26px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#111827',
              margin: '0 0 8px 0',
              ...editableStyle,
            }}
            className={editableHoverClass}
          />

          {/* ── CONTACT LINE ── */}
          {contactParts.length > 0 && (
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#374151', margin: '0 0 16px 0' }}>
              {contactParts.map((part, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ margin: '0 6px', color: '#9ca3af' }}>|</span>}
                  <EditableInline
                    value={part.text}
                    onChange={(v) => {
                      // Strip prefix labels when saving back
                      let cleanVal = v;
                      if (part.field === 'linkedin') cleanVal = v.replace(/^LinkedIn:\s*/i, '');
                      else if (part.field === 'github') cleanVal = v.replace(/^GitHub:\s*/i, '');
                      else if (part.field === 'portfolio') cleanVal = v.replace(/^Portfolio:\s*/i, '');
                      updatePersonalField(part.field, cleanVal);
                    }}
                    style={{ ...editableStyle, color: part.isLink ? '#1e40af' : undefined }}
                    className={editableHoverClass}
                  />
                </React.Fragment>
              ))}
            </p>
          )}

          {/* ── PROFESSIONAL SUMMARY ── */}
          {personal.summary && (
            <div style={{ marginBottom: '14px' }}>
              <SectionHeader title="PROFESSIONAL SUMMARY" />
              <EditableBlock
                value={personal.summary}
                onChange={(v) => updatePersonalField('summary', v)}
                tag="p"
                style={{ fontSize: '12.5px', lineHeight: '1.6', color: '#1f2937', margin: '0', paddingLeft: '12px', ...editableStyle }}
                className={editableHoverClass}
              />
            </div>
          )}

          {/* ── EDUCATION ── */}
          {education.some((e) => e.institution) && (
            <div style={{ marginBottom: '14px' }}>
              <SectionHeader title="EDUCATION" />
              {education.filter((e) => e.institution).map((edu) => (
                <div key={edu.id} style={{ marginBottom: '8px', paddingLeft: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <EditableInline
                      value={`${edu.institution}${edu.location ? `, ${edu.location}` : ''}`}
                      onChange={(v) => {
                        const parts = v.split(',').map(s => s.trim());
                        updateEduField(edu.id, 'institution', parts[0] || '');
                        if (parts.length > 1) updateEduField(edu.id, 'location', parts.slice(1).join(', '));
                      }}
                      style={{ fontSize: '13px', fontWeight: 600, color: '#111827', ...editableStyle }}
                      className={editableHoverClass}
                    />
                    {(edu.startDate || edu.endDate) && (
                      <EditableInline
                        value={`${edu.startDate}${edu.startDate && edu.endDate ? ' – ' : ''}${edu.endDate}`}
                        onChange={(v) => {
                          const parts = v.split('–').map(s => s.trim());
                          updateEduField(edu.id, 'startDate', parts[0] || '');
                          if (parts.length > 1) updateEduField(edu.id, 'endDate', parts[1] || '');
                        }}
                        style={{ fontSize: '12.5px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', marginLeft: '16px', ...editableStyle }}
                        className={editableHoverClass}
                      />
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <EditableInline
                      value={`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`}
                      onChange={(v) => {
                        const match = v.match(/^(.+?)\s+in\s+(.+)$/);
                        if (match) {
                          updateEduField(edu.id, 'degree', match[1]);
                          updateEduField(edu.id, 'field', match[2]);
                        } else {
                          updateEduField(edu.id, 'degree', v);
                        }
                      }}
                      style={{ fontSize: '12.5px', fontWeight: 600, color: '#111827', ...editableStyle }}
                      className={editableHoverClass}
                    />
                    {edu.gpa && (
                      <EditableInline
                        value={`CGPA: ${edu.gpa}`}
                        onChange={(v) => updateEduField(edu.id, 'gpa', v.replace(/^CGPA:\s*/i, ''))}
                        style={{ fontSize: '12.5px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', marginLeft: '16px', ...editableStyle }}
                        className={editableHoverClass}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── INTERNSHIP EXPERIENCE ── */}
          {experience.length > 0 && experience.some((e) => e.company) && (
            <div style={{ marginBottom: '14px' }}>
              <SectionHeader title="INTERNSHIP EXPERIENCE" />
              {experience.filter((e) => e.company).map((exp) => (
                <div key={exp.id} className="section-block" style={{ marginBottom: '10px', paddingLeft: '12px' }}>
                  <EditableBlock
                    value={exp.company}
                    onChange={(v) => updateExpField(exp.id, 'company', v)}
                    tag="p"
                    style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0', ...editableStyle }}
                    className={editableHoverClass}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <EditableInline
                      value={exp.role}
                      onChange={(v) => updateExpField(exp.id, 'role', v)}
                      style={{ fontSize: '12.5px', fontWeight: 600, color: '#111827', ...editableStyle }}
                      className={editableHoverClass}
                    />
                    {(exp.startDate || exp.endDate) && (
                      <EditableInline
                        value={`${exp.startDate}${exp.startDate && exp.endDate ? ' – ' : ''}${exp.endDate}`}
                        onChange={(v) => {
                          const parts = v.split('–').map(s => s.trim());
                          updateExpField(exp.id, 'startDate', parts[0] || '');
                          if (parts.length > 1) updateExpField(exp.id, 'endDate', parts[1] || '');
                        }}
                        style={{ fontSize: '12.5px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', marginLeft: '16px', ...editableStyle }}
                        className={editableHoverClass}
                      />
                    )}
                  </div>
                  {exp.bullets.length > 0 && exp.bullets.some(b => b.trim()) && (
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', listStyleType: 'disc' }}>
                      {exp.bullets.map((bullet, bi) => (
                        <li key={bi} className="bullet-row" style={{ fontSize: '12.5px', color: '#1f2937', lineHeight: '1.55', marginBottom: '1px', position: 'relative' }}>
                          <EditableInline
                            value={bullet}
                            onChange={(v) => updateExpBullet(exp.id, bi, v)}
                            style={{ ...editableStyle }}
                            className={editableHoverClass}
                          />
                          <span className="bullet-actions" style={{ position: 'absolute', right: '-28px', top: '0' }}>
                            <button type="button" onClick={() => removeExpBullet(exp.id, bi)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e11d48', fontSize: '11px', padding: '0 2px' }} title="Remove">✕</button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button type="button" onClick={() => addExpBullet(exp.id)} className="add-bullet-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2c4467', fontSize: '11px', marginLeft: '18px', marginTop: '2px', padding: '2px 6px' }}>
                    + Add bullet
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── PROJECTS ── */}
          {projects.some((p) => p.name) && (
            <div style={{ marginBottom: '14px' }}>
              <SectionHeader title="PROJECTS" />
              {projects.filter((p) => p.name).map((proj) => (
                <div key={proj.id} className="section-block" style={{ marginBottom: '10px', paddingLeft: '12px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0' }}>
                    <EditableInline
                      value={proj.name}
                      onChange={(v) => updateProjField(proj.id, 'name', v)}
                      style={{ fontWeight: 700, ...editableStyle }}
                      className={editableHoverClass}
                    />
                    {proj.technologies && (
                      <>
                        {' ('}
                        <EditableInline
                          value={proj.technologies}
                          onChange={(v) => updateProjField(proj.id, 'technologies', v)}
                          style={{ fontWeight: 700, ...editableStyle }}
                          className={editableHoverClass}
                        />
                        {')'}
                      </>
                    )}
                  </p>
                  {proj.bullets.length > 0 && proj.bullets.some(b => b.trim()) && (
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', listStyleType: 'disc' }}>
                      {proj.bullets.map((bullet, bi) => (
                        <li key={bi} className="bullet-row" style={{ fontSize: '12.5px', color: '#1f2937', lineHeight: '1.55', marginBottom: '1px', position: 'relative' }}>
                          <EditableInline
                            value={bullet}
                            onChange={(v) => updateProjBullet(proj.id, bi, v)}
                            style={{ ...editableStyle }}
                            className={editableHoverClass}
                          />
                          <span className="bullet-actions" style={{ position: 'absolute', right: '-28px', top: '0' }}>
                            <button type="button" onClick={() => removeProjBullet(proj.id, bi)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e11d48', fontSize: '11px', padding: '0 2px' }} title="Remove">✕</button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button type="button" onClick={() => addProjBullet(proj.id)} className="add-bullet-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2c4467', fontSize: '11px', marginLeft: '18px', marginTop: '2px', padding: '2px 6px' }}>
                    + Add bullet
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── LEADERSHIP AND ACHIEVEMENTS ── */}
          {achievements.length > 0 && achievements.some(a => a.trim()) && (
            <div className="section-block" style={{ marginBottom: '14px' }}>
              <SectionHeader title="LEADERSHIP AND ACHIEVEMENTS" />
              <ul style={{ margin: '0', paddingLeft: '30px', listStyleType: 'disc' }}>
                {achievements.filter(a => a.trim()).map((ach, i) => (
                  <li key={i} className="bullet-row" style={{ fontSize: '12.5px', color: '#1f2937', lineHeight: '1.55', marginBottom: '2px', position: 'relative' }}>
                    <EditableInline
                      value={ach}
                      onChange={(v) => updateAchievement(i, v)}
                      style={{ ...editableStyle }}
                      className={editableHoverClass}
                    />
                    <span className="bullet-actions" style={{ position: 'absolute', right: '-28px', top: '0' }}>
                      <button type="button" onClick={() => removeAchievement(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e11d48', fontSize: '11px', padding: '0 2px' }} title="Remove">✕</button>
                    </span>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={addAchievement} className="add-bullet-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2c4467', fontSize: '11px', marginLeft: '30px', marginTop: '2px', padding: '2px 6px' }}>
                + Add achievement
              </button>
            </div>
          )}

          {/* ── SKILLS, CERTIFICATIONS AND LANGUAGES ── */}
          {skills.some((s) => s.category && s.items) && (
            <div style={{ marginBottom: '8px' }}>
              <SectionHeader title="SKILLS, CERTIFICATIONS AND LANGUAGES" />
              <ul style={{ margin: '0', paddingLeft: '30px', listStyleType: 'disc' }}>
                {skills.filter((s) => s.category && s.items).map((skill) => (
                  <li key={skill.id} style={{ fontSize: '12.5px', color: '#1f2937', lineHeight: '1.6', marginBottom: '1px' }}>
                    <EditableInline
                      value={skill.category}
                      onChange={(v) => updateSkillField(skill.id, 'category', v)}
                      style={{ fontWeight: 700, ...editableStyle }}
                      className={editableHoverClass}
                    />
                    {': '}
                    <EditableInline
                      value={skill.items}
                      onChange={(v) => updateSkillField(skill.id, 'items', v)}
                      style={{ ...editableStyle }}
                      className={editableHoverClass}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Editable inline span ──────────────────────────── */
const EditableInline: React.FC<{
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
}> = ({ value, onChange, style, className }) => {
  const ref = useRef<HTMLSpanElement>(null);

  const handleBlur = useCallback(() => {
    if (ref.current) {
      const newVal = ref.current.textContent || '';
      if (newVal !== value) onChange(newVal);
    }
  }, [value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
      style={style}
    >
      {value}
    </span>
  );
};

/* ─── Editable block (p, h1, etc.) ──────────────────── */
const EditableBlock: React.FC<{
  value: string;
  onChange: (value: string) => void;
  tag: 'p' | 'h1' | 'h2';
  style?: React.CSSProperties;
  className?: string;
}> = ({ value, onChange, tag: Tag, style, className }) => {
  const ref = useRef<HTMLElement>(null);

  const handleBlur = useCallback(() => {
    if (ref.current) {
      const newVal = ref.current.textContent || '';
      if (newVal !== value) onChange(newVal);
    }
  }, [value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
      style={style}
    >
      {value}
    </Tag>
  );
};

/* ─── Section header with horizontal rule ──────────── */
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    marginBottom: '6px',
    gap: '0',
  }}>
    <h2 style={{
      fontSize: '14px',
      fontWeight: 700,
      textTransform: 'uppercase',
      color: '#111827',
      margin: '0',
      whiteSpace: 'nowrap',
      paddingRight: '10px',
    }}>
      {title}
    </h2>
    <div style={{
      flex: 1,
      height: '1.5px',
      background: '#111827',
    }} />
  </div>
);


function generatePrintHTML(data: ResumeData): string {
  const { personal, education, experience, projects, skills, achievements } = data;

  const contactParts: string[] = [];
  if (personal.phone) contactParts.push(personal.phone);
  if (personal.email) contactParts.push(`<a href="mailto:${personal.email}" style="color:#1e40af;text-decoration:none;">${personal.email}</a>`);
  if (personal.linkedin) contactParts.push(`LinkedIn: <a href="https://linkedin.com/in/${personal.linkedin}" style="color:#1e40af;text-decoration:none;">${personal.linkedin}</a>`);
  if (personal.github) contactParts.push(`GitHub: <a href="https://github.com/${personal.github}" style="color:#1e40af;text-decoration:none;">${personal.github}</a>`);
  if (personal.portfolio) contactParts.push(`Portfolio: <a href="https://${personal.portfolio}" style="color:#1e40af;text-decoration:none;">${personal.portfolio}</a>`);
  if (personal.location) contactParts.push(personal.location);

  const sectionHeader = (title: string) => `
    <div style="display:flex;align-items:center;margin-bottom:6px;">
      <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;color:#111827;margin:0;white-space:nowrap;padding-right:10px;">${title}</h2>
      <div style="flex:1;height:1.5px;background:#111827;"></div>
    </div>
  `;

  const bulletList = (items: string[]) =>
    items.filter(b => b.trim()).length > 0
      ? `<ul style="margin:4px 0 0 0;padding-left:18px;list-style-type:disc;">${items.filter(b => b.trim()).map(b => `<li style="font-size:12.5px;color:#1f2937;line-height:1.55;margin-bottom:1px;">${b}</li>`).join('')}</ul>`
      : '';

  const educationHTML = education.filter((e) => e.institution).map((edu) => `
    <div style="margin-bottom:8px;padding-left:12px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <span style="font-size:13px;font-weight:600;color:#111827;">${edu.institution}${edu.location ? `, ${edu.location}` : ''}</span>
        ${(edu.startDate || edu.endDate) ? `<span style="font-size:12.5px;font-weight:600;color:#111827;white-space:nowrap;margin-left:16px;">${edu.startDate}${edu.startDate && edu.endDate ? ' – ' : ''}${edu.endDate}</span>` : ''}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <span style="font-size:12.5px;font-weight:600;color:#111827;">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</span>
        ${edu.gpa ? `<span style="font-size:12.5px;font-weight:600;color:#111827;white-space:nowrap;margin-left:16px;">CGPA: ${edu.gpa}</span>` : ''}
      </div>
    </div>
  `).join('');

  const experienceHTML = (experience || []).filter((e) => e.company).map((exp) => `
    <div style="margin-bottom:10px;padding-left:12px;">
      <p style="font-size:13px;font-weight:700;color:#111827;margin:0;">${exp.company}</p>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <span style="font-size:12.5px;font-weight:600;color:#111827;">${exp.role}</span>
        ${(exp.startDate || exp.endDate) ? `<span style="font-size:12.5px;font-weight:600;color:#111827;white-space:nowrap;margin-left:16px;">${exp.startDate}${exp.startDate && exp.endDate ? ' – ' : ''}${exp.endDate}</span>` : ''}
      </div>
      ${bulletList(exp.bullets)}
    </div>
  `).join('');

  const projectsHTML = projects.filter((p) => p.name).map((proj) => `
    <div style="margin-bottom:10px;padding-left:12px;">
      <p style="font-size:13px;font-weight:700;color:#111827;margin:0;">${proj.name}${proj.technologies ? ` (${proj.technologies})` : ''}</p>
      ${bulletList(proj.bullets)}
    </div>
  `).join('');

  const achievementsHTML = (achievements || []).filter(a => a.trim()).length > 0
    ? `<ul style="margin:0;padding-left:30px;list-style-type:disc;">${achievements.filter(a => a.trim()).map(a => `<li style="font-size:12.5px;color:#1f2937;line-height:1.55;margin-bottom:2px;">${a}</li>`).join('')}</ul>`
    : '';

  const skillsHTML = skills.filter((s) => s.category && s.items)
    .map((s) => `<li style="font-size:12.5px;color:#1f2937;line-height:1.6;margin-bottom:1px;"><strong>${s.category}:</strong> ${s.items}</li>`)
    .join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${personal.fullName || 'Resume'}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Inter','Segoe UI',Arial,sans-serif;color:#1f2937;padding:32px 48px;max-width:820px;margin:0 auto;font-size:13px;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
      @media print{body{padding:20px 32px;}}
      a{color:#1e40af;text-decoration:none;}
    </style></head><body>
    <h1 style="text-align:center;font-size:26px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#111827;margin:0 0 8px 0;">${personal.fullName || 'YOUR NAME'}</h1>
    ${contactParts.length > 0 ? `<p style="text-align:center;font-size:12px;color:#374151;margin:0 0 16px 0;">${contactParts.join(' <span style="color:#9ca3af;margin:0 4px;">|</span> ')}</p>` : ''}
    ${personal.summary ? `<div style="margin-bottom:14px;">${sectionHeader('PROFESSIONAL SUMMARY')}<p style="font-size:12.5px;line-height:1.6;color:#1f2937;margin:0;padding-left:12px;">${personal.summary}</p></div>` : ''}
    ${educationHTML ? `<div style="margin-bottom:14px;">${sectionHeader('EDUCATION')}${educationHTML}</div>` : ''}
    ${experienceHTML ? `<div style="margin-bottom:14px;">${sectionHeader('INTERNSHIP EXPERIENCE')}${experienceHTML}</div>` : ''}
    ${projectsHTML ? `<div style="margin-bottom:14px;">${sectionHeader('PROJECTS')}${projectsHTML}</div>` : ''}
    ${achievementsHTML ? `<div style="margin-bottom:14px;">${sectionHeader('LEADERSHIP AND ACHIEVEMENTS')}${achievementsHTML}</div>` : ''}
    ${skillsHTML ? `<div style="margin-bottom:8px;">${sectionHeader('SKILLS, CERTIFICATIONS AND LANGUAGES')}<ul style="margin:0;padding-left:30px;list-style-type:disc;">${skillsHTML}</ul></div>` : ''}
    </body></html>`;
}

export default ResumePreview;
