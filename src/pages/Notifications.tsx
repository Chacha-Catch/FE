import { useState, useEffect } from 'react'
import NotificationModal from '../components/NotificationModal'
import { getKeywordAlarms, transformKeywordAlarm } from '../services/api'
import type { NotificationItem } from '../services/api'

interface KeywordNotification {
  notification: NotificationItem
  keywords: string[]
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<KeywordNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 키워드 알림 데이터 가져오기
  const fetchKeywordAlarms = async () => {
    setLoading(true)
    try {
      const alarmData = await getKeywordAlarms()
      const transformedNotifications = alarmData.map(alarm => ({
        notification: transformKeywordAlarm(alarm),
        keywords: alarm.keywords
      }))
      setNotifications(transformedNotifications)
      console.log('🔔 변환된 키워드 알림:', transformedNotifications)
    } catch (error) {
      console.error('키워드 알림 조회 실패:', error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchKeywordAlarms()
  }, [])

  // 알림 클릭 핸들러
  const handleNotificationClick = (notification: NotificationItem) => {
    setSelectedNotification(notification)
    setIsModalOpen(true)
  }

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedNotification(null)
  }

  // 북마크 토글 (키워드 알림은 북마크 기능 없음)
  const handleToggleBookmark = () => {
    // 키워드 알림은 북마크 기능을 제공하지 않음
    console.log('키워드 알림은 북마크 기능을 지원하지 않습니다.')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4">알림</h2>

      {/* 모달 */}
      <NotificationModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={closeModal}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-500">알림을 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* Notifications List */}
      {!loading && (
        <div className="space-y-4 mb-8">
          {notifications.map((item) => (
            <div
              key={item.notification.id}
              onClick={() => handleNotificationClick(item.notification)}
              className="px-6 py-4 rounded-2xl border transition-colors hover:shadow-md bg-white border-gray-200 cursor-pointer hover:border-navy"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Keywords Tags */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {item.keywords.map((keyword, index) => (
                      <span key={index} className="inline-block px-3 py-1 bg-navy text-white text-xs font-medium rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-medium text-gray-900 mb-2 leading-tight">
                    {item.notification.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed line-clamp-2">
                    {item.notification.content.substring(0, 100)}...
                  </p>

                  {/* Date */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{item.notification.date}</span>
                    <span className="text-blue-600">클릭해서 자세히 보기</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && notifications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">새로운 알림이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">키워드 설정을 확인해보세요.</p>
        </div>
      )}
    </div>
  )
}

export default Notifications