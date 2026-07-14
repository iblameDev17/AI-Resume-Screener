import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../context/useAuth'

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden xl:block xl:w-64 xl:flex-shrink-0">
          <Sidebar onLogout={handleLogout} />
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {isSidebarOpen ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm xl:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-50 w-64 xl:hidden"
              >
                <Sidebar
                  mobile
                  onClose={() => setIsSidebarOpen(false)}
                  onLogout={handleLogout}
                />
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar onMenu={() => setIsSidebarOpen(true)} user={user} />
          <main className="flex-1 px-5 py-6 sm:px-6 xl:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
