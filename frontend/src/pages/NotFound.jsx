import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-xl rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 text-center shadow-glow">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-300">
          <Compass className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          The route you requested does not exist in the current module.
        </p>
        <Button className="mt-8" onClick={() => navigate('/')}>
          Return to dashboard
        </Button>
      </div>
    </div>
  )
}
