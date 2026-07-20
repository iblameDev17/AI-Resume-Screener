import { LoaderCircle, Trash2, UploadCloud, XCircle } from 'lucide-react'
import ResumeStatusBadge from './ResumeStatusBadge'
import { Button } from '../ui/button'

function formatFileSize(size) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function SelectedResumeList({
  files,
  uploading,
  uploadProgress,
  onRemove,
  onClear,
  onClearCompleted,
  onUpload,
  onRetryFailed,
}) {
  if (files.length === 0) {
    return null
  }

  const readyCount = files.filter((file) => file.status === 'READY').length
  const failedCount = files.filter((file) => file.status === 'FAILED').length
  const completedCount = files.filter((file) => file.status === 'UPLOADED').length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Selected resumes</h3>
          <p className="mt-1 text-sm text-slate-300">Review your shortlist before you upload.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" disabled={uploading || readyCount === 0} onClick={onUpload}>
            {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            Upload resumes
          </Button>
          <Button type="button" variant="secondary" disabled={uploading || failedCount === 0} onClick={onRetryFailed}>
            Retry failed
          </Button>
          <Button type="button" variant="ghost" disabled={uploading || completedCount === 0} onClick={onClearCompleted}>
            Clear completed
          </Button>
          <Button type="button" variant="ghost" disabled={uploading} onClick={onClear}>
            Clear all
          </Button>
        </div>
      </div>

      {uploading ? (
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-3">
          <div className="flex items-center justify-between gap-4 text-sm text-blue-100">
            <span>Uploading resumes</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900/70">
            <div className="h-full rounded-full bg-blue-400 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {files.map((file) => (
          <div key={file.id} className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">{file.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">{formatFileSize(file.size)}</p>
                {file.message ? <p className="mt-2 text-sm text-slate-300">{file.message}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <ResumeStatusBadge status={file.status} />
                <Button type="button" size="icon" variant="ghost" disabled={uploading} onClick={() => onRemove(file.id)}>
                  {file.status === 'FAILED' ? <XCircle className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
