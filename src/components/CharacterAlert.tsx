interface CharacterAlertProps {
  newNotificationsCount: number
  onClose: () => void
}

const CharacterAlert = ({ newNotificationsCount, onClose }: CharacterAlertProps) => {
  // 캐릭터가 알려줄 새로운 글들 (최대 3개)
  const newNotificationMessages = [
    "야! 너 혹시 졸업 프로젝트 주제 고민하고 있었지? 내가 꿀팁 하나 알려줄게! 😎",
    "야! 너 이거 봐! 조은선 교수님 연구실에서 학부연구생 뽑는대! 졸업 프로젝트랑도 연결 가능하다고 하니까 완전 꿀인듯!",
    "어? 이건 놓치면 안 되는데! 소프트웨어 특별 장학금 신청 마감이 얼마 안 남았어! 🏃‍♀️💨"
  ]

  if (newNotificationsCount === 0) {
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
        {newNotificationMessages.slice(0, Math.min(3, newNotificationsCount)).map((message, index) => (
          <div 
            key={index}
            className="relative bg-white border-2 border-blue-200 rounded-2xl p-4 shadow-lg max-w-xs animate-bounce"
            style={{ 
              animationDelay: `${index * 0.5}s`,
              animationDuration: '1s',
              animationIterationCount: '3'
            }}
          >
            <p className="text-sm text-gray-800 font-medium leading-relaxed">
              {message}
            </p>
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
            {newNotificationsCount}
          </div>
        </div>
      </div>
    </>
  )
}

export default CharacterAlert 