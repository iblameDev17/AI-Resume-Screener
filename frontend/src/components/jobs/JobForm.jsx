import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BriefcaseBusiness, FileText, Sparkles, X } from 'lucide-react'
import { createJob } from '../../api/jobs'
import { serializeSkills } from '../../lib/jobs'
import LoadingSpinner from '../LoadingSpinner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import RequiredSkillsInput from './RequiredSkillsInput'

function getFriendlyErrorMessage(error) {
  if (error?.code === 'ERR_NETWORK' || !error?.response) {
    return 'Backend server is unavailable right now. Please try again in a moment.'
  }

  return error?.response?.data?.message || 'Could not create the job description.'
}

export default function JobForm({ open, onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState([])
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const descriptionCount = description.trim().length
  const isSubmitDisabled = useMemo(
    () => submitting || !title.trim() || !description.trim(),
    [description, submitting, title],
  )

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setSkills([])
    setErrors({})
    setSubmitError('')
    setSubmitting(false)
  }

  const handleClose = (force = false) => {
    if (submitting && !force) {
      return
    }

    resetForm()
    onClose()
  }

  const validate = () => {
    const nextErrors = {}

    if (!title.trim()) {
      nextErrors.title = 'Job title is required.'
    }

    if (!description.trim()) {
      nextErrors.description = 'Job description is required.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!validate()) {
      return
    }

    setSubmitting(true)

    try {
      await createJob({
        title: title.trim(),
        description: description.trim(),
        requiredSkills: serializeSkills(skills),
      })

      await onCreated()
      handleClose(true)
    } catch (error) {
      setSubmitError(getFriendlyErrorMessage(error))
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleClose()}
          />
          <motion.div
            className="fixed inset-x-4 bottom-4 top-4 z-50 mx-auto flex max-w-3xl items-start justify-center sm:inset-x-6 sm:top-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
          >
            <div className="w-full overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950/95 shadow-[0_35px_90px_rgba(2,6,23,0.85)]">
              <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))] px-6 py-6 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                      <Sparkles className="h-3.5 w-3.5" />
                      Module 3
                    </div>
                    <h2 className="font-display text-3xl text-slate-50">Create a job description</h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-300">
                      Define the role, capture the full brief, and add the skills you want to screen resumes against later.
                    </p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleClose()} aria-label="Close create job form">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="max-h-[calc(100vh-8rem)] overflow-y-auto px-6 py-6 sm:px-8">
                <div className="grid gap-6">
                  <label className="grid gap-2">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-100">
                      <BriefcaseBusiness className="h-4 w-4 text-blue-300" />
                      Job title
                    </span>
                    <Input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Senior Full Stack Engineer"
                    />
                    {errors.title ? <p className="text-sm text-rose-300">{errors.title}</p> : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-100">
                      <FileText className="h-4 w-4 text-blue-300" />
                      Job description
                    </span>
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={8}
                      placeholder="Describe responsibilities, team context, hiring priorities, and what success looks like in the role."
                      className="min-h-[220px] w-full rounded-[24px] border border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-slate-100 shadow-inner shadow-black/20 transition placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                    <div className="flex items-center justify-between text-xs">
                      <p className={errors.description ? 'text-rose-300' : 'text-slate-500'}>
                        {errors.description || 'A strong brief here will make Module 4 resume screening more accurate.'}
                      </p>
                      <span className="text-slate-500">{descriptionCount} characters</span>
                    </div>
                  </label>

                  <div className="grid gap-2">
                    <span className="text-sm font-medium text-slate-100">Required skills</span>
                    <RequiredSkillsInput value={skills} onChange={setSkills} error={errors.skills} />
                  </div>
                </div>

                {submitError ? (
                  <div className="mt-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                    {submitError}
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
                  <Button type="button" variant="secondary" onClick={() => handleClose()} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitDisabled}>
                    {submitting ? <LoadingSpinner className="h-4 w-4" /> : null}
                    {submitting ? 'Creating...' : 'Create Job'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
