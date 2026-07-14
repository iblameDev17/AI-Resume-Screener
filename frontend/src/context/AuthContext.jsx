import { useState } from 'react'
import api from '../api/axios'
import AuthContext from './auth-context'

const STORAGE_KEY = 'ai-resume-screener-auth'
const backendUnavailableMessage =
  'Backend server is starting or unavailable. Please try again shortly.'

function extractToken(payload) {
  return (
    payload?.token ||
    payload?.jwt ||
    payload?.accessToken ||
    payload?.data?.token ||
    payload?.data?.jwt ||
    payload?.data?.accessToken ||
    null
  )
}

function extractUser(payload, fallbackEmail = '') {
  return {
    email: payload?.email || payload?.user?.email || fallbackEmail,
    name: payload?.name || payload?.user?.name || '',
    role: payload?.role || payload?.user?.role || 'RECRUITER',
  }
}

function getFriendlyErrorMessage(error) {
  if (error?.code === 'ERR_NETWORK' || !error?.response) {
    return backendUnavailableMessage
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong. Please try again.'
  )
}

function persistAuth(authState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authState))
}

function loadStoredAuth() {
  if (typeof window === 'undefined') {
    return { token: null, user: null }
  }

  const savedAuth = localStorage.getItem(STORAGE_KEY)
  if (!savedAuth) {
    return { token: null, user: null }
  }

  try {
    const parsedAuth = JSON.parse(savedAuth)
    return {
      token: parsedAuth?.token || null,
      user: parsedAuth?.user || null,
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthStateInternal] = useState(() => loadStoredAuth())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const setAuthState = (nextToken, nextUser = null) => {
    const nextState = { token: nextToken, user: nextUser }
    setAuthStateInternal(nextState)
    persistAuth(nextState)
  }

  const login = async (email, password) => {
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/api/auth/login', { email, password })
      const payload = response.data
      const resolvedToken = extractToken(payload)

      if (!resolvedToken) {
        throw new Error('Login succeeded but no token was returned.')
      }

      const resolvedUser = extractUser(payload, email)
      setAuthState(resolvedToken, resolvedUser)
      return resolvedUser
    } catch (requestError) {
      const message = getFriendlyErrorMessage(requestError)
      setError(message)
      throw new Error(message, { cause: requestError })
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/api/auth/register', { name, email, password })
      const payload = response.data
      const resolvedToken = extractToken(payload)

      if (resolvedToken) {
        const resolvedUser = extractUser(payload, email)
        setAuthState(resolvedToken, resolvedUser)
        return { user: resolvedUser, token: resolvedToken, redirectedToLogin: false }
      }

      return { redirectedToLogin: true }
    } catch (requestError) {
      const message = getFriendlyErrorMessage(requestError)
      setError(message)
      throw new Error(message, { cause: requestError })
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setAuthStateInternal({ token: null, user: null })
    setError('')
    localStorage.removeItem(STORAGE_KEY)
  }

  const setTokenFromOAuth = (oauthToken) => {
    if (!oauthToken) {
      return
    }

    setAuthState(oauthToken, authState.user)
    setError('')
  }

  const value = {
    token: authState.token,
    user: authState.user,
    isAuthenticated: Boolean(authState.token),
    loading,
    error,
    setError,
    login,
    register,
    logout,
    setTokenFromOAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
