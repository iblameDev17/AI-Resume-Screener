import { motion } from 'framer-motion'
import { ArrowRight, BotMessageSquare, BriefcaseBusiness, FileUp, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AppLayout from '../components/AppLayout'
import { Button } from '../components/ui/button'

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
    description: 'Ask questions about your candidates — powered by your own data.',
    icon: BotMessageSquare,
    route: '/chat',
    cta: 'Open chat',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <AppLayout>
      {/* Welcome header */}
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
          Start by creating a job, or upload resumes to an existing one.
        </p>
      </motion.div>

      {/* Quick action cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * index, duration: 0.35 }}
              className="group flex flex-col justify-between rounded border border-border bg-card p-6 hover-lift cursor-pointer"
              onClick={() => navigate(card.route)}
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-secondary">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="mt-5 font-semibold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground">
                {card.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          )
        })}
      </section>

      {/* Empty state — recent activity */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-8 rounded border border-border bg-card p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-foreground">Recent jobs</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')}>
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-secondary mb-4">
            <BriefcaseBusiness className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No jobs yet</p>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs">
            Create your first job description to start screening candidates.
          </p>
          <Button className="mt-6" size="sm" onClick={() => navigate('/jobs')}>
            Create a job
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.section>
    </AppLayout>
  )
}
