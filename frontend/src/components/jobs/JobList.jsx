import JobCard from './JobCard'

export default function JobList({ jobs, onDelete }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      {jobs.map((job, index) => (
        <JobCard key={job.id} job={job} index={index} onDelete={onDelete} />
      ))}
    </div>
  )
}
