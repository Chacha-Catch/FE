import { useState } from 'react'

interface NotificationItem {
  id: string
  title: string
  department: string
  date: string
  isBookmarked: boolean
}

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('장학금')
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const categories = ['장학금', '국제교류', '교내 행사', '대회', '튜터', '전과', '학과 행사']

  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: '[소프트웨어중심대학] (2025학년도 8월 졸업예정자 ) 소프트웨어중심대학사업단 특별 장학생 선발 안내(마일리지 환급)',
      department: '컴퓨터융합학부',
      date: '2025.08.05',
      isBookmarked: true
    },
    {
      id: '2',
      title: '2025학년도 2학기 교내장학생 선발을 위한 장학서류 제출안내(신청자는 이메일로 먼저 제출)',
      department: '컴퓨터융합학부',
      date: '2025.08.04',
      isBookmarked: false
    },
    {
      id: '3',
      title: '2025학년도 제2학기 교내 장학생(재학생) 선발 계획 안내',
      department: '충남대학교 학사정보',
      date: '2025.08.04',
      isBookmarked: true
    },
    {
      id: '4',
      title: '2026년 소아·청소년 당뇨인 푸른빛 희망 장학금 지원 안내',
      department: '충남대학교 학사정보',
      date: '2025.08.04',
      isBookmarked: false
    },
    {
      id: '5',
      title: '[소프트웨어중심대학] (2025학년도 8월 졸업예정자 ) 소프트웨어중심대학사업단 특별 장학생 선발 안내(마일리지 환급)',
      department: '컴퓨터융합학부',
      date: '2025.08.05',
      isBookmarked: false
    },
    {
      id: '6',
      title: '2025학년도 2학기 교내장학생 선발을 위한 장학서류 제출안내(추가 모집)',
      department: '컴퓨터융합학부',
      date: '2025.08.03',
      isBookmarked: true
    },
    {
      id: '7',
      title: '2025학년도 하계방학 중 해외인턴십 프로그램 참가자 모집',
      department: '충남대학교 학사정보',
      date: '2025.08.02',
      isBookmarked: false
    },
    {
      id: '8',
      title: '2025학년도 2학기 SW특기자 전형 추가 모집 안내',
      department: '컴퓨터융합학부',
      date: '2025.08.01',
      isBookmarked: false
    },
    {
      id: '9',
      title: '[장학] 2025년 하반기 교내장학금 신청 안내 (성적우수, 가계곤란)',
      department: '충남대학교 학사정보',
      date: '2025.07.31',
      isBookmarked: true
    },
    {
      id: '10',
      title: '[국제교류] 2025년 하반기 해외교환학생 프로그램 신청 안내',
      department: '충남대학교 학사정보',
      date: '2025.07.30',
      isBookmarked: false
    }
    
  ]

  const toggleBookmark = (id: string) => {
    // 북마크 토글 로직 (실제로는 상태 업데이트 필요)
    console.log('북마크 토글:', id)
  }

  const filteredNotifications = notifications.filter(item => {
    if (showSavedOnly) return item.isBookmarked
    // 실제로는 selectedCategory에 따른 필터링 로직 필요
    return true
  })

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentNotifications = filteredNotifications.slice(startIndex, endIndex)

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">카테고리</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-end mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-gray-600">저장 게시글만 보기</span>
          <input
            type="checkbox"
            checked={showSavedOnly}
            onChange={(e) => setShowSavedOnly(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
        </label>
      </div>

             {/* Notifications List */}
       <div className="space-y-4 mb-8">
         {currentNotifications.map((item) => (
          <div
            key={item.id}
            className={`px-6 py-4 rounded-2xl border transition-colors hover:shadow-md bg-white ${
              item.isBookmarked ? 'border-navy' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2 leading-tight">
                  {item.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{item.department}</span>
                  <span>{item.date}</span>
                </div>
              </div>
              <button
                onClick={() => toggleBookmark(item.id)}
                className="ml-4 p-2"
              >
                <svg 
                  className={`w-6 h-6 ${item.isBookmarked ? 'text-navy' : 'text-gray-400'}`}
                  fill={item.isBookmarked ? 'currentColor' : 'none'}
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

             {/* Pagination */}
       <div className="flex justify-center items-center gap-4">
         <button 
           onClick={goToPreviousPage}
           disabled={currentPage === 1}
           className={`p-2 ${currentPage === 1 ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
         >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
           </svg>
         </button>
         <span className="text-sm text-gray-600">{currentPage}/{totalPages}</span>
         <button 
           onClick={goToNextPage}
           disabled={currentPage === totalPages}
           className={`p-2 ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
         >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
           </svg>
         </button>
       </div>
    </div>
  )
}

export default Home 