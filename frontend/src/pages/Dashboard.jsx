import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BotMessageSquare, BriefcaseBusiness, FileUp, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getJobs } from '../api/jobs'
import AppLayout from '../components/AppLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import { Button } from '../components/ui/button'
import { useAuth } from '../context/useAuth'
import { formatJobDate, parseRequiredSkills } from '../lib/jobs'

const quickActions = [
  {
    title: 'Post a job',
    description: 'Add a job description and define the skills you are hiring for.',
    icon: BriefcaseBusiness,
    route: '/jobs',
    cta: 'Create job',
  },
  {
    title: 'Screen candidates',
    description: 'Upload resumes and let AI score and rank them against your job.',
    icon: FileUp,
    route: '/jobs',
    cta: 'Upload resumes',
  },
  {
    title: 'AI ranking',
    description: 'View scored candidates, matched skills, and AI-generated summaries.',
    icon: Sparkles,
    route: '/jobs',
    cta: 'View rankings',
  },
  {
    title: 'Ask the chatbot',
    description: 'Ask questions about your candidates - powered by your own data.',
    icon: BotMessageSquare,
    route: '/chat',
    cta: 'Open chat',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)

  const firstName = user?.name?.split(' ')[0] || 'there'

  useEffect(() => {
    let ignore = false

    const loadJobs = async () => {
      try {
        const response = await getJobs()
        if (!ignore) {
          setJobs(response.data || [])
        }
      } catch {
        if (!ignore) {
          setJobs([])
        }
      } finally {
        if (!ignore) {
          setJobsLoading(false)
        }
      }
    }

    loadJobs()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl text-foreground">
          Good to see you, {firstName}.
        </h1>
        <p className="mt-2 text-muted-foreground">
          You have {jobs.length} job description{jobs.length === 1 ? '' : 's'} in motion. Start by creating a new role, or upload resumes to an existing one.
        </p>
      </motion.div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * index, duration: 0.35 }}
              className="group flex cursor-pointer flex-col justify-between rounded border border-border bg-card p-6 hover-lift"
              onClick={() => navigate(card.route)}
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-secondary">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="mt-5 font-semibold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground">
                {card.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          )
        })}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-8 rounded border border-border bg-card p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent jobs</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')}>
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {jobsLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <LoadingSpinner className="h-6 w-6 text-blue-300" />
            <p className="mt-4 text-sm text-muted-foreground">Loading your jobs...</p>
          </div>
        ) : null}

        {!jobsLoading && jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded border border-border bg-secondary">
              <BriefcaseBusiness className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">No jobs yet</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Create your first job description to start screening candidates.
            </p>
            <Button className="mt-6" size="sm" onClick={() => navigate('/jobs')}>
              Create a job
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}

        {!jobsLoading && jobs.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {jobs.slice(0, 3).map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5 text-left transition hover:-translate-y-1 hover:border-blue-500/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-100">{job.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">Created {formatJobDate(job.createdAt)}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {parseRequiredSkills(job.requiredSkills).slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </motion.section>
    </AppLayout>
  )
}
