const API_BASE_URL = 'https://chacha-catch.shop'

// 토큰 재발급 플래그 (중복 요청 방지)
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })
  
  failedQueue = []
}

// API 응답 타입 정의 (실제 API 구조에 맞춤)
interface ApiNotice {
  createdAt: string
  keywords: string
  summaryText?: string  // 일반 공지사항에서 사용
  summary?: string      // 저장된 공지사항에서 사용
  isSaved: boolean
  summaryId?: number    // 일반 공지사항에서 사용
  id?: number          // 저장된 공지사항에서 사용
  writer: string
  title: string
  url: string
}

interface NoticesResponse {
  content: ApiNotice[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: any
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: any
  first: boolean
  numberOfElements: number
  empty: boolean
}

// 토큰 재발급 함수
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken')
  
  if (!refreshToken) {
    throw new Error('Refresh token not found')
  }

  console.log('🔄 Refreshing access token...')

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  })

  if (!response.ok) {
    throw new Error('Token refresh failed')
  }

  const data = await response.json()
  const newAccessToken = data.accessToken || data.token || data.jwt

  if (!newAccessToken) {
    throw new Error('New access token not received')
  }

  // 새 토큰 저장
  localStorage.setItem('accessToken', newAccessToken)
  
  console.log('✅ Access token refreshed successfully')
  return newAccessToken
}

// 토큰을 포함한 헤더 생성
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// 토큰 갱신을 지원하는 API 요청 래퍼
const apiRequestWithRefresh = async (url: string, options: RequestInit): Promise<Response> => {
  // 첫 번째 요청 시도
  let response = await fetch(url, options)

  return response;
  
  // 401 또는 500 에러이고 토큰이 있는 경우 재발급 시도
  if ((response.status === 401 || response.status === 500) && localStorage.getItem('accessToken')) {
    console.log(`⚠️ ${response.status} 에러 발생, 토큰 재발급 시도...`)
    
    if (isRefreshing) {
      // 이미 토큰 재발급 중이면 대기
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve: (token: string) => {
          // 새 토큰으로 요청 재시도
          const newOptions = {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${token}`
            }
          }
          resolve(fetch(url, newOptions))
        }, reject })
      })
    }
    
    isRefreshing = true
    
    try {
      const newToken = await refreshAccessToken()
      
      // 새 토큰으로 원래 요청 재시도
      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`
        }
      }
      
      response = await fetch(url, newOptions)
      
      // 대기 중인 요청들에 새 토큰 전달
      processQueue(null, newToken)
      
    } catch (refreshError) {
      console.error('❌ 토큰 재발급 실패:', refreshError)
      
      // 토큰 재발급 실패 시 로그아웃 처리
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      
      // 대기 중인 요청들에 에러 전달
      processQueue(refreshError, null)
      
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login'
      
      throw refreshError
    } finally {
      isRefreshing = false
    }
  }
  
  return response
}

