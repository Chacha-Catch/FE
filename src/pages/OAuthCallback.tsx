import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const OAuthCallback = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    // URL 해시에서 access_token 추출 (Google OAuth 응답)
    const hash = window.location.hash
    
    if (hash) {
      // access_token 추출
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      const error = params.get('error')
      
      if (error) {
        console.error('Google OAuth 에러:', error)
        alert('로그인에 실패했습니다. 다시 시도해주세요.')
        navigate('/login')
        return
      }
      
      if (accessToken) {
        handleLoginPost(accessToken)
      } else {
        console.error('Access token을 받지 못했습니다.')
        alert('로그인에 실패했습니다. 다시 시도해주세요.')
        navigate('/login')
      }
    } else {
      console.error('OAuth 응답을 받지 못했습니다.')
      navigate('/login')
    }
  }, [navigate])

  const handleLoginPost = async (googleAccessToken: string) => {
    try {
      // GET 요청으로 변경, 코드를 쿼리 파라미터로 전송
      const url = `https://chacha-catch.shop/oauth/login/google?code=${encodeURIComponent(googleAccessToken)}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('서버 로그인 처리에 실패했습니다.')
      }

      const result = await response.json()
      console.log('🔍 OAuth API 응답:', result) // 디버깅용
      
      // API 응답 구조에 따라 조정 (일반적인 구조)
      const jwtToken = result.accessToken || result.access_token || result.jwt
      const userName = result.name || result.user?.name || '사용자'
      const userEmail = result.email || result.user?.email || ''
      const userId = result.id || result.user?.id || '1'

      // 사용자 정보 객체 생성
      const user = {
        id: userId,
        name: userName,
        email: userEmail
      }

      // AuthContext를 통해 로그인 처리
      login(jwtToken, '', user) // refreshToken은 빈 문자열로 설정

      // 온보딩 페이지로 이동
      navigate('/onboarding')

    } catch (error) {
      console.error('로그인 처리 실패:', error)
      alert('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  )
}

export default OAuthCallback 