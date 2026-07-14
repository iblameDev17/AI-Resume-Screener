import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import AuthCard from '../components/AuthCard'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/useAuth'

export default function Register() {
  const navigate = useNavigate()
  const { isAuthenticated, register, loading, error, setError } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (event) => {
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }))
    setValidationError('')
    setError('')
  }

  const validate = () => {
    if (!formData.name.trim()) return 'Name is required.'
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Please enter a valid email address.'
    if (formData.password.length < 6) return 'Password must be at least 6 characters.'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.'
    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextValidationError = validate()

    if (nextValidationError) {
      setValidationError(nextValidationError)
      return
    }

    try {
      const result = await register(formData.name.trim(), formData.email.trim(), formData.password)

      if (result?.redirectedToLogin) {
        navigate('/login', {
          replace: true,
          state: { message: 'Account created successfully. Please sign in.' },
        })
        return
      }

      navigate('/', { replace: true })
    } catch {
      // Error state is handled in context.
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left panel — brand */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-border noise-overlay"
      >
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">HireIQ</span>
        </div>

        <div>
          <h1 className="font-display text-5xl xl:text-6xl leading-tight text-foreground text-balance">
            Your next great<br />
            hire starts <span className="word-gradient">here.</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-md text-pretty">
            Set up your workspace in seconds. Upload job descriptions, screen candidates with AI, and chat with your data — all in one place.
          </p>

          <div className="mt-12 space-y-4 border-t border-border pt-8">
            {[
              'AI-powered candidate ranking and scoring',
              'Semantic search across all your resumes',
              'Ask questions, get answers about your candidates',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} HireIQ
        </p>
      </motion.div>

      {/* Right panel — register form */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-1 flex-col items-center justify-center px-6 py-12"
      >
        <div className="mb-8 lg:hidden">
          <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">HireIQ</span>
        </div>

        <AuthCard
          footer={
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link className="font-medium text-foreground hover:underline underline-offset-4" to="/login">
                Sign in
              </Link>
            </p>
          }
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">Create an account</h2>
            <p className="text-sm text-muted-foreground">
              Get started with your recruiter workspace.
            </p>
          </div>

          {validationError || error ? (
            <div className="rounded border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
              {validationError || error}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-foreground">Full name</span>
              <Input
                name="name"
                type="text"
                placeholder="Aarav Malhotra"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-foreground">Email</span>
              <Input
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-foreground">Password</span>
                <Input
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-foreground">Confirm password</span>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <Button className="w-full" size="lg" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create account
                </>
              )}
            </Button>
          </form>
        </AuthCard>
      </motion.div>
    </div>
  )
}
