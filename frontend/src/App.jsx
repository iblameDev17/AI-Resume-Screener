import { useCallback, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SplashScreen from './components/SplashScreen'
import ProtectedRoute from './components/ProtectedRoute'
import BackendStatusBanner from './components/BackendStatusBanner'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import OAuthCallback from './pages/OAuthCallback'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'

function AppRoutes({ backendWarning }) {
  return (
    <>
      {backendWarning ? <BackendStatusBanner /> : null}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/chat" element={<Chat />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

function App() {
  const [appReady, setAppReady] = useState(false)
  const [backendWarning, setBackendWarning] = useState(false)

  const handleSplashComplete = useCallback(({ backendReady }) => {
    setBackendWarning(!backendReady)
    setAppReady(true)
  }, [])

  if (!appReady) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes backendWarning={backendWarning} />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
