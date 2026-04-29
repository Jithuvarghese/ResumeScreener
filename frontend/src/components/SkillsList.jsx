import { CheckCircle2, XCircle } from 'lucide-react';

export function SkillsList({ title, items, tone = 'found', emptyText }) {
  const isFoundTone = tone === 'brand' || tone === 'found';
  const isEmpty = items.length === 0;
  const chipClasses = isFoundTone ? 'bg-brand/10 text-brand' : 'bg-accent/10 text-accent';

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-4 flex items-center gap-2 text-ink">
        {isFoundTone ? <CheckCircle2 size={18} className="text-brand" /> : <XCircle size={18} className="text-accent" />}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      {isEmpty ? (
        <p className="text-sm text-slate-500">{emptyText}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((skill) => (
            <span key={skill} className={`rounded-full px-3 py-2 text-sm font-medium ${chipClasses}`}>
              {skill}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
