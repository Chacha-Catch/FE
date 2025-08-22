import type { NotificationItem } from '../services/api'

interface CharacterAlertProps {
  alarms: NotificationItem[]
  onClose: () => void
  onAlarmClick: (alarm: NotificationItem) => void
}

const CharacterAlert = ({ alarms, onClose, onAlarmClick }: CharacterAlertProps) => {
  if (alarms.length === 0) {
    return null
  }

  return (
    <>
      {/* Dim 배경 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 animate-fade-in cursor-pointer" 
        onClick={onClose}
      />
      
      <div className="fixed bottom-20 right-6 z-50">
        {/* 말풍선들 */}
        <div className="mb-4 space-y-3">
        {alarms.slice(0, Math.min(3, alarms.length)).map((alarm, index) => (
          <div 
            key={alarm.id}
            onClick={() => onAlarmClick(alarm)}
            className="relative bg-white border-2 border-blue-200 rounded-2xl p-4 shadow-lg max-w-xs animate-bounce cursor-pointer hover:bg-blue-50 transition-colors"
            style={{ 
              animationDelay: `${index * 0.5}s`,
              animationDuration: '1s',
              animationIterationCount: '3'
            }}
          >
            <h4 className="text-sm font-bold text-gray-900 mb-1">
              {alarm.title}
            </h4>
            <p className="text-xs text-gray-600 line-clamp-2">
              {alarm.content.replace(/<br>/g, ' ').substring(0, 60)}...
            </p>
            <span className="text-xs text-blue-600 font-medium">
              클릭해서 자세히 보기
            </span>
            {/* 말풍선 꼬리 */}
            <div className="absolute bottom-0 left-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-200"></div>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          </div>
        ))}
      </div>

        {/* 캐릭터 이미지 */}
        <div className="relative">
          <img 
            src="/chacha.png" 
            alt="차차 캐릭터" 
            className="w-24 h-24 object-contain animate-pulse"
          />
          
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 text-white rounded-full text-xs hover:bg-gray-600 transition-colors flex items-center justify-center"
          >
            ✕
          </button>

          {/* 새 알림 뱃지 */}
          <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center animate-pulse">
            {alarms.length}
          </div>
        </div>
      </div>
    </>
  )
}

export default CharacterAlert 