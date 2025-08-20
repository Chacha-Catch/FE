import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import '@/App.css'
import Home from '@/pages/Home'
import Onboarding from '@/pages/Onboarding'
import Search from '@/pages/Search'
import Notifications from '@/pages/Notifications'
import Login from '@/pages/Login'
import BottomNavigation from '@/components/BottomNavigation'

const AppContent = () => {
  const location = useLocation()
  const hideNavigation = location.pathname === '/onboarding' || location.pathname === '/login'

  return (
    <div className="App">
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px', 
        paddingBottom: hideNavigation ? '0' : '80px' 
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/search" element={<Search />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </main>
      {!hideNavigation && <BottomNavigation />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
