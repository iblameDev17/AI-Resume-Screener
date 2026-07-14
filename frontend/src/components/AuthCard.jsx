export default function AuthCard({ children, footer }) {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="rounded border border-border bg-card p-8 space-y-6">
        {children}
      </div>
      {footer ? (
        <div>{footer}</div>
      ) : null}
    </div>
  )
}
