import api from './axios'

function getErrorMessage(error, fallbackMessage) {
  if (error?.code === 'ERR_NETWORK' || !error?.response) {
    return 'The upload service is unavailable right now. Please try again in a moment.'
  }

  return error?.response?.data?.message || fallbackMessage
}

export async function uploadResumes(jobId, files, onUploadProgress) {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  try {
    const response = await api.post(`/api/jobs/${jobId}/resumes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'We could not upload those resumes right now.'), { cause: error })
  }
}

export async function getJobResumes(jobId) {
  try {
    const response = await api.get(`/api/jobs/${jobId}/resumes`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'We could not load uploaded resumes right now.'), { cause: error })
  }
}
