import { useRef, useState } from 'react'
import { FileUp, FolderOpen } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

export default function ResumeUploadZone({ disabled, onFilesAdded }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || [])
    if (files.length > 0) {
      onFilesAdded(files)
    }
  }

  return (
    <div
      className={cn(
        'rounded-[28px] border border-dashed px-6 py-8 transition-colors',
        isDragging ? 'border-blue-400/70 bg-blue-500/10' : 'border-slate-700/80 bg-slate-950/60',
        disabled ? 'opacity-60' : 'hover:border-blue-400/50 hover:bg-blue-500/5',
      )}
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) {
          setIsDragging(true)
        }
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        if (!disabled) {
          handleFiles(event.dataTransfer.files)
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-100">
            <FileUp className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-50">Upload candidate resumes</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Drop PDF resumes here or browse files.</p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">Up to 20 PDFs, 10 MB each</p>
        </div>

        <Button type="button" variant="secondary" disabled={disabled} onClick={() => inputRef.current?.click()}>
          <FolderOpen className="h-4 w-4" />
          Browse files
        </Button>
      </div>
    </div>
  )
}
