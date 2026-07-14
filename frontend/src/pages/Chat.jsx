import { BotMessageSquare, Send } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

const suggestedQuestions = [
  'Who has the most Python experience?',
  'Which candidate is best for a senior role?',
  'What skills are most common across all resumes?',
  'Compare the top two candidates.',
]

export default function Chat() {
  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-8rem)] flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-foreground">Recruitment Assistant</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask questions about your candidates and job descriptions.
          </p>
        </div>

        {/* Chat area */}
        <div className="flex-1 rounded border border-border bg-card flex flex-col">
          {/* Empty state */}
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-secondary mb-4">
              <BotMessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">No conversations yet</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Upload resumes to a job first, then ask the assistant anything about your candidates.
            </p>

            {/* Suggested questions */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="rounded border border-border bg-secondary px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input bar */}
          <div className="border-t border-border p-4 flex gap-3">
            <Input
              placeholder="Ask about your candidates..."
              className="flex-1"
              disabled
            />
            <Button size="icon" disabled>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
