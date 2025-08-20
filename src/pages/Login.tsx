import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    
    try {
      // Google OAuth 로그인 로직을 여기에 구현
      // 실제 프로덕션에서는 Google OAuth 라이브러리 사용
      console.log('Google 로그인 시도...')
      
      // 임시로 2초 대기 후 홈으로 이동
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 로그인 성공 시 홈으로 이동
      navigate('/')
    } catch (error) {
      console.error('로그인 실패:', error)
      alert('로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 여백 */}
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        {/* 로고/제목 영역 */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-navy mb-4">
            차차캐치
          </h1>
          <p className="text-gray-600 text-lg">
            공지사항을 놓치지 마세요!
          </p>
        </div>

        {/* 로그인 버튼 영역 */}
        <div className="w-full max-w-sm">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-navy rounded-full animate-spin"></div>
                <span className="text-gray-700 font-medium">로그인 중...</span>
              </div>
            ) : (
              <>
                {/* Google 아이콘 */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium">Google로 로그인</span>
              </>
            )}
          </button>

          {/* 추가 정보 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              로그인하면 차차캐치의{' '}
              <span className="text-navy underline cursor-pointer">이용약관</span>과{' '}
              <span className="text-navy underline cursor-pointer">개인정보처리방침</span>에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 하단 여백 */}
      <div className="pb-8">
        <p className="text-center text-xs text-gray-400">
          © 2025 차차캐치. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login
