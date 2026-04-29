import { ClipboardList, Download, FileCode2, Sparkles } from 'lucide-react';
import { useDocumentStore } from '../hooks/useDocumentStore.js';
import { formatDateTime, formatDecimal, formatNumber, truncate } from '../utils/format.js';

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

  const responseJson = JSON.stringify(latestResult, null, 2);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">Document type</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{latestResult.type}</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">File name</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{truncate(latestResult.fileName, 28)}</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">Captured at</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{formatDateTime(latestResult.createdAt)}</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-medium text-slate-500">Average word length</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{formatDecimal(latestResult.metrics.averageWordLength)}</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Structured JSON</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">API response</h2>
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

          <pre className="overflow-x-auto rounded-3xl bg-slate-950 p-5 text-sm leading-7 text-slate-100">
            <code>{responseJson}</code>
          </pre>
        </article>

        <div className="space-y-6">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2 text-ink">
              <Sparkles size={18} className="text-brand" />
              <h3 className="text-lg font-semibold">Highlighted fields</h3>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-500">Summary</p>
                <p className="mt-1 rounded-2xl bg-slate-50 p-4 text-slate-700">{latestResult.summary}</p>
              </div>
              <div>
                <p className="text-slate-500">Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {latestResult.skills.length > 0 ? (
                    latestResult.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-brand/10 px-3 py-1.5 font-medium text-brand">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">No skills detected</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-slate-500">Top keywords</p>
                <ul className="mt-2 space-y-2">
                  {latestResult.keywords.slice(0, 5).map((keyword) => (
                    <li key={keyword.term} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="font-medium text-ink">{keyword.term}</span>
                      <span className="text-slate-500">{keyword.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2 text-ink">
              <FileCode2 size={18} className="text-accent" />
              <h3 className="text-lg font-semibold">Metrics snapshot</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Metric label="Total words" value={formatNumber(latestResult.metrics.totalWords)} />
              <Metric label="Unique words" value={formatNumber(latestResult.metrics.uniqueWords)} />
              <Metric label="Skill count" value={formatNumber(latestResult.metrics.skillCount)} />
              <Metric label="Detected numbers" value={formatNumber(latestResult.metrics.extractedNumbers)} />
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}