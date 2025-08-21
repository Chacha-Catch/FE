import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  profileImage?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 페이지 로드 시 저장된 토큰 확인
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const savedUser = localStorage.getItem('user')
      
      if (accessToken && savedUser) {
        // 토큰 유효성 검사
        const response = await fetch('http://1.201.18.172:8080/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        
        if (response.ok) {
          setUser(JSON.parse(savedUser))
        } else {
          // 토큰이 만료된 경우 리프레시 시도
          await refreshToken()
        }
      }
    } catch (error) {
      console.error('Auth status check failed:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken')
      if (!refreshTokenValue) {
        throw new Error('No refresh token')
      }

      const response = await fetch('http://1.201.18.172:8080/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: refreshTokenValue
        })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
      } else {
        throw new Error('Token refresh failed')
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
    }
  }

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext 