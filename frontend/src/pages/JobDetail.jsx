import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  FileUp,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteJob, getJobById } from '../api/jobs'
import { getJobResumes, uploadResumes } from '../api/resumes'
import AppLayout from '../components/AppLayout'
import DeleteJobDialog from '../components/jobs/DeleteJobDialog'
import LoadingSpinner from '../components/LoadingSpinner'
import ResumeStatusBadge from '../components/resumes/ResumeStatusBadge'
import ResumeUploadZone from '../components/resumes/ResumeUploadZone'
import SelectedResumeList from '../components/resumes/SelectedResumeList'
import UploadedResumeList from '../components/resumes/UploadedResumeList'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { formatJobDate, parseRequiredSkills } from '../lib/jobs'

const MAX_FILES = 20
const MAX_FILE_SIZE = 10 * 1024 * 1024

function getFriendlyErrorMessage(error, fallbackMessage) {
  if (error?.code === 'ERR_NETWORK' || !error?.response) {
    return 'Backend server is unavailable right now. Please try again in a moment.'
  }

  return error?.response?.data?.message || fallbackMessage
}

function buildFileId(file) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

function buildSelectedResume(file) {
  return {
    id: buildFileId(file),
    file,
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
    status: 'READY',
    message: 'Ready to upload.',
  }
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
  const [selectedResumes, setSelectedResumes] = useState([])
  const [selectionMessages, setSelectionMessages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSummary, setUploadSummary] = useState('')
  const [uploadedResumes, setUploadedResumes] = useState([])
  const [uploadedResumesLoading, setUploadedResumesLoading] = useState(true)
  const [uploadedResumesError, setUploadedResumesError] = useState('')

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

  useEffect(() => {
    let ignore = false

    const loadUploadedResumes = async () => {
      try {
        setUploadedResumesLoading(true)
        setUploadedResumesError('')
        const resumes = await getJobResumes(id)
        if (!ignore) {
          setUploadedResumes(resumes)
        }
      } catch (requestError) {
        if (!ignore) {
          setUploadedResumesError(requestError.message || 'Could not load uploaded resumes.')
        }
      } finally {
        if (!ignore) {
          setUploadedResumesLoading(false)
        }
      }
    }

    loadUploadedResumes()

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

  const addFiles = (files) => {
    setSelectionMessages([])
    setUploadSummary('')

    setSelectedResumes((current) => {
      const next = [...current]
      const seen = new Set(current.map((file) => file.id))
      const messages = []

      files.forEach((file) => {
        const fileId = buildFileId(file)

        if (seen.has(fileId)) {
          messages.push(`${file.name} is already in your upload list.`)
          return
        }

        if (next.length >= MAX_FILES) {
          messages.push('You can upload up to 20 resumes at a time.')
          return
        }

        if (!file.name.toLowerCase().endsWith('.pdf') || (file.type && file.type !== 'application/pdf')) {
          messages.push(`${file.name} was skipped because only PDF resumes are supported.`)
          return
        }

        if (file.size > MAX_FILE_SIZE) {
          messages.push(`${file.name} was skipped because it is larger than 10 MB.`)
          return
        }

        next.push(buildSelectedResume(file))
        seen.add(fileId)
      })

      setSelectionMessages(messages)
      return next
    })
  }

  const handleUpload = async (targetStatuses = ['READY', 'FAILED']) => {
    const filesToUpload = selectedResumes.filter((file) => targetStatuses.includes(file.status))
    if (filesToUpload.length === 0) {
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadSummary('')
    setSelectionMessages([])
    setSelectedResumes((current) => current.map((file) => (
      targetStatuses.includes(file.status)
        ? { ...file, status: 'UPLOADING', message: 'Uploading resume...' }
        : file
    )))

    try {
      const response = await uploadResumes(id, filesToUpload.map((file) => file.file), (event) => {
        if (!event.total) {
          return
        }

        const progress = Math.round((event.loaded / event.total) * 100)
        setUploadProgress(progress)
        if (progress >= 100) {
          setSelectedResumes((current) => current.map((file) => (
            targetStatuses.includes(file.status) || file.status === 'UPLOADING'
              ? { ...file, status: 'PROCESSING', message: 'Resume uploaded. Finalizing candidate record...' }
              : file
          )))
        }
      })

      const remainingResults = [...response.results]
      setSelectedResumes((current) => current.map((file) => {
        const index = remainingResults.findIndex((result) => result.originalFileName === file.name)
        if (index === -1) {
          return file
        }

        const [result] = remainingResults.splice(index, 1)
        return {
          ...file,
          status: result.status === 'SUCCESS' ? 'UPLOADED' : 'FAILED',
          message: result.message,
        }
      }))

      if (response.successfulCount > 0) {
        const resumes = await getJobResumes(id)
        setUploadedResumes(resumes)
      }

      const summary = []
      if (response.successfulCount > 0) {
        summary.push(`${response.successfulCount} resume${response.successfulCount === 1 ? '' : 's'} uploaded successfully.`)
      }
      if (response.failedCount > 0) {
        summary.push(`${response.failedCount} resume${response.failedCount === 1 ? ' needs' : 's need'} attention.`)
      }
      setUploadSummary(summary.join(' '))
    } catch (requestError) {
      setSelectedResumes((current) => current.map((file) => (
        targetStatuses.includes(file.status) || file.status === 'UPLOADING' || file.status === 'PROCESSING'
          ? { ...file, status: 'FAILED', message: requestError.message }
          : file
      )))
      setUploadSummary(requestError.message)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const skills = parseRequiredSkills(job?.requiredSkills)
  const uploadedCount = uploadedResumes.length
  const readyFilesCount = useMemo(
    () => selectedResumes.filter((file) => file.status === 'READY').length,
    [selectedResumes],
  )
  const failedFilesCount = useMemo(
    () => selectedResumes.filter((file) => file.status === 'FAILED').length,
    [selectedResumes],
  )

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
            className="space-y-6"
          >
            <Card className="overflow-hidden border-slate-800/80">
              <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.98))] px-6 py-7 sm:px-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                      <Sparkles className="h-3.5 w-3.5" />
                      Hiring workspace
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

            <Card className="border-slate-800/80">
              <CardContent className="space-y-6">
                <ResumeUploadZone disabled={uploading} onFilesAdded={addFiles} />

                {selectionMessages.length > 0 ? (
                  <div className="rounded-[24px] border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                    {selectionMessages.map((message) => (
                      <p key={message}>{message}</p>
                    ))}
                  </div>
                ) : null}

                {uploadSummary ? (
                  <div className="rounded-[24px] border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">{uploadSummary}</div>
                ) : null}

                <SelectedResumeList
                  files={selectedResumes}
                  uploading={uploading}
                  uploadProgress={uploadProgress}
                  onRemove={(fileId) => setSelectedResumes((current) => current.filter((file) => file.id !== fileId))}
                  onClear={() => setSelectedResumes([])}
                  onClearCompleted={() => setSelectedResumes((current) => current.filter((file) => file.status !== 'UPLOADED'))}
                  onUpload={() => handleUpload(['READY'])}
                  onRetryFailed={() => handleUpload(['FAILED'])}
                />
              </CardContent>
            </Card>

            <Card className="border-slate-800/80">
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-50">Uploaded resumes</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">Review every resume currently attached to this role.</p>
                  </div>
                  {uploadedCount > 0 ? <ResumeStatusBadge status="READY_FOR_SCREENING" /> : null}
                </div>

                <div className="mt-5">
                  <UploadedResumeList
                    resumes={uploadedResumes}
                    loading={uploadedResumesLoading}
                    error={uploadedResumesError}
                    onRetry={async () => {
                      try {
                        setUploadedResumesLoading(true)
                        setUploadedResumesError('')
                        setUploadedResumes(await getJobResumes(id))
                      } catch (requestError) {
                        setUploadedResumesError(requestError.message)
                      } finally {
                        setUploadedResumesLoading(false)
                      }
                    }}
                  />
                </div>
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
                <h2 className="mt-5 text-xl font-semibold text-slate-50">Candidate pipeline</h2>
                <div className="mt-5 grid gap-3 text-sm text-slate-300">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Ready to upload</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-50">{readyFilesCount}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Uploaded to role</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-50">{uploadedCount}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Needs attention</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-50">{failedFilesCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800/80">
              <CardContent>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-100">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-50">Screen candidates</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  AI screening will be available once analysis is enabled for this role.
                </p>
                <Button type="button" className="mt-5 w-full" disabled={uploadedCount === 0}>
                  Screen Candidates
                </Button>
                <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                  {uploadedCount === 0 ? 'Upload at least one resume to unlock this step.' : 'Candidate analysis is the next step in this workflow.'}
                </p>
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
