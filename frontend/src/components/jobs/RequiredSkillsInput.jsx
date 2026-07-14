import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Badge } from '../ui/badge'
import { cn } from '../../lib/utils'
import { normalizeSkills } from '../../lib/jobs'

export default function RequiredSkillsInput({
  value,
  onChange,
  error,
  placeholder = 'Type a skill and press Enter',
}) {
  const [draft, setDraft] = useState('')

  const commitDraft = () => {
    const nextSkills = normalizeSkills([...value, draft])
    if (nextSkills.length !== value.length) {
      onChange(nextSkills)
    }
    setDraft('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      if (draft.trim()) {
        commitDraft()
      }
    }

    if (event.key === 'Backspace' && !draft && value.length > 0) {
      event.preventDefault()
      onChange(value.slice(0, -1))
    }
  }

  const removeSkill = (skillToRemove) => {
    onChange(value.filter((skill) => skill !== skillToRemove))
  }

  return (
    <div>
      <div
        className={cn(
          'rounded-[24px] border border-slate-800 bg-slate-950/80 px-4 py-4 shadow-inner shadow-black/20 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30',
          error && 'border-rose-500/70 focus-within:border-rose-500 focus-within:ring-rose-500/20',
        )}
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((skill) => (
            <Badge key={skill} className="gap-2 border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] tracking-[0.14em] text-blue-100">
              {skill}
              <button
                type="button"
                className="rounded-full text-blue-200 transition hover:text-white"
                onClick={() => removeSkill(skill)}
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-400">
            <Plus className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (draft.trim()) {
                commitDraft()
              }
            }}
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            placeholder={placeholder}
          />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <p className={cn('text-slate-500', error && 'text-rose-300')}>
          {error || 'Recommended: include the must-have skills recruiters will screen against.'}
        </p>
        <span className="text-slate-500">{value.length} skill{value.length === 1 ? '' : 's'}</span>
      </div>
    </div>
  )
}
