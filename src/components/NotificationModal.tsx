import { useState } from 'react'
import { addToGoogleCalendar } from '../services/api'

interface NotificationModalProps {
  notification: {
    id: string
    title: string
    department: string
    date: string
    isBookmarked: boolean
    content: string
    image?: string
    originalLink: string
  } | null
  isOpen: boolean
  onClose: () => void
  onToggleBookmark: (id: string) => void
}

const NotificationModal = ({ notification, isOpen, onClose, onToggleBookmark }: NotificationModalProps) => {
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false)

  if (!isOpen || !notification) return null

  const handleAddToCalendar = async () => {
    if (!notification) return

    setIsAddingToCalendar(true)
    try {
      console.log("notification.id", notification.id)
      await addToGoogleCalendar(notification.id)
      alert('구글 캘린더에 성공적으로 등록되었습니다!')
    } catch (error) {
      console.error('캘린더 등록 실패:', error)
      alert(`캘린더 등록에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsAddingToCalendar(false)
    }
  }

  return (
    <>
      {/* Dim 배경 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-gray-900 leading-tight flex-1 pr-4">
                {notification.title}
              </h2>
              
              {/* 닫기 버튼만 우상단에 */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{notification.department}</span>
                <span>{notification.date}</span>
              </div>
              
              {/* 액션 버튼들 */}
              <div className="flex items-center gap-1">
                {/* 캘린더 등록 버튼 */}
                <button
                  onClick={handleAddToCalendar}
                  disabled={isAddingToCalendar}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-navy text-navy rounded-md hover:text-white hover:bg-navy/90 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                >
                  {isAddingToCalendar ? (
                    <>
                      <div className="w-3 h-3 border border-navy border-t-transparent rounded-full animate-spin"></div>
                      <span>등록중</span>
                    </>
                  ) : (
                    <>
                      <img src="/calendar.webp" alt="캘린더" className="w-4 h-4" />
                      <span>캘린더등록</span>
                    </>
                  )}
                </button>
                
                {/* 북마크 버튼 */}
                <button
                  onClick={() => onToggleBookmark(notification.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <svg 
                    className={`w-4 h-4 ${notification.isBookmarked ? 'text-navy' : 'text-gray-400'}`}
                    fill={notification.isBookmarked ? 'currentColor' : 'none'}
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
          </div>

          {/* 본문 */}
          <div className="p-6">
            {/* 이미지가 있는 경우 */}
            {notification.image && (
              <div className="mb-6">
                <img 
                  src={notification.image} 
                  alt="공지사항 이미지"
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
            )}
            
            {/* 내용 */}
            <div className="mb-6">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {notification.content}
              </div>
            </div>
            
            {/* 원본 링크 버튼 */}
            <div className="pt-4 border-t border-gray-200">
              <a
                href={notification.originalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                원본 공지사항 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotificationModal 