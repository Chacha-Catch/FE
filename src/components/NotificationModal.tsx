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
  if (!isOpen || !notification) return null

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
              
              {/* 북마크 버튼을 하단으로 이동 */}
              <button
                onClick={() => onToggleBookmark(notification.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg 
                  className={`w-5 h-5 ${notification.isBookmarked ? 'text-navy' : 'text-gray-400'}`}
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