import { useMemo } from 'react';
import { AlertCircle, Brain, FileText, Layers3, Sparkles } from 'lucide-react';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { ChartCard } from '../components/ChartCard.jsx';
import { DataCard } from '../components/DataCard.jsx';
import { DEFAULT_EMPTY_MESSAGE } from '../utils/constants.js';
import { formatDateTime, formatNumber } from '../utils/format.js';
import { useDocumentStore } from '../hooks/useDocumentStore.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export function DashboardPage() {
  const { latestResult, history } = useDocumentStore();

  const keywordChart = useMemo(() => {
    const keywords = latestResult?.keywords.slice(0, 6) ?? [];

    return {
      labels: keywords.map((keyword) => keyword.term),
      datasets: [
        {
          label: 'Keyword frequency',
          data: keywords.map((keyword) => keyword.count),
          backgroundColor: ['#0f766e', '#f97316', '#0f172a', '#14b8a6', '#fb923c', '#334155'],
          borderRadius: 14,
        },
      ],
    };
  }, [latestResult]);

  const skillChart = useMemo(() => {
    const skills = latestResult?.skills ?? [];
    const presentSkills = skills.length > 0 ? skills : ['No skills detected'];

    return {
      labels: presentSkills,
      datasets: [
        {
          data: presentSkills.map((skill) => (skill === 'No skills detected' ? 1 : 1)),
          backgroundColor: ['#0f766e', '#f97316', '#facc15', '#334155', '#14b8a6', '#fb7185', '#60a5fa'],
          borderWidth: 0,
        },
      ],
    };
  }, [latestResult]);

  const topMetrics = [
    {
      label: 'Latest document',
      value: latestResult?.fileName ?? 'No file processed',
      icon: FileText,
      caption: latestResult ? formatDateTime(latestResult.createdAt) : DEFAULT_EMPTY_MESSAGE,
      accent: 'ink',
    },
    {
      label: 'Detected skills',
      value: formatNumber(latestResult?.skills.length ?? 0),
      icon: Brain,
      caption: 'Matches from the predefined skill list',
      accent: 'brand',
    },
    {
      label: 'Unique keywords',
      value: formatNumber(latestResult?.metrics.uniqueWords ?? 0),
      icon: Layers3,
      caption: 'Top ranked tokens extracted from text',
      accent: 'accent',
    },
    {
      label: 'Documents in session',
      value: formatNumber(history.length),
      icon: Sparkles,
      caption: 'Stored locally in the browser only',
      accent: 'brand',
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-radial-soft border border-slate-200 px-6 py-8 shadow-soft sm:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Insights overview</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Processed document intelligence at a glance</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Upload a resume or invoice to extract high-signal fields, visualize keyword frequency, and inspect the structured payload returned by the API.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {topMetrics.map((metric) => (
          <DataCard key={metric.label} {...metric} />
        ))}
      </section>

      {latestResult ? (
        <section className="grid gap-6 xl:grid-cols-2">
          <ChartCard title="Keyword frequency" subtitle="Top extracted terms from the latest document">
            <div className="h-80">
              <Bar
                data={keywordChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { precision: 0 },
                    },
                  },
                }}
              />
            </div>
          </ChartCard>

          <ChartCard title="Detected skills" subtitle="Distribution of matched skills in the latest upload">
            <div className="h-80">
              <Pie
                data={skillChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </ChartCard>
        </section>
      ) : (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-soft">
          <AlertCircle className="mx-auto mb-4 text-brand" size={32} />
          <h3 className="text-lg font-semibold text-ink">No processed documents yet</h3>
          <p className="mt-2">{DEFAULT_EMPTY_MESSAGE}</p>
        </section>
      )}

      {latestResult ? (
        <section className="grid gap-6 lg:grid-cols-3">
          <ChartCard title="Extracted skills" subtitle="Direct matches from the uploaded document">
            <div className="flex flex-wrap gap-2">
              {latestResult.skills.length > 0 ? (
                latestResult.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-brand/10 px-3 py-2 text-sm font-medium text-brand">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">No skills matched the predefined list.</span>
              )}
            </div>
          </ChartCard>

          <ChartCard title="High-frequency keywords" subtitle="Normalized by the Spring Boot API">
            <div className="space-y-3">
              {latestResult.keywords.slice(0, 6).map((keyword) => (
                <div key={keyword.term}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{keyword.term}</span>
                    <span className="text-slate-500">{keyword.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${Math.min((keyword.count / (latestResult.keywords[0]?.count || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Quick facts" subtitle="Response metadata from the processing API">
            <div className="space-y-3 text-sm text-slate-600">
              <p><span className="font-medium text-ink">Document type:</span> {latestResult.type}</p>
              <p><span className="font-medium text-ink">Total words:</span> {formatNumber(latestResult.metrics.totalWords)}</p>
              <p><span className="font-medium text-ink">Average word length:</span> {latestResult.metrics.averageWordLength.toFixed(2)}</p>
              <p><span className="font-medium text-ink">Detected numbers:</span> {formatNumber(latestResult.metrics.extractedNumbers)}</p>
            </div>
          </ChartCard>
        </section>
      ) : null}
    </div>
  );
}