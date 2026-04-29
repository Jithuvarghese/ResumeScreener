import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FileUp, LoaderCircle, BriefcaseBusiness, Loader2 } from 'lucide-react';
import { FileUploader } from '../components/FileUploader.jsx';
import { parseApiError, analyzeResume } from '../services/api.js';
import { useDocumentStore } from '../hooks/useDocumentStore.js';
import { RESUME_ROLES, getRoleByValue } from '../utils/resumeRoles.js';

export function UploadPage() {
  const navigate = useNavigate();
  const { setLatestResult, selectedRole, setRole } = useDocumentStore();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleProcessFile = async () => {
    if (!file) {
      const message = 'Choose a resume file first.';
      setError(message);
      toast.error(message);
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      const result = await analyzeResume({
        file,
        role: selectedRole,
        onUploadProgress: setProgress,
      });

      setLatestResult(result);
      toast.success(`Analyzed ${result.role} successfully.`);
      navigate('/results');
    } catch (uploadError) {
      const message = parseApiError(uploadError);
      setError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Resume screening</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Upload a resume and match it to a role</h2>
          <p className="mt-2 text-slate-600">Choose a role, upload a PDF, DOC, DOCX, or TXT resume, and get an instant match analysis.</p>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <BriefcaseBusiness size={18} />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-ink" htmlFor="role-select">Job role</label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(event) => setRole(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand"
              >
                {RESUME_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-slate-500">{getRoleByValue(selectedRole).description}</p>
            </div>
          </div>
        </div>

        <FileUploader file={file} onFileSelected={setFile} isUploading={isUploading} progress={progress} />

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleProcessFile}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? <Loader2 className="animate-spin" size={16} /> : <FileUp size={16} />}
            {isUploading ? 'Analyzing...' : 'Analyze resume'}
          </button>

          <button
            type="button"
            onClick={() => setFile(null)}
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-ink"
          >
            Clear file
          </button>
        </div>
      </section>

      <aside className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-soft">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">How it works</p>
          <h3 className="mt-3 text-2xl font-semibold">Match score in seconds</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            The API extracts resume text, checks it against the selected role skills, and returns a score, missing skills, and a recommendation.
          </p>
        </div>

        <div className="rounded-3xl bg-white/5 p-5">
          <p className="text-sm font-semibold text-white">API endpoint</p>
          <p className="mt-2 text-sm text-slate-300">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">Supported roles</p>
          <p className="mt-2 text-sm text-slate-300">Frontend Developer, Backend Developer, DevOps Engineer</p>
          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">Accepted formats</p>
          <p className="mt-2 break-all text-sm text-slate-200">PDF, DOC, DOCX, TXT</p>
        </div>
      </aside>
    </div>
  );
}