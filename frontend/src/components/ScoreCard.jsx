import { Award, BriefcaseBusiness, TrendingUp } from 'lucide-react';

const recommendationMap = {
  'Good Fit': 'bg-emerald-100 text-emerald-700',
  'Moderate Fit': 'bg-amber-100 text-amber-700',
  'Needs Improvement': 'bg-rose-100 text-rose-700',
};

export function ScoreCard({ score, recommendation, role, showDetails = false }) {
  const progressWidth = Math.max(0, Math.min(score, 100));

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Match score</p>
          <h4 className="mt-2 text-3xl font-semibold text-ink">{score}%</h4>
          <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${recommendationMap[recommendation] || 'bg-slate-100 text-slate-700'}`}>
            <Award size={14} />
            {recommendation}
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <TrendingUp size={20} />
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progressWidth}%` }} />
      </div>

      {showDetails ? (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 font-medium text-ink">
            <BriefcaseBusiness size={16} className="text-brand" />
            {role}
          </span>
          <span>{progressWidth}% aligned</span>
        </div>
      ) : null}
    </article>
  );
}
