import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const MAX_ATTEMPTS = 10
const RETRY_DELAY_MS = 8000

export default function SplashScreen({ onComplete }) {
  const [attempt, setAttempt] = useState(1)
  const [statusText, setStatusText] = useState('Connecting to server...')

  useEffect(() => {
    let cancelled = false
    let retryTimeout

    async function checkBackend(currentAttempt) {
      try {
        const response = await fetch(`${API_BASE_URL}/actuator/health`, { cache: 'no-store' })
        if (!cancelled && response.ok) {
          onComplete({ backendReady: true })
          return
        }
      } catch {
        // Ignore fetch errors and continue retry loop.
      }

      if (cancelled) return

      if (currentAttempt >= MAX_ATTEMPTS) {
        setStatusText('Taking longer than expected. Loading anyway...')
        retryTimeout = window.setTimeout(() => {
          onComplete({ backendReady: false })
        }, 1200)
        return
      }

      setAttempt(currentAttempt + 1)
      setStatusText('Server is starting up. This may take a moment...')
      retryTimeout = window.setTimeout(() => {
        checkBackend(currentAttempt + 1)
      }, RETRY_DELAY_MS)
    }

    checkBackend(1)

    return () => {
      cancelled = true
      if (retryTimeout) window.clearTimeout(retryTimeout)
    }
  }, [onComplete])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm text-center"
      >
        {/* Logo */}
        <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
          HireIQ
        </span>

        {/* App name */}
        <h1 className="mt-6 font-display text-4xl text-foreground">
          AI Resume Screener
        </h1>

        {/* Status */}
        <AnimatePresence mode="wait">
          <motion.p
            key={statusText}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            {statusText}
          </motion.p>
        </AnimatePresence>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
              animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
              transition={{
                duration: 1.2,
                delay: dot * 0.18,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          ))}
        </div>

        {/* Attempt counter */}
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {attempt} / {MAX_ATTEMPTS}
        </p>
      </motion.div>
    </div>
  )
}
