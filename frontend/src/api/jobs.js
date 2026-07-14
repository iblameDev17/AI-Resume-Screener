import api from './axios'

export function getJobs() {
  return api.get('/api/jobs')
}

export function createJob(payload) {
  return api.post('/api/jobs', payload)
}

export function getJobById(id) {
  return api.get(`/api/jobs/${id}`)
}

export function deleteJob(id) {
  return api.delete(`/api/jobs/${id}`)
}
