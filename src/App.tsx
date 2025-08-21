import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import '@/App.css'
import Home from '@/pages/Home'
import Onboarding from '@/pages/Onboarding'
import Search from '@/pages/Search'
import Notifications from '@/pages/Notifications'
import Login from '@/pages/Login'
import OAuthCallback from '@/pages/OAuthCallback'
import BottomNavigation from '@/components/BottomNavigation'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthProvider } from '@/contexts/AuthContext'

const AppContent = () => {
  const location = useLocation()
  const hideNavigation = location.pathname === '/onboarding' || location.pathname === '/login' || location.pathname === '/oauth/callback'
  const showHeader = !hideNavigation

  return (
    <div className="App">
      {showHeader && <Header />}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px', 
        paddingBottom: hideNavigation ? '0' : '80px' 
      }}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
        </Routes>
      </main>
      {!hideNavigation && <BottomNavigation />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
