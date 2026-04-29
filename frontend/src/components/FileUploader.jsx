import { useDropzone } from 'react-dropzone';
import { FileUp, LoaderCircle, ShieldCheck } from 'lucide-react';
import { ACCEPTED_FILE_TYPES } from '../utils/constants.js';

export function FileUploader({ file, onFileSelected, isUploading, progress }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: ACCEPTED_FILE_TYPES,
    multiple: false,
    disabled: isUploading,
    onDrop: (acceptedFiles) => {
      onFileSelected(acceptedFiles[0] ?? null);
    },
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={[
          'rounded-3xl border-2 border-dashed p-8 text-center transition',
          isDragReject ? 'border-red-400 bg-red-50' : isDragActive ? 'border-brand bg-brand/5' : 'border-slate-300 bg-white',
          isUploading ? 'pointer-events-none opacity-80' : 'cursor-pointer',
        ].join(' ')}
      >
        <input {...getInputProps()} />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
          {isUploading ? <LoaderCircle className="animate-spin" size={24} /> : <FileUp size={24} />}
        </div>
        <h3 className="text-xl font-semibold text-ink">Drag and drop a resume file</h3>
        <p className="mt-2 text-sm text-slate-500">Drop a PDF, DOC, DOCX, or TXT file here or click to browse your device.</p>
        <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-400">Accepted: .pdf, .doc, .docx, .txt</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Selected file</p>
            <p className="mt-1 text-sm font-semibold text-ink">{file ? file.name : 'No file selected yet'}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <ShieldCheck size={16} />
            Ready for screening
          </div>
        </div>

        {isUploading ? (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              <span>Upload progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}