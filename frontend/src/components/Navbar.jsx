import { Menu } from 'lucide-react'
import { Button } from './ui/button'

export default function Navbar({ onMenu, user }) {
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background px-5 py-3 xl:px-8">
      <div className="flex items-center gap-3">
        <Button
          className="xl:hidden"
          variant="ghost"
          size="icon"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Mobile logo */}
        <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase xl:hidden">
          HireIQ
        </span>
      </div>

      {/* User avatar */}
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:block">
          {user?.name || user?.email || ''}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-secondary font-mono text-xs font-medium text-foreground">
          {initials}
        </div>
      </div>
    </header>
  )
}
