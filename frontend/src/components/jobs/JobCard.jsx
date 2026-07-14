import { motion } from 'framer-motion'
import { ArrowRight, BriefcaseBusiness, CalendarDays, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { formatJobDate, getJobDescriptionPreview, parseRequiredSkills } from '../../lib/jobs'

export default function JobCard({ job, index = 0, onDelete }) {
  const skills = parseRequiredSkills(job.requiredSkills)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.28 }}
    >
      <Card className="group h-full overflow-hidden border-slate-800/90 bg-slate-900/75 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_22px_55px_rgba(15,23,42,0.4)]">
        <CardContent className="flex h-full flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/90 text-blue-200">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-50">{job.title}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  Created {formatJobDate(job.createdAt)}
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onDelete(job)}
              aria-label={`Delete ${job.title}`}
              className="text-slate-400 hover:bg-rose-500/10 hover:text-rose-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm leading-6 text-slate-300">
            {getJobDescriptionPreview(job.description, 180)}
          </p>

          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.slice(0, 5).map((skill) => (
                <Badge key={skill} className="border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] tracking-[0.14em] text-blue-100">
                  {skill}
                </Badge>
              ))
            ) : (
              <Badge className="border-slate-700 bg-slate-950/90 px-3 py-1 text-[11px] tracking-[0.14em] text-slate-400">
                Skills pending
              </Badge>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              {job.requiredSkillsCount || skills.length} skill{(job.requiredSkillsCount || skills.length) === 1 ? '' : 's'}
            </p>
            <Link to={`/jobs/${job.id}`}>
              <Button variant="secondary">
                View details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
