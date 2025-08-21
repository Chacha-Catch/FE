import { useState, useEffect } from 'react'
import CharacterAlert from '../components/CharacterAlert'
import NotificationModal from '../components/NotificationModal'
import { getNotices, toggleBookmark as apiToggleBookmark, transformApiNotice } from '../services/api'
import type { NotificationItem } from '../services/api'

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('장학금')
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showCharacterAlert, setShowCharacterAlert] = useState(true) // 캐릭터 알림 표시 여부
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 7

  const categories = ['장학금', '국제교류', '교내 행사', '대회', '튜터', '전과', '학과 행사']

  // API에서 공지사항 데이터 가져오기
  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await getNotices({
        page: currentPage,
        size: itemsPerPage,
        category: selectedCategory,
        bookmarkedOnly: showSavedOnly
      })
      
      const transformedNotifications = response.notices.map(transformApiNotice)
      setNotifications(transformedNotifications)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('공지사항 조회 실패:', error)
      // 에러 발생 시 빈 배열로 설정
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 및 필터 변경 시 데이터 로드
  useEffect(() => {
    fetchNotifications()
  }, [currentPage, selectedCategory, showSavedOnly])

    // 북마크 토글 함수 수정
  const toggleBookmark = async (id: string) => {
    try {
      const noticeId = parseInt(id)
      const newBookmarkStatus = await apiToggleBookmark(noticeId)
      
      // 로컬 상태 업데이트
      setNotifications(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, isBookmarked: newBookmarkStatus }
            : item
        )
      )
    } catch (error) {
      console.error('북마크 토글 실패:', error)
      alert('북마크 변경에 실패했습니다.')
    }
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

  // 페이지네이션 버튼 핸들러
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
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
         {loading ? (
           <div className="flex justify-center py-12">
             <div className="text-center">
               <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
               <p className="text-gray-500">로딩 중...</p>
             </div>
           </div>
         ) : notifications.length === 0 ? (
           <div className="text-center py-12">
             <p className="text-gray-500">공지사항이 없습니다.</p>
           </div>
         ) : (
           notifications.map((item) => (
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
        ))
        )}
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