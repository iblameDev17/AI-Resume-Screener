import axios from 'axios'

const STORAGE_KEY = 'ai-resume-screener-auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem(STORAGE_KEY)

  if (storedAuth) {
    try {
      const parsedAuth = JSON.parse(storedAuth)
      const token = parsedAuth?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY)
      const publicRoutes = ['/login', '/register', '/oauth/callback']

      if (!publicRoutes.includes(window.location.pathname)) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api
