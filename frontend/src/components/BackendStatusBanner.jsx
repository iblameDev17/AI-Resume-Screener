import { AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BackendStatusBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-x-4 top-4 z-50 mx-auto max-w-2xl rounded border border-border bg-card px-4 py-3 text-sm shadow-lg backdrop-blur"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="font-medium text-foreground">Server is still starting up.</p>
          <p className="text-muted-foreground">
            Some features may be unavailable for a few seconds. Refresh if anything fails.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
