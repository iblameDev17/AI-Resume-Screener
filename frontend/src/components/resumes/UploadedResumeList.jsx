import { AlertCircle, RefreshCcw } from 'lucide-react'
import ResumeStatusBadge from './ResumeStatusBadge'
import { Button } from '../ui/button'

function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function UploadedResumeList({ resumes, loading, error, onRetry }) {
  if (loading) {
    return <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">Loading uploaded resumes...</div>
  }

  if (error) {
    return (
      <div className="rounded-[24px] border border-rose-500/20 bg-rose-500/10 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-rose-200" />
          <div>
            <p className="text-sm font-medium text-rose-100">{error}</p>
            <Button type="button" variant="secondary" className="mt-4" onClick={onRetry}>
              <RefreshCcw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (resumes.length === 0) {
    return (
      <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
        No candidate resumes have been added for this role yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {resumes.map((resume) => (
        <div key={resume.resumeId} className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-100">{resume.fileName}</p>
              <p className="mt-1 text-sm text-slate-400">Added {formatDateTime(resume.uploadedAt)}</p>
              {resume.candidateName ? <p className="mt-2 text-sm text-slate-300">Candidate: {resume.candidateName}</p> : null}
            </div>
            <ResumeStatusBadge status={resume.status} />
          </div>
        </div>
      ))}
    </div>
  )
}
