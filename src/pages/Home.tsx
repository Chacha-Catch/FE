import { useState, useEffect } from 'react'
import CharacterAlert from '../components/CharacterAlert'
import NotificationModal from '../components/NotificationModal'
import { getNotices, getSavedNotices, toggleBookmark as apiToggleBookmark, transformApiNotice, getCategories, getUserAlarms } from '../services/api'
import type { NotificationItem, Category } from '../services/api'

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('장학금')
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showCharacterAlert, setShowCharacterAlert] = useState(true) // 캐릭터 알림 표시 여부
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [bookmarkLoading, setBookmarkLoading] = useState<string | null>(null) // 북마크 로딩 상태
  const [alarms, setAlarms] = useState<NotificationItem[]>([]) // 알림 데이터
  const [selectedAlarm, setSelectedAlarm] = useState<NotificationItem | null>(null) // 선택된 알림
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false) // 알림 모달 열림 상태

  // API에서 알림 데이터 가져오기
  const fetchAlarms = async () => {
    try {
      const alarmData = await getUserAlarms()
      const transformedAlarms = alarmData.map(transformApiNotice)
      setAlarms(transformedAlarms)
      console.log('🔔 변환된 알림 데이터:', transformedAlarms)
    } catch (error) {
      console.error('알림 조회 실패:', error)
      setAlarms([])
    }
  }

  // API에서 카테고리 데이터 가져오기
  const fetchCategories = async () => {
    try {
      const categoryData = await getCategories()
      setCategories(categoryData)
      // 첫 번째 카테고리를 기본 선택값으로 설정
      if (categoryData.length > 0 && !selectedCategory) {
        setSelectedCategory(categoryData[0].name)
      }
    } catch (error) {
      console.error('카테고리 조회 실패:', error)
      // 에러 발생 시 기본 카테고리로 설정
      setCategories([
        { id: 1, name: '장학금' },
        { id: 2, name: '국제교류' },
        { id: 3, name: '교내 행사' },
        { id: 4, name: '대회' },
        { id: 5, name: '튜터' },
        { id: 6, name: '전과' },
        { id: 7, name: '학과 행사' },
        { id: 8, name: '강의' },
        { id: 9, name: '인턴십' },
        { id: 10, name: '멘토' },
        { id: 11, name: '교환학생' },
        { id: 12, name: '학사 행사' }
      ])
    }
  }

  // API에서 공지사항 데이터 가져오기
  const fetchNotifications = async () => {
    setLoading(true)
    try {
      // 선택된 카테고리의 ID 찾기
      const selectedCategoryObj = categories.find(cat => cat.name === selectedCategory)
      const categoryId = selectedCategoryObj?.id
      
      if (!categoryId) {
        console.warn('카테고리 ID를 찾을 수 없습니다:', selectedCategory)
        setNotifications([])
        setLoading(false)
        return
      }
      
      let response
      
      if (showSavedOnly) {
        // 저장된 공지사항만 가져오기
        console.log('🔖 저장된 공지사항 조회:', { page: currentPage, categoryId })
        response = await getSavedNotices({
          page: currentPage,
          categoryId: categoryId
        })
        console.log('✅ 저장된 공지사항 응답:', response)
      } else {
        // 모든 공지사항 가져오기
        console.log('📋 전체 공지사항 조회:', { page: currentPage, categoryId })
        response = await getNotices({
          page: currentPage,
          categoryId: categoryId
        })
        console.log('✅ 전체 공지사항 응답:', response)
      }
      
      const transformedNotifications = response.content.map(transformApiNotice)
      console.log('🏠 Home - 변환된 공지사항들:', transformedNotifications)
      console.log('🏠 Home - 총 페이지 수:', response.totalPages)
      
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

  // 컴포넌트 마운트 시 카테고리와 알림 로드
  useEffect(() => {
    fetchCategories()
    fetchAlarms()
  }, [])

  // 필터 변경 시 데이터 로드
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      fetchNotifications()
    }
  }, [currentPage, selectedCategory, showSavedOnly, categories])

    // 북마크 토글 함수 수정
  const toggleBookmark = async (id: string) => {
    if (bookmarkLoading === id) return // 이미 처리 중이면 무시
    
    try {
      setBookmarkLoading(id) // 로딩 시작
      const noticeId = parseInt(id)
      
      // 현재 북마크 상태 찾기
      const currentItem = notifications.find(item => item.id === id)
      if (!currentItem) {
        throw new Error('공지사항을 찾을 수 없습니다.')
      }
      
      const newBookmarkStatus = await apiToggleBookmark(noticeId, currentItem.isBookmarked)
      
      // 로컬 상태 업데이트
      setNotifications(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, isBookmarked: newBookmarkStatus }
            : item
        )
      )
      
      console.log(`✅ 공지사항 ${newBookmarkStatus ? '저장' : '저장 해제'} 완료:`, currentItem.title)
    } catch (error) {
      console.error('북마크 토글 실패:', error)
      alert('북마크 변경에 실패했습니다.')
    } finally {
      setBookmarkLoading(null) // 로딩 종료
    }
  }

  // 캐릭터 알림 닫기
  const closeCharacterAlert = () => {
    setShowCharacterAlert(false)
  }


  // 공지사항 클릭 핸들러
  const handleNotificationClick = (notification: NotificationItem) => {
    setSelectedNotification(notification)
    setIsModalOpen(true)
  }

  // 알림 클릭 핸들러
  const handleAlarmClick = (alarm: NotificationItem) => {
    setSelectedAlarm(alarm)
    setIsAlarmModalOpen(true)
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
      // 페이지 변경 시 스크롤을 맨 위로 이동
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
      // 페이지 변경 시 스크롤을 맨 위로 이동
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen relative">
      {/* 캐릭터 알림 컴포넌트 */}
      {showCharacterAlert && alarms.length > 0 && (
        <CharacterAlert 
          alarms={alarms}
          onClose={closeCharacterAlert}
          onAlarmClick={handleAlarmClick}
        />
      )}

      {/* 공지사항 상세 모달 */}
      <NotificationModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={closeModal}
        onToggleBookmark={toggleBookmark}
      />

      {/* 알림 상세 모달 */}
      <NotificationModal
        notification={selectedAlarm}
        isOpen={isAlarmModalOpen}
        onClose={() => {
          setIsAlarmModalOpen(false)
          setSelectedAlarm(null)
        }}
        onToggleBookmark={toggleBookmark}
      />

      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">카테고리</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.name
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-end mb-6">
        <label className="flex items-center gap-2 cursor-pointer group">
          <span className={`text-sm transition-colors ${showSavedOnly ? 'text-navy font-medium' : 'text-gray-600 group-hover:text-gray-800'}`}>
            {showSavedOnly ? '저장된 공지사항' : '저장 게시글만 보기'}
          </span>
          <input
            type="checkbox"
            checked={showSavedOnly}
            onChange={(e) => setShowSavedOnly(e.target.checked)}
            className="w-4 h-4 text-navy border-gray-300 rounded focus:ring-navy focus:ring-2"
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
            {showSavedOnly ? (
              <div>
                <p className="text-gray-500 mb-2">저장된 공지사항이 없습니다.</p>
                <p className="text-sm text-gray-400">공지사항을 북마크하면 여기에서 확인할 수 있습니다.</p>
              </div>
            ) : (
              <p className="text-gray-500">공지사항이 없습니다.</p>
            )}
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
                disabled={bookmarkLoading === item.id}
                className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {bookmarkLoading === item.id ? (
                  <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
                ) : (
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
                )}
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