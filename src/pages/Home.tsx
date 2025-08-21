import { useState } from 'react'
import CharacterAlert from '../components/CharacterAlert'
import NotificationModal from '../components/NotificationModal'

interface NotificationItem {
  id: string
  title: string
  department: string
  date: string
  isBookmarked: boolean
  isNew?: boolean // 새 글 여부 추가
  content: string
  image?: string
  originalLink: string
}

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('장학금')
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showCharacterAlert, setShowCharacterAlert] = useState(true) // 캐릭터 알림 표시 여부
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 7

  const categories = ['장학금', '국제교류', '교내 행사', '대회', '튜터', '전과', '학과 행사']

  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: '[소프트웨어중심대학] (2025학년도 8월 졸업예정자 ) 소프트웨어중심대학사업단 특별 장학생 선발 안내(마일리지 환급)',
      department: '컴퓨터융합학부',
      date: '2025.08.05',
      isBookmarked: true,
      isNew: true,
      content: '소프트웨어중심대학사업단에서 안내드립니다.\n\n2025 하계 AI특강 신청 안내(-8/12 화)\n\n소프트웨어중심대학사업단에서는 안내 드립니다.\n\n2025 하계 AI특강을 다음과 같이 진행하오니 참여를 원하는 학생들은 많은 신청 바랍니다.\n\n- 주제: AI 활용 및 AI AGENT 구현 마스터 클래스\n- 일시: 2025. 8. 18.(월) ~ 8. 22.(금) 13:00-18:00\n- 장소: 공과5호관-종합1 동아리실(전정 1층)\n- 대상: 전교생\n- 신청 기간 - 2025. 8. 12(월)까지',
      image: '/api/placeholder/400/300',
      originalLink: 'https://cse.cnu.ac.kr/bbs/board.php?bo_table=sub5_1&wr_id=1234'
    },
    {
      id: '2',
      title: '2025학년도 2학기 교내장학생 선발을 위한 장학서류 제출안내(신청자는 이메일로 먼저 제출)',
      department: '컴퓨터융합학부',
      date: '2025.08.04',
      isBookmarked: false,
      content: '2025학년도 2학기 교내장학생 선발을 위한 서류 제출에 대해 안내드립니다.\n\n신청을 원하는 학생은 먼저 이메일로 신청서를 제출하시기 바랍니다.',
      originalLink: 'https://cse.cnu.ac.kr/bbs/board.php?bo_table=sub5_1&wr_id=1235'
    },
    {
      id: '3',
      title: '2025학년도 제2학기 교내 장학생(재학생) 선발 계획 안내',
      department: '충남대학교 학사정보',
      date: '2025.08.04',
      isBookmarked: true,
      isNew: true,
      content: '2025학년도 제2학기 교내 장학생(재학생) 선발 계획을 안내드립니다.\n\n자세한 내용은 첨부파일을 참조하시기 바랍니다.',
      originalLink: 'https://www.cnu.ac.kr/bbs/board.php?bo_table=notice&wr_id=1236'
    },
    {
      id: '4',
      title: '2026년 소아·청소년 당뇨인 푸른빛 희망 장학금 지원 안내',
      department: '충남대학교 학사정보',
      date: '2025.08.04',
      isBookmarked: false,
      content: '2026년 소아·청소년 당뇨인 푸른빛 희망 장학금 지원에 대해 안내드립니다.\n\n해당하는 학생들의 많은 신청 바랍니다.',
      originalLink: 'https://www.cnu.ac.kr/bbs/board.php?bo_table=notice&wr_id=1237'
    },
    {
      id: '5',
      title: '[소프트웨어중심대학] (2025학년도 8월 졸업예정자 ) 소프트웨어중심대학사업단 특별 장학생 선발 안내(마일리지 환급)',
      department: '컴퓨터융합학부',
      date: '2025.08.05',
      isBookmarked: false,
      content: '소프트웨어중심대학사업단 특별 장학생 선발 안내입니다.\n\n8월 졸업예정자를 대상으로 합니다.',
      originalLink: 'https://cse.cnu.ac.kr/bbs/board.php?bo_table=sub5_1&wr_id=1238'
    },
    {
      id: '6',
      title: '2025학년도 2학기 교내장학생 선발을 위한 장학서류 제출안내(추가 모집)',
      department: '컴퓨터융합학부',
      date: '2025.08.03',
      isBookmarked: true,
      isNew: true,
      content: '교내장학생 선발을 위한 추가 모집을 실시합니다.\n\n필요한 서류를 준비하여 제출하시기 바랍니다.',
      originalLink: 'https://cse.cnu.ac.kr/bbs/board.php?bo_table=sub5_1&wr_id=1239'
    },
    {
      id: '7',
      title: '2025학년도 하계방학 중 해외인턴십 프로그램 참가자 모집',
      department: '충남대학교 학사정보',
      date: '2025.08.02',
      isBookmarked: false,
      content: '하계방학 중 해외인턴십 프로그램 참가자를 모집합니다.\n\n글로벌 경험을 쌓을 수 있는 좋은 기회입니다.',
      originalLink: 'https://www.cnu.ac.kr/bbs/board.php?bo_table=notice&wr_id=1240'
    },
    {
      id: '8',
      title: '2025학년도 2학기 SW특기자 전형 추가 모집 안내',
      department: '컴퓨터융합학부',
      date: '2025.08.01',
      isBookmarked: false,
      content: 'SW특기자 전형 추가 모집을 실시합니다.\n\n관심 있는 학생들의 많은 지원 바랍니다.',
      originalLink: 'https://cse.cnu.ac.kr/bbs/board.php?bo_table=sub5_1&wr_id=1241'
    },
    {
      id: '9',
      title: '[장학] 2025년 하반기 교내장학금 신청 안내 (성적우수, 가계곤란)',
      department: '충남대학교 학사정보',
      date: '2025.07.31',
      isBookmarked: true,
      content: '2025년 하반기 교내장학금 신청을 안내드립니다.\n\n성적우수장학금과 가계곤란장학금을 신청할 수 있습니다.',
      originalLink: 'https://www.cnu.ac.kr/bbs/board.php?bo_table=notice&wr_id=1242'
    },
    {
      id: '10',
      title: '[국제교류] 2025년 하반기 해외교환학생 프로그램 신청 안내',
      department: '충남대학교 학사정보',
      date: '2025.07.30',
      isBookmarked: false,
      content: '2025년 하반기 해외교환학생 프로그램 신청을 안내드립니다.\n\n다양한 국가의 대학교와 교환학생 프로그램을 진행합니다.',
      originalLink: 'https://www.cnu.ac.kr/bbs/board.php?bo_table=notice&wr_id=1243'
    }
    
  ]

  const toggleBookmark = (id: string) => {
    // 북마크 토글 로직 (실제로는 상태 업데이트 필요)
    console.log('북마크 토글:', id)
  }

  // 캐릭터 알림 닫기
  const closeCharacterAlert = () => {
    setShowCharacterAlert(false)
  }

  // 새로운 알림 개수 확인
  const newNotificationsCount = notifications.filter(item => item.isNew).length

  // 공지사항 클릭 핸들러
  const handleNotificationClick = (notification: NotificationItem) => {
    setSelectedNotification(notification)
    setIsModalOpen(true)
  }

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedNotification(null)
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
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen relative">
      {/* 캐릭터 알림 컴포넌트 */}
      {showCharacterAlert && (
        <CharacterAlert 
          newNotificationsCount={newNotificationsCount}
          onClose={closeCharacterAlert}
        />
      )}

      {/* 공지사항 상세 모달 */}
      <NotificationModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={closeModal}
        onToggleBookmark={toggleBookmark}
      />

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
            className={`px-6 py-4 rounded-2xl border transition-colors hover:shadow-md bg-white relative cursor-pointer ${
              item.isBookmarked ? 'border-navy' : 'border-gray-200'
            } ${item.isNew ? ' border-l-blue-500' : ''}`}
            onClick={() => handleNotificationClick(item)}
          >
            {/* NEW 뱃지 */}
            {item.isNew && (
              <div className="absolute top-4 right-16 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                NEW
              </div>
            )}
            
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
                onClick={(e) => {
                  e.stopPropagation()
                  toggleBookmark(item.id)
                }}
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