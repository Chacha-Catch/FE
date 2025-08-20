interface NotificationAlert {
  id: string
  keyword: string
  aiGeneratedTitle: string
  originalTitle: string
  date: string
}

const Notifications = () => {
  const notifications: NotificationAlert[] = [
    {
      id: '1',
      keyword: '실전코딩',
      aiGeneratedTitle: '아! 너 이거 봐! 조은선 교수님 연구실에서 학부연구생 뽑는대! 졸업 프로젝트랑도 연결 가능하다고 하니까 완전 꿀인듯!',
      originalTitle: '3학년 주목! 조은선 교수님 연구실 학부연구생 모집 (프로그래밍, 졸업 프로젝트)',
      date: '2025.01.15'
    },
    {
      id: '2',
      keyword: '장학금',
      aiGeneratedTitle: '와! 새로운 장학금 공지 떴어! 성적 우수자들 대상으로 하는 것 같은데 한번 확인해봐!',
      originalTitle: '2025학년도 1학기 성적우수장학금 신청 안내',
      date: '2025.01.14'
    },
    {
      id: '3',
      keyword: '튜터',
      aiGeneratedTitle: '튜터 모집한다! 시간당 15,000원이래. 프로그래밍 과목 가르치는 거니까 너한테 딱일 것 같은데?',
      originalTitle: '2025학년도 1학기 프로그래밍 기초 과목 학습 튜터 모집',
      date: '2025.01.13'
    },
    {
      id: '4',
      keyword: '해외교류',
      aiGeneratedTitle: '해외 교환학생 기회야! 미국, 유럽 대학들이랑 교류 프로그램 있대. 영어 성적만 있으면 될 것 같아!',
      originalTitle: '2025년 하반기 해외교환학생 프로그램 참가자 모집',
      date: '2025.01.12'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4">알림</h2>

      {/* Notifications List */}
      <div className="space-y-4 mb-8">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="px-6 py-4 rounded-2xl border transition-colors hover:shadow-md bg-white border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {/* Keyword Tag */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-navy text-white text-xs font-medium rounded-full">
                    {notification.keyword}
                  </span>
                </div>

                {/* AI Generated Title */}
                <h3 className="text-lg font-medium text-gray-900 mb-2 leading-tight">
                  {notification.aiGeneratedTitle}
                </h3>

                {/* Original Title */}
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                  {notification.originalTitle}
                </p>

                {/* Date */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{notification.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">새로운 알림이 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export default Notifications