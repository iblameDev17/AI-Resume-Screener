import { BriefcaseBusiness, LayoutDashboard, LogOut, MessageSquareText, PanelLeftClose } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { to: '/chat', label: 'Assistant', icon: MessageSquareText },
]

export default function Sidebar({ onClose, onLogout, mobile = false }) {
  return (
    <aside
      className={cn(
        'flex h-full w-full flex-col border-r border-border bg-background px-4 py-6',
        mobile && 'shadow-2xl',
      )}
    >
      {/* Logo */}
      <div className="mb-8 flex items-center justify-between px-2">
        <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
          HireIQ
        </span>
        {mobile ? (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation">
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      {/* Nav */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
            >
              {({ isActive }) => (
                <div
                  className={cn(
                    'flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-border pt-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
