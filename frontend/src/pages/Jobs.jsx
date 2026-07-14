import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, BriefcaseBusiness, Plus, Sparkles } from 'lucide-react'
import { deleteJob, getJobs } from '../api/jobs'
import AppLayout from '../components/AppLayout'
import DeleteJobDialog from '../components/jobs/DeleteJobDialog'
import JobForm from '../components/jobs/JobForm'
import JobList from '../components/jobs/JobList'
import LoadingSpinner from '../components/LoadingSpinner'
import { Button } from '../components/ui/button'

function getFriendlyErrorMessage(error, fallbackMessage) {
  if (error?.code === 'ERR_NETWORK' || !error?.response) {
    return 'Backend server is unavailable right now. Please try again in a moment.'
  }

  return error?.response?.data?.message || fallbackMessage
}

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const loadJobs = async () => {
    try {
      setError('')
      const response = await getJobs()
      setJobs(response.data || [])
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError, 'Could not load job descriptions.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    const syncJobs = async () => {
      try {
        const response = await getJobs()
        if (!ignore) {
          setError('')
          setJobs(response.data || [])
        }
      } catch (requestError) {
        if (!ignore) {
          setError(getFriendlyErrorMessage(requestError, 'Could not load job descriptions.'))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    syncJobs()

    return () => {
      ignore = true
    }
  }, [])

  const handleCreateSuccess = async () => {
    setLoading(true)
    await loadJobs()
  }

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) {
      return
    }

    setDeleting(true)
    setDeleteError('')

    try {
      await deleteJob(jobToDelete.id)
      setJobToDelete(null)
      setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobToDelete.id))
    } catch (requestError) {
      setDeleteError(getFriendlyErrorMessage(requestError, 'Could not delete this job description.'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AppLayout>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[32px] border border-slate-800/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.82),rgba(2,6,23,0.94))] px-6 py-6 shadow-soft sm:px-8"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
              <Sparkles className="h-3.5 w-3.5" />
              Recruiter workspace
            </div>
            <h1 className="font-display text-4xl text-slate-50">Job Descriptions</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Create and manage roles before screening resumes. Each job becomes the source of truth for the next recruitment steps.
            </p>
          </div>

          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4" />
            Create Job
          </Button>
        </div>
      </motion.section>

      <section className="mt-8">
        {loading ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-slate-800/80 bg-slate-900/75 text-center">
            <LoadingSpinner className="h-6 w-6 text-blue-300" />
            <p className="mt-4 text-sm text-slate-300">Loading your job descriptions...</p>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/10 px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-200">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-50">Could not load jobs</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-rose-100/90">{error}</p>
            <Button
              className="mt-6"
              variant="secondary"
              onClick={() => {
                setLoading(true)
                loadJobs()
              }}
            >
              Try again
            </Button>
          </div>
        ) : null}

        {!loading && !error && jobs.length === 0 ? (
          <div className="rounded-[28px] border border-slate-800/80 bg-slate-900/75 px-6 py-16 text-center shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/90 text-blue-200">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-50">No job descriptions yet.</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-300">
              Create your first job description to capture the role, required skills, and everything Module 4 will need for resume uploads.
            </p>
            <Button className="mt-7" onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4" />
              Create your first job description
            </Button>
          </div>
        ) : null}

        {!loading && !error && jobs.length > 0 ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Your open roles</h2>
                <p className="text-sm text-slate-400">
                  {jobs.length} job description{jobs.length === 1 ? '' : 's'} ready for resume screening.
                </p>
              </div>
              <Button variant="secondary" onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4" />
                Add another role
              </Button>
            </div>

            <JobList jobs={jobs} onDelete={setJobToDelete} />
          </div>
        ) : null}
      </section>

      <JobForm
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCreated={handleCreateSuccess}
      />

      <DeleteJobDialog
        open={Boolean(jobToDelete)}
        jobTitle={jobToDelete?.title}
        deleting={deleting}
        error={deleteError}
        onCancel={() => {
          if (!deleting) {
            setDeleteError('')
            setJobToDelete(null)
          }
        }}
        onConfirm={handleDeleteConfirm}
      />
    </AppLayout>
  )
}
