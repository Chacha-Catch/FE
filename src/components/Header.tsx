import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()

  const handleLogoClick = () => {
    // 홈 페이지로 이동
    navigate('/')
  }

  const handleCalendarClick = () => {
    // 구글 캘린더 새 탭에서 열기
    window.open('https://calendar.google.com', '_blank')
  }

  const handleProfileClick = () => {
    // 온보딩 페이지로 이동
    navigate('/onboarding')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 로고/제목 */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="홈으로 이동"
          >
            <img 
              src="/chacha-logo.png" 
              alt="차차캐치 로고" 
              className="h-12 object-contain"
            />
              <h1 className="text-2xl font-bold text-navy" style={{ fontFamily: 'yg-jalnan, sans-serif' }}>
                차차캐치
              </h1>
          </button>

          {/* 우측 아이콘들 */}
          <div className="flex items-center gap-4">
            {/* 캘린더 아이콘 */}
            <button 
              onClick={handleCalendarClick}
              className="relative hover:scale-105 transition-transform cursor-pointer"
              title="구글 캘린더 열기"
            >
              <img src="/calendar.webp" alt="캘린더" className="w-9 h-9" />
              {/* <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                31
              </div>
              <div className="absolute bottom-0 left-0 w-3 h-2 bg-yellow-400 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-3 h-2 bg-red-400 rounded-br-lg"></div> */}
            </button>

            {/* 사용자 프로필 */}
            <button 
              onClick={handleProfileClick}
              className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer"
              title="설정 페이지로 이동"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 