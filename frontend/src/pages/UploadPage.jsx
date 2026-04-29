import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FileUp, LoaderCircle, Wand2 } from 'lucide-react';
import { FileUploader } from '../components/FileUploader.jsx';
import { DOCUMENT_TYPES } from '../utils/constants.js';
import { parseApiError, processDocument } from '../services/api.js';
import { useDocumentStore } from '../hooks/useDocumentStore.js';

export function UploadPage() {
  const navigate = useNavigate();
  const { saveResult } = useDocumentStore();
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('resume');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleProcessFile = async () => {
    if (!file) {
      const message = 'Choose a PDF or text file first.';
      setError(message);
      toast.error(message);
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      const result = await processDocument({
        file,
        type: documentType,
        onUploadProgress: setProgress,
      });

      saveResult(result);
      toast.success(`Processed ${result.type} successfully.`);
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
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">Upload</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink">Send a document for processing</h2>
          <p className="mt-2 text-slate-600">The file is forwarded to the API gateway or directly to Spring Boot depending on your environment.</p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {DOCUMENT_TYPES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setDocumentType(item.value)}
              className={[
                'rounded-2xl border px-4 py-3 text-left transition',
                documentType === item.value
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
              ].join(' ')}
            >
              <div className="flex items-center gap-2 font-semibold">
                <Wand2 size={16} />
                {item.label}
              </div>
              <p className="mt-1 text-sm text-slate-500">Optimizes the extraction logic for this document class.</p>
            </button>
          ))}
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
            {isUploading ? <LoaderCircle className="animate-spin" size={16} /> : <FileUp size={16} />}
            {isUploading ? 'Processing...' : 'Process document'}
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
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Processing path</p>
          <h3 className="mt-3 text-2xl font-semibold">Gateway or direct API</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Configure the frontend once and choose whether uploads go through Node.js first or straight to the Spring Boot service.
          </p>
        </div>

        <div className="rounded-3xl bg-white/5 p-5">
          <p className="text-sm font-semibold text-white">Current mode</p>
          <p className="mt-2 text-sm text-slate-300">{import.meta.env.VITE_API_ROUTE_MODE === 'direct' ? 'Direct to Java API' : 'Through Node gateway'}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">Endpoint base</p>
          <p className="mt-2 break-all text-sm text-slate-200">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand/40 to-accent/30 p-5">
          <p className="text-sm font-semibold text-white">Supported files</p>
          <ul className="mt-3 space-y-2 text-sm text-white/90">
            <li>• PDF resumes</li>
            <li>• Plain text resumes</li>
            <li>• PDF invoices</li>
            <li>• Plain text invoices</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}