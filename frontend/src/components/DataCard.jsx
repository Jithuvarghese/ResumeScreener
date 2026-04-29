const accentMap = {
  brand: 'bg-brand/10 text-brand',
  accent: 'bg-accent/10 text-accent',
  ink: 'bg-slate-900/10 text-ink',
};

export function DataCard({ label, value, icon: Icon, accent = 'brand', caption }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h4 className="mt-2 text-2xl font-semibold text-ink">{value}</h4>
          {caption ? <p className="mt-2 text-sm text-slate-500">{caption}</p> : null}
        </div>
        {Icon ? (
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accentMap[accent]}`}>
            <Icon size={18} />
          </div>
        ) : null}
      </div>
    </article>
  );
}