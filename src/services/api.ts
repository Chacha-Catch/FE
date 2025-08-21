const API_BASE_URL = 'https://chacha-catch.shop'

// API 응답 타입 정의
interface ApiNotice {
  id: number
  title: string
  content: string
  department: string
  publishedDate: string
  category: string
  originalUrl: string
  imageUrl?: string
  isBookmarked?: boolean
  isNew?: boolean
}

interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

interface NoticesResponse {
  notices: ApiNotice[]
  totalCount: number
  currentPage: number
  totalPages: number
}

// 토큰을 포함한 헤더 생성
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// 공지사항 목록 조회
export const getNotices = async (params: {
  page?: number
  size?: number
  category?: string
  keyword?: string
  bookmarkedOnly?: boolean
}): Promise<NoticesResponse> => {
  const searchParams = new URLSearchParams()
  
  if (params.page) searchParams.append('page', params.page.toString())
  if (params.size) searchParams.append('size', params.size.toString())
  if (params.category) searchParams.append('category', params.category)
  if (params.keyword) searchParams.append('keyword', params.keyword)
  if (params.bookmarkedOnly) searchParams.append('bookmarkedOnly', 'true')

  const response = await fetch(`${API_BASE_URL}/api/notices?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: ApiResponse<NoticesResponse> = await response.json()
  return result.data
}

// 북마크 토글
export const toggleBookmark = async (noticeId: number): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/api/notices/${noticeId}/bookmark`, {
    method: 'POST',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: ApiResponse<{ isBookmarked: boolean }> = await response.json()
  return result.data.isBookmarked
}

// API 응답을 앱 내부 타입으로 변환
export const transformApiNotice = (apiNotice: ApiNotice): NotificationItem => ({
  id: apiNotice.id.toString(),
  title: apiNotice.title,
  department: apiNotice.department,
  date: new Date(apiNotice.publishedDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '.').replace(/\.$/, ''),
  isBookmarked: apiNotice.isBookmarked || false,
  isNew: apiNotice.isNew || false,
  content: apiNotice.content,
  image: apiNotice.imageUrl,
  originalLink: apiNotice.originalUrl
})

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