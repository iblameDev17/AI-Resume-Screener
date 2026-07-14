import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'
import { Button } from '../components/ui/button'

export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setTokenFromOAuth } = useAuth()

  const oauthToken = useMemo(
    () =>
      searchParams.get('token') ||
      searchParams.get('access_token') ||
      searchParams.get('jwt') ||
      '',
    [searchParams],
  )

  useEffect(() => {
    if (!oauthToken) {
      return
    }

    setTokenFromOAuth(oauthToken)
    const timeout = window.setTimeout(() => {
      navigate('/', { replace: true })
    }, 900)

    return () => window.clearTimeout(timeout)
  }, [navigate, oauthToken, setTokenFromOAuth])

  if (!oauthToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-slate-900/80 p-8 shadow-glow">
          <AlertCircle className="h-10 w-10 text-rose-400" />
          <h1 className="mt-5 font-display text-3xl font-semibold">Google sign-in could not be completed</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            The OAuth callback did not include a JWT token. Please go back and try signing in again.
          </p>
          <Button className="mt-6" onClick={() => navigate('/login', { replace: true })}>
            Back to login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-slate-900/80 p-8 text-center shadow-glow"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-300">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold">Completing Google sign-in...</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          We&apos;re securing your recruiter session and forwarding you to the dashboard.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-blue-300">
          <LoadingSpinner />
          <span className="text-sm">Preparing workspace</span>
        </div>
        <p className="mt-6 text-xs text-slate-500">
          If nothing happens, return to <Link to="/login" className="text-blue-400">login</Link>.
        </p>
      </motion.div>
    </div>
  )
}

