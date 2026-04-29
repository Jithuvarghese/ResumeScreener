import { ClipboardList, Download, Brain, Award, BriefcaseBusiness, Sparkles } from 'lucide-react';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useDocumentStore } from '../hooks/useDocumentStore.js';
import { formatNumber, truncate } from '../utils/format.js';
import { ChartCard } from '../components/ChartCard.jsx';
import { ScoreCard } from '../components/ScoreCard.jsx';
import { SkillsList } from '../components/SkillsList.jsx';
import { getRoleByValue, flattenRoleSkills } from '../utils/resumeRoles.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export function ResultsPage() {
  const { latestResult } = useDocumentStore();

  if (!latestResult) {
    return (
      <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-soft">
        <ClipboardList className="mx-auto text-brand" size={32} />
        <h2 className="mt-4 text-2xl font-semibold text-ink">No results available</h2>
        <p className="mt-2 text-slate-500">Upload a document first to render structured output and highlights here.</p>
      </section>
    );
  }

  const matchedCount = latestResult.skillsFound.length;
  const missingCount = latestResult.missingSkills.length;
  const roleProfile = getRoleByValue(latestResult.roleKey);
  const allSkills = flattenRoleSkills(roleProfile);
  const pieData = {
    labels: ['Skills Found', 'Missing Skills'],
    datasets: [
      {
        data: [matchedCount, missingCount],
        backgroundColor: ['#0f766e', '#f97316'],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: allSkills,
    datasets: [
      {
        label: 'Skill match',
        data: allSkills.map((skill) => (latestResult.skillsFound.some((item) => item.toLowerCase() === skill.toLowerCase()) ? 1 : 0)),
        backgroundColor: '#0f766e',
        borderRadius: 12,
      },
    ],
  };

  const responseJson = JSON.stringify(latestResult, null, 2);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ScoreCard score={latestResult.matchScore} recommendation={latestResult.recommendation} role={latestResult.role} />
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">Experience estimate</p>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-3xl font-semibold text-ink">{formatNumber(latestResult.experienceEstimate)}</p>
            <p className="pb-1 text-sm text-slate-500">years</p>
          </div>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">Skills found</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{formatNumber(matchedCount)}</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">Missing skills</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{formatNumber(missingCount)}</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Match summary</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">{roleProfile.label}</h2>
            </div>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(responseJson)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-ink"
            >
              <Download size={16} />
              Copy JSON
            </button>
          </div>

          <ScoreCard score={latestResult.matchScore} recommendation={latestResult.recommendation} role={latestResult.role} showDetails />
        </article>

        <div className="space-y-6">
          <ChartCard title="Skills found vs missing" subtitle="Overall match coverage for the selected role">
            <div className="h-72">
              <Pie
                data={pieData}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
              />
            </div>
          </ChartCard>

          <ChartCard title="Skill distribution" subtitle="Per-skill match signal for the selected role">
            <div className="h-72">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { precision: 0, stepSize: 1, callback: (value) => (value ? 'Found' : 'Missing') } } },
                }}
              />
            </div>
          </ChartCard>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="mb-4 text-lg font-semibold">Categorized skill breakdown</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {['primarySkills', 'secondarySkills', 'tools', 'softSkills', 'keywords'].map((cat) => {
              const items = roleProfile[cat] || [];
              const found = items.filter((s) => latestResult.skillsFound.some((f) => f.toLowerCase() === s.toLowerCase()));
              const missing = items.filter((s) => !latestResult.skillsFound.some((f) => f.toLowerCase() === s.toLowerCase()));

              return (
                <div key={cat} className="rounded-2xl border border-slate-100 p-4">
                  <p className="text-sm font-medium text-slate-500">{cat.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}</p>
                  <div className="mt-2">
                    <p className="text-xs text-slate-500">Found: {found.length}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {found.map((s) => (
                        <span key={s} className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">{s}</span>
                      ))}
                      {found.length === 0 && <p className="text-sm text-slate-500">—</p>}
                    </div>

                    <p className="mt-3 text-xs text-slate-500">Missing: {missing.length}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {missing.map((s) => (
                        <span key={s} className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">{s}</span>
                      ))}
                      {missing.length === 0 && <p className="text-sm text-slate-500">—</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <SkillsList title="All missing skills" items={latestResult.missingSkills} tone="missing" emptyText="Nothing missing - this is a strong match." />
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center gap-2 text-ink">
          <Sparkles size={18} className="text-brand" />
          <h3 className="text-lg font-semibold">Recommendation summary</h3>
        </div>
        <p className="text-sm leading-7 text-slate-600">
          {latestResult.recommendation === 'Good Fit'
            ? 'This candidate is aligned with the selected role and can likely move forward to the next screening step.'
            : latestResult.recommendation === 'Moderate Fit'
              ? 'This candidate has a partial match. Review the missing skill set before advancing.'
              : 'This candidate is likely not aligned with the role and needs targeted upskilling or a different job fit.'}
        </p>
        <pre className="mt-4 overflow-x-auto rounded-3xl bg-slate-950 p-5 text-sm leading-7 text-slate-100">
          <code>{responseJson}</code>
        </pre>
      </section>
    </div>
  );
}