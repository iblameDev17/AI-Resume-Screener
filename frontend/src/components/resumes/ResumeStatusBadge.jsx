import { Badge } from '../ui/badge'

const STATUS_STYLES = {
  READY: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100',
  UPLOADING: 'border-blue-500/20 bg-blue-500/10 text-blue-100',
  PROCESSING: 'border-amber-500/20 bg-amber-500/10 text-amber-100',
  UPLOADED: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100',
  SUCCESS: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100',
  FAILED: 'border-rose-500/20 bg-rose-500/10 text-rose-100',
  READY_FOR_SCREENING: 'border-blue-500/20 bg-blue-500/10 text-blue-100',
  SCREENED: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100',
}

const STATUS_LABELS = {
  READY: 'Ready',
  UPLOADING: 'Uploading',
  PROCESSING: 'Processing',
  UPLOADED: 'Uploaded',
  SUCCESS: 'Uploaded',
  FAILED: 'Failed',
  READY_FOR_SCREENING: 'Ready for screening',
  SCREENED: 'Screened',
}

export default function ResumeStatusBadge({ status }) {
  return (
    <Badge className={STATUS_STYLES[status] || 'border-slate-700 bg-slate-950/80 text-slate-300'}>
      {STATUS_LABELS[status] || status}
    </Badge>
  )
}
