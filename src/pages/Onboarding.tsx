import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { updateUserProfile } from '../services/api'

interface NotificationCategory {
  id: string
  label: string
  selected: boolean
}

interface Keyword {
  id: string
  text: string
}

const Onboarding = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  
  const [department, setDepartment] = useState('컴퓨터융합학부')
  const [grade, setGrade] = useState('2학년')
  const [status, setStatus] = useState('재학')
  const [notificationCategories, setNotificationCategories] = useState<NotificationCategory[]>([
    { id: 'scholarship', label: '장학금', selected: false },
    { id: 'international', label: '국제교류', selected: false },
    { id: 'campus', label: '교내 행사', selected: false },
    { id: 'competition', label: '대회', selected: false },
    { id: 'tutor', label: '튜터', selected: false },
    { id: 'major', label: '전과', selected: false },
    { id: 'department', label: '학과 행사', selected: false }
  ])
  const [keywords, setKeywords] = useState<Keyword[]>([

  ])
  const [newKeyword, setNewKeyword] = useState('')
  const [isFirstVisit, setIsFirstVisit] = useState(true) // 첫 방문 여부
  const [isSaving, setIsSaving] = useState(false) // 저장 중 상태

  // 첫 방문 여부 확인 및 이전 설정 불러오기
  useEffect(() => {
    const hasOnboardingData = localStorage.getItem('onboarding_completed')
    const savedData = localStorage.getItem('onboarding_data')
    
    setIsFirstVisit(!hasOnboardingData)
    
    // 이전 설정이 있다면 불러오기
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setDepartment(parsedData.department || '컴퓨터융합학부')
        setGrade(parsedData.grade || '2학년')
        setStatus(parsedData.status || '재학')
        
        if (parsedData.notificationCategories) {
          setNotificationCategories(prev => 
            prev.map(cat => ({
              ...cat,
              selected: parsedData.notificationCategories.some((saved: any) => saved.id === cat.id)
            }))
          )
        }
        
        if (parsedData.keywords) {
          setKeywords(parsedData.keywords)
        }
      } catch (error) {
        console.error('설정 불러오기 실패:', error)
      }
    }
  }, [])

  const toggleCategory = (id: string) => {
    setNotificationCategories(prev => 
      prev.map(cat => 
        cat.id === id ? { ...cat, selected: !cat.selected } : cat
      )
    )
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.find(k => k.text === newKeyword.trim())) {
      setKeywords(prev => [...prev, { id: Date.now().toString(), text: newKeyword.trim() }])
      setNewKeyword('')
    }
  }

  const removeKeyword = (id: string) => {
    setKeywords(prev => prev.filter(k => k.id !== id))
  }

  const handleSave = async () => {
    if (!user) {
      alert('사용자 정보를 찾을 수 없습니다.')
      return
    }

    setIsSaving(true)

    try {
      const onboardingData = {
        department,
        grade,
        status,
        notificationCategories: notificationCategories.filter(cat => cat.selected),
        keywords
      }
      
      console.log('저장:', onboardingData)
      
      // 년도를 숫자로 변환 (1학년 → 1)
      const yearNumber = parseInt(grade.replace('학년', ''))
      
      // API로 프로필 업데이트
      const profileData = {
        name: user.name,
        major: department,
        year: yearNumber,
        status: status,
        googleId: user.id,
        email: user.email
      }
      
      console.log('🚀 API 프로필 업데이트 요청:', profileData)
      
      await updateUserProfile(profileData)
      
      console.log('✅ 프로필 업데이트 성공')
      
      // 온보딩 완료 표시 (로컬 스토리지)
      localStorage.setItem('onboarding_completed', 'true')
      localStorage.setItem('onboarding_data', JSON.stringify(onboardingData))
      
      // 첫 방문이었다면 홈으로 이동
      if (isFirstVisit) {
        setIsFirstVisit(false)
        navigate('/')
      } else {
        // 마이페이지 수정이었다면 저장 완료 알림
        alert('설정이 저장되었습니다!')
      }
      
    } catch (error) {
      console.error('프로필 저장 실패:', error)
      alert('프로필 저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    const confirmLogout = window.confirm('정말 로그아웃하시겠습니까?')
    if (confirmLogout) {
      logout()
      navigate('/login')
    }
  }

  return (
    <div 
      className="max-w-md mx-auto p-6 min-h-screen rounded-2xl" 
    >
      {/* 뒤로가기 버튼 - 첫 방문이 아닐 때만 표시 */}
      {!isFirstVisit && (
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base font-medium">뒤로가기</span>
          </button>
        </div>
      )}
      <div className="mb-8">
        <p className="text-lg text-left font-bold mb-2">
          학과 <span className="text-red-500">*</span>
        </p>
        <div className="relative">
          <select 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="text-sm w-full px-6 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 appearance-none"
          >
            {/* <option value="건축학과">건축학과</option>
            <option value="건축공학과">건축공학과</option>
            <option value="토목공학과">토목공학과</option>
            <option value="환경공학과">환경공학과</option>
            <option value="기계공학부">기계공학부</option>
            <option value="메카트로닉스공학과">메카트로닉스공학과</option>
            <option value="선박해양공학과">선박해양공학과</option>
            <option value="항공우주공학과">항공우주공학과</option>
            <option value="전기공학과">전기공학과</option>
            <option value="전자공학과">전자공학과</option>
            <option value="전파정보통신공학과">전파정보통신공학과</option> */}
            <option value="컴퓨터융합학부">컴퓨터융합학부</option>
            <option value="인공지능학과">인공지능학과</option>
            <option value="신소재공학과">신소재공학과</option>
            <option value="응용화학공학과">응용화학공학과</option>
            <option value="유기재료공학과">유기재료공학과</option>
            <option value="자율운항시스템공학과">자율운항시스템공학과</option>
            <option value="에너지공학과">에너지공학과</option>
            <option value="정보통신융합학부">정보통신융합학부</option>
            <option value="반도체융합학과">반도체융합학과</option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Student Info Section */}
      <div className="mb-8">
        <p className="block text-lg font-bold mb-2">
          학사정보 <span className="text-red-500">*</span>
        </p>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <select 
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="text-sm w-full px-6 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 appearance-none"
            >
              <option value="1학년">1학년</option>
              <option value="2학년">2학년</option>
              <option value="3학년">3학년</option>
              <option value="4학년">4학년</option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
          </div>
          <div className="flex-1 relative">
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-sm w-full px-6 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 appearance-none"
            >
              <option value="재학">재학</option>
              <option value="휴학">휴학</option>
              <option value="졸업">졸업</option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Categories Section */}
      <div className="mb-8">
        <p className="block text-lg font-bold mb-2">
          알림받을 정보
        </p>
        <div className="flex flex-wrap gap-3">
          {notificationCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className="px-6 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                backgroundColor: category.selected ? '#111827' : '#f3f4f6',
                color: category.selected ? '#ffffff' : '#4b5563'
              }}
              onMouseEnter={(e) => {
                if (!category.selected) {
                  e.currentTarget.style.backgroundColor = '#e5e7eb'
                }
              }}
              onMouseLeave={(e) => {
                if (!category.selected) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Keywords Section */}
      <div className="mb-12">
        <p className="block text-lg font-bold mb-2">
          알림 받을 키워드
        </p>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="ex) 엔지니어링페어, 프로젝트페어"
            className="flex-1 px-6 py-2 text-sm rounded-2xl border border-gray-200"
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
          />
          <button
            onClick={addKeyword}
            className="w-14 h-12 rounded-2xl flex items-center justify-center transition-colors"
            style={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e5e7eb'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff'
            }}
          >
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        {/* Existing Keywords */}
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <div
              key={keyword.id}
              className="flex items-center bg-navy/10 text-navy px-4 py-2 rounded-full"
            >
              <span className="text-sm font-medium">#{keyword.text}</span>
              <button
                onClick={() => removeKeyword(keyword.id)}
                className="ml-2 text-navy/60 hover:text-navy transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>


      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-navy hover:bg-navy/90 disabled:bg-navy/50 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>저장 중...</span>
          </>
        ) : (
          <span>{isFirstVisit ? '설정 완료' : '저장하기'}</span>
        )}
      </button>

            {/* Logout Button - 첫 방문이 아닐 때만 표시 */}
      {!isFirstVisit && (
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl text-base font-medium transition-colors mb-4"
        >
          로그아웃
        </button>
      )}

    </div>
  )
}

export default Onboarding 