// 공지사항 목록 조회
export const getNotices = async (params: {
  page?: number
  categoryId?: number
  keyword?: string
}): Promise<NoticesResponse> => {
  const searchParams = new URLSearchParams()
  
  if (params.page) searchParams.append('page', (params.page - 1).toString())
  if (params.categoryId) searchParams.append('categoryId', params.categoryId.toString())
  if (params.keyword) searchParams.append('keyword', params.keyword)

  const response = await apiRequestWithRefresh(`${API_BASE_URL}/api/notices?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: NoticesResponse = await response.json()
  return result
}

// 저장된 공지사항 가져오기
export const getSavedNotices = async (params: {
  page?: number
  categoryId?: number
  keyword?: string
}): Promise<NoticesResponse> => {
  const searchParams = new URLSearchParams()
  
  if (params.page) searchParams.append('page', (params.page - 1).toString())
  if (params.categoryId) searchParams.append('categoryId', params.categoryId.toString())
  if (params.keyword) searchParams.append('keyword', params.keyword)

  const response = await apiRequestWithRefresh(`${API_BASE_URL}/api/notices/saved?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: NoticesResponse = await response.json()
  return result
}

// 공지사항 저장
export const saveNotice = async (noticeId: number): Promise<boolean> => {
  const response = await apiRequestWithRefresh(`${API_BASE_URL}/api/notices/${noticeId}`, {
    method: 'POST',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  console.log('✅ 공지사항 저장 성공:', noticeId)
  return true // 저장 성공
}

// 공지사항 저장 해제 (삭제)
export const unsaveNotice = async (noticeId: number): Promise<boolean> => {
  const response = await apiRequestWithRefresh(`${API_BASE_URL}/api/notices/${noticeId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  console.log('✅ 공지사항 저장 해제 성공:', noticeId)
  return false // 저장 해제
}

// 북마크 토글 (저장 상태에 따라 저장/해제)
export const toggleBookmark = async (noticeId: number, currentBookmarkState: boolean): Promise<boolean> => {
  try {
    if (currentBookmarkState) {
      // 이미 저장되어 있으면 해제
      await unsaveNotice(noticeId)
      return false
    } else {
      // 저장되어 있지 않으면 저장
      await saveNotice(noticeId)
      return true
    }
  } catch (error) {
    console.error('북마크 토글 실패:', error)
    throw error
  }
}

// API 응답을 앱 내부 타입으로 변환
export const transformApiNotice = (apiNotice: ApiNotice): NotificationItem => {
  // ID 필드: summaryId(일반) 또는 id(저장된) 사용
  const noticeId = apiNotice.summaryId || apiNotice.id || 0
  
  // 내용 필드: summaryText(일반) 또는 summary(저장된) 사용
  const content = apiNotice.summaryText || apiNotice.summary || ''
  
  console.log('🔄 transformApiNotice:', {
    original: apiNotice,
    noticeId,
    content: content.substring(0, 50) + '...'
  })
  
  const result = {
    id: noticeId.toString(),
    title: apiNotice.title,
    department: apiNotice.writer,
    date: new Date(apiNotice.createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, ''),
    isBookmarked: apiNotice.isSaved,
    isNew: false, // API에서 제공하지 않으므로 기본값
    content: content.replace(/<br>/g, '\n'), // HTML br 태그를 줄바꿈으로 변환
    image: undefined, // API에서 제공하지 않음
    originalLink: apiNotice.url
  }
  
  console.log('✅ 변환 결과:', result)
  return result
}

// 카테고리 타입 정의
export interface Category {
  id: number
  name: string
}

// 사용자 프로필 인터페이스
interface UserProfile {
  userId: number
  name: string
  major: string
  year: number
  status: string
  googleId: string
  email: string
  categories?: Array<{
    id: number
    name: string
  }>
  keywords?: string[]
}

// 프로필 조회 함수
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await apiRequestWithRefresh(`${API_BASE_URL}/api/user/me/profile`, {
    method: 'GET',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()
  console.log('👤 프로필 조회 응답:', result)
  return result
}

// 프로필 업데이트 함수
export const updateUserProfile = async (profileData: {
  name: string
  major: string
  year: number
  status: string
  categories: number[]
  keywords: string[]
}): Promise<UserProfile | { message: string }> => {
  const response = await apiRequestWithRefresh(`${API_BASE_URL}/api/user/me/profile`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  // 응답이 JSON인지 텍스트인지 확인
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    const result = await response.json()
    return result
  } else {
    // 텍스트 응답인 경우 (성공 메시지)
    const textResult = await response.text()
    console.log('✅ 서버 응답:', textResult)
    return { message: textResult }
  }
}

// 공지사항 검색 함수
export const searchNotices = async (params: {
  keyword: string
  type?: string  // 검색 타입 (title, summary, all)
  page?: number  // 페이지 번호 (0부터 시작)
}): Promise<NoticesResponse> => {
  const searchParams = new URLSearchParams()
  
  searchParams.append('keyword', params.keyword)
  if (params.type) {
    searchParams.append('type', params.type)
  }
  if (params.page !== undefined) {
    searchParams.append('page', (params.page - 1).toString()) // UI는 1부터, API는 0부터
  }

  const response = await apiRequestWithRefresh(`${API_BASE_URL}/api/notices/search?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()
  console.log('🔍 검색 API 응답:', result)
  return result
}

// 카테고리 목록 조회
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

// 사용자 맞춤 알림 조회 (공지사항과 동일한 형식)
export const getUserAlarms = async (): Promise<ApiNotice[]> => {
  const response = await apiRequestWithRefresh(`${API_BASE_URL}/api/alarms/categories`, {
    method: 'GET',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()
  console.log('🔔 알림 API 응답:', result)
  return result
}

// 키워드 기반 알림 관련 타입 정의
interface KeywordAlarmApiResponse {
  url: string
  summaryId: number
  summaryText: string
  createdAt: string
  keywords: string[]
  title: string
}

// 키워드 기반 알림 조회
export const getKeywordAlarms = async (): Promise<KeywordAlarmApiResponse[]> => {
  const response = await apiRequestWithRefresh(`${API_BASE_URL}/api/alarms/keywords`, {
    method: 'GET',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()
  console.log('🔔 키워드 알림 API 응답:', result)
  return result
}

// 키워드 알림을 NotificationItem으로 변환
export const transformKeywordAlarm = (alarm: KeywordAlarmApiResponse): NotificationItem => {
  return {
    id: alarm.summaryId.toString(),
    title: alarm.title,
    department: '키워드 알림', // 키워드 알림은 부서 정보가 없으므로 기본값
    date: new Date(alarm.createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, ''),
    isBookmarked: false, // 키워드 알림은 북마크 기능 없음
    isNew: false,
    content: alarm.summaryText.replace(/<br>/g, '\n'),
    image: undefined,
    originalLink: alarm.url
  }
}

// 구글 캘린더 등록 함수
export const addToGoogleCalendar = async (noticeId: string | number): Promise<boolean> => {
  try {
    // 구글 캘린더 API용 액세스 토큰 가져오기
    const googleAccessToken = localStorage.getItem('googleAccessToken')
    
    if (!googleAccessToken) {
      throw new Error('구글 캘린더 액세스 토큰이 없습니다. 다시 로그인해주세요.')
    }

    console.log("noticeId", noticeId)
    console.log("googleAccessToken", googleAccessToken.substring(0, 20) + '...')
    

    const response = await apiRequestWithRefresh(`${API_BASE_URL}/api/calendar/${noticeId}`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'X-Google-Access-Token': googleAccessToken
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('캘린더 등록 실패 응답:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    console.log('✅ 구글 캘린더 등록 성공:', noticeId)
    return true
  } catch (error) {
    console.error('❌ 구글 캘린더 등록 실패:', error)
    throw error
  }
}

// 내부 타입 정의 (기존 Home.tsx에서 사용하던 타입)
export interface NotificationItem {
  id: string
  title: string
  department: string
  date: string
  isBookmarked: boolean
  isNew?: boolean
  content: string
  image?: string
  originalLink: string
} 