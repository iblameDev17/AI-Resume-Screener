import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import LoadingSpinner from '../components/LoadingSpinner'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login, loading, error, setError } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })

  const redirectTarget = location.state?.from?.pathname || '/'
  const successMessage = location.state?.message

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (event) => {
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await login(formData.email, formData.password)
      navigate(redirectTarget, { replace: true })
    } catch {
      // Error state is handled in context.
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left panel — brand / value prop */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-border noise-overlay"
      >
        {/* Logo */}
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            HireIQ
          </span>
        </div>

        {/* Hero copy */}
        <div>
          <h1 className="font-display text-5xl xl:text-6xl leading-tight text-foreground text-balance">
            Screen smarter.<br />
            Hire <span className="word-gradient">faster.</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-md text-pretty">
            Upload job descriptions and resumes. Our AI ranks candidates, surfaces the best matches, and answers your hiring questions instantly.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {[
              { stat: '80%', label: 'Less screening time' },
              { stat: '91%', label: 'Match accuracy' },
              { stat: '<2s', label: 'Query response' },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="font-display text-3xl text-foreground">{stat}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} HireIQ
        </p>
      </motion.div>

      {/* Right panel — auth form */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-1 flex-col items-center justify-center px-6 py-12"
      >
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">HireIQ</span>
        </div>

        <AuthCard
          footer={
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link className="font-medium text-foreground hover:underline underline-offset-4" to="/register">
                Sign up
              </Link>
            </p>
          }
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">Sign in</h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your workspace.
            </p>
          </div>

          {successMessage ? (
            <div className="rounded border border-border bg-secondary px-4 py-3 text-sm text-foreground">
              {successMessage}
            </div>
          ) : null}

          {error ? (
            <div className="rounded border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
              {error}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-foreground">Email</span>
              <Input
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setError('')}
                required
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-foreground">Password</span>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setError('')}
                required
              />
            </label>

            <Button className="w-full" size="lg" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner />
                  Signing in...
                </>
              ) : (
                <>
                  <LockKeyhole className="h-4 w-4" />
                  Sign in
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <Button className="w-full" variant="secondary" size="lg" type="button" onClick={handleGoogleLogin}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
            <ArrowRight className="h-4 w-4" />
          </Button>
        </AuthCard>
      </motion.div>
    </div>
  )
}
