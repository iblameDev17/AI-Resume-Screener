import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import LoadingSpinner from '../LoadingSpinner'
import { Button } from '../ui/button'

export default function DeleteJobDialog({
  open,
  jobTitle,
  deleting = false,
  error = '',
  onCancel,
  onConfirm,
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={deleting ? undefined : onCancel}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.22 }}
          >
            <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-slate-950/95 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.85)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-200">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-50">Delete job description</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Are you sure you want to delete this job description?
              </p>
              {jobTitle ? (
                <p className="mt-2 text-sm text-slate-400">
                  This will remove <span className="font-semibold text-slate-200">{jobTitle}</span> from your recruiter workspace.
                </p>
              ) : null}

              {error ? (
                <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              ) : null}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={deleting}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-rose-500 text-white shadow-[0_16px_45px_rgba(244,63,94,0.28)] hover:bg-rose-400"
                  onClick={onConfirm}
                  disabled={deleting}
                >
                  {deleting ? <LoadingSpinner className="h-4 w-4" /> : null}
                  {deleting ? 'Deleting...' : 'Delete job'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
