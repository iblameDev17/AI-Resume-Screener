import { BriefcaseBusiness, Plus } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { Button } from '../components/ui/button'

export default function Jobs() {
  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your job descriptions and screen candidates.
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          New job
        </Button>
      </div>

      <div className="rounded border border-border bg-card">
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-secondary mb-4">
            <BriefcaseBusiness className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No job descriptions yet</p>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Add a job description to start uploading resumes and screening candidates with AI.
          </p>
          <Button className="mt-6" size="sm">
            <Plus className="h-4 w-4" />
            Create your first job
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
