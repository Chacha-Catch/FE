import { useEffect } from 'react'

const OAuthCallback = () => {
  useEffect(() => {
    // URL에서 인증 결과 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    
    if (error) {
      // 에러 발생 시 부모 창에 에러 메시지 전달
      window.opener?.postMessage({
        type: 'GOOGLE_LOGIN_ERROR',
        error: error
      }, window.location.origin)
      window.close()
      return
    }
    
    if (code) {
      // 인증 코드를 백엔드로 전송하여 토큰 교환
      exchangeCodeForToken(code)
    } else {
      // 예상하지 못한 상황
      window.opener?.postMessage({
        type: 'GOOGLE_LOGIN_ERROR',
        error: '인증 코드를 받지 못했습니다.'
      }, window.location.origin)
      window.close()
    }
  }, [])

  const exchangeCodeForToken = async (code: string) => {
    try {
      // 백엔드 API에 인증 코드 전송
      const response = await fetch('http://1.201.18.172:8080/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          redirectUri: window.location.origin + '/oauth/callback'
        })
      })
      
      if (!response.ok) {
        throw new Error('토큰 교환에 실패했습니다.')
      }
      
      const data = await response.json()
      
      // 성공 시 부모 창에 토큰 정보 전달
      window.opener?.postMessage({
        type: 'GOOGLE_LOGIN_SUCCESS',
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user
      }, window.location.origin)
      
      window.close()
      
    } catch (error) {
      console.error('토큰 교환 실패:', error)
      
      // 에러 발생 시 부모 창에 에러 메시지 전달
      window.opener?.postMessage({
        type: 'GOOGLE_LOGIN_ERROR',
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      }, window.location.origin)
      
      window.close()
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