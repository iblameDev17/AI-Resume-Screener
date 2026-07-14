import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, BriefcaseBusiness, CalendarDays, FileUp, Sparkles, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteJob, getJobById } from '../api/jobs'
import AppLayout from '../components/AppLayout'
import DeleteJobDialog from '../components/jobs/DeleteJobDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { formatJobDate, parseRequiredSkills } from '../lib/jobs'

function getFriendlyErrorMessage(error, fallbackMessage) {
  if (error?.code === 'ERR_NETWORK' || !error?.response) {
    return 'Backend server is unavailable right now. Please try again in a moment.'
  }

  return error?.response?.data?.message || fallbackMessage
}

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let ignore = false

    const loadJob = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getJobById(id)
        if (!ignore) {
          setJob(response.data)
        }
      } catch (requestError) {
        if (!ignore) {
          setError(getFriendlyErrorMessage(requestError, 'Could not load this job description.'))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadJob()

    return () => {
      ignore = true
    }
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    setDeleteError('')

    try {
      await deleteJob(id)
      navigate('/jobs', { replace: true })
    } catch (requestError) {
      setDeleteError(getFriendlyErrorMessage(requestError, 'Could not delete this job description.'))
      setDeleting(false)
    }
  }

  const skills = parseRequiredSkills(job?.requiredSkills)

  return (
    <AppLayout>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link to="/jobs">
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to jobs
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-slate-800/80 bg-slate-900/75 text-center">
          <LoadingSpinner className="h-6 w-6 text-blue-300" />
          <p className="mt-4 text-sm text-slate-300">Loading job details...</p>
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/10 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-200">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-slate-50">Job unavailable</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-rose-100/90">{error}</p>
          <div className="mt-6 flex justify-center">
            <Link to="/jobs">
              <Button variant="secondary">Return to jobs</Button>
            </Link>
          </div>
        </div>
      ) : null}

      {!loading && !error && job ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Card className="overflow-hidden border-slate-800/80">
              <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.98))] px-6 py-7 sm:px-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                      <Sparkles className="h-3.5 w-3.5" />
                      Module 4 ready
                    </div>
                    <h1 className="font-display text-4xl text-slate-50">{job.title}</h1>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-blue-300" />
                        Created {formatJobDate(job.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <BriefcaseBusiness className="h-4 w-4 text-blue-300" />
                        {skills.length} required skill{skills.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    className="text-slate-300 hover:bg-rose-500/10 hover:text-rose-200"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete job
                  </Button>
                </div>
              </div>

              <CardContent className="space-y-8">
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Required skills</h2>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <Badge key={skill} className="border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[11px] tracking-[0.14em] text-blue-100">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <Badge className="border-slate-700 bg-slate-950/80 px-3 py-1.5 text-[11px] tracking-[0.14em] text-slate-400">
                        No required skills added yet
                      </Badge>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Job description</h2>
                  <div className="mt-4 whitespace-pre-wrap rounded-[24px] border border-slate-800 bg-slate-950/70 p-5 text-sm leading-7 text-slate-200">
                    {job.description}
                  </div>
                </section>
              </CardContent>
            </Card>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.35 }}
            className="space-y-6"
          >
            <Card className="border-slate-800/80">
              <CardContent>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-100">
                  <FileUp className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-50">Resume upload</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Resume upload and PDF parsing will be added in Module 4.
                </p>
                <Button type="button" className="mt-5 w-full" disabled>
                  <FileUp className="h-4 w-4" />
                  Upload Resumes
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-800/80">
              <CardContent>
                <h2 className="text-lg font-semibold text-slate-50">What's ready now</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  <li>This job is protected behind JWT-authenticated recruiter access.</li>
                  <li>Required skills are ready to drive resume matching in the next module.</li>
                  <li>The detail layout is set up for a future upload widget without page restructuring.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.aside>
        </div>
      ) : null}

      <DeleteJobDialog
        open={showDeleteDialog}
        jobTitle={job?.title}
        deleting={deleting}
        error={deleteError}
        onCancel={() => {
          if (!deleting) {
            setDeleteError('')
            setShowDeleteDialog(false)
          }
        }}
        onConfirm={handleDelete}
      />
    </AppLayout>
  )
}
