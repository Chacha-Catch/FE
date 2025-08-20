import { useLocation, useNavigate } from 'react-router-dom'

const BottomNavigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    {
      path: '/',
      icon: (isActive: boolean) => (
        <svg className={`w-6 h-6 ${isActive ? 'text-black' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      ),
      label: '홈',
      name: 'home'
    },
    {
      path: '/search',
      icon: (isActive: boolean) => (
        <svg className={`w-6 h-6 ${isActive ? 'text-black' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      label: '검색',
      name: 'search'
    },
    {
      path: '/notifications',
      icon: (isActive: boolean) => (
        <svg className={`w-6 h-6 ${isActive ? 'text-black' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
      ),
      label: '알림',
      name: 'notifications'
    }
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center py-2 px-4 min-w-0 flex-1"
            >
              <div className="mb-1">
                {item.icon(isActive)}
              </div>
              <span className={`text-xs ${isActive ? 'text-black font-medium' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation 