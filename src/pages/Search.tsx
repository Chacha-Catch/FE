import { useState } from 'react'
import { searchNotices, transformApiNotice, toggleBookmark } from '../services/api'
import type { NotificationItem } from '../services/api'

interface SearchResult extends NotificationItem {}

const Search = () => {
  const [selectedFilter, setSelectedFilter] = useState('제목+내용')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [bookmarkLoading, setBookmarkLoading] = useState<string | null>(null) // 북마크 로딩 상태

  const filterOptions = ['제목+내용', '제목', '내용']

  // 검색 타입 매핑
  const getSearchType = (filter: string) => {
    switch (filter) {
      case '제목': return 'title'
      case '내용': return 'summary'
      case '제목+내용':
      default: return 'all'
    }
  }

  // 검색 함수
  const handleSearch = async (page: number = 1) => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력해주세요.')
      return
    }

    setLoading(true)
    setCurrentPage(page)

    try {
      console.log('🔍 검색 요청:', {
        keyword: searchKeyword,
        type: getSearchType(selectedFilter),
        page: page
      })

      const response = await searchNotices({
        keyword: searchKeyword.trim(),
        type: getSearchType(selectedFilter),
        page: page
      })

      const transformedResults = response.content.map(transformApiNotice)
      setSearchResults(transformedResults)
      setTotalPages(response.totalPages)
      setHasSearched(true)

      console.log('✅ 검색 성공:', transformedResults)

    } catch (error) {
      console.error('검색 실패:', error)
      alert('검색에 실패했습니다. 다시 시도해주세요.')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  // 북마크 토글
  const handleToggleBookmark = async (id: string) => {
    if (bookmarkLoading === id) return // 이미 처리 중이면 무시
    
    try {
      setBookmarkLoading(id) // 로딩 시작
      
      // 현재 북마크 상태 찾기
      const currentItem = searchResults.find(item => item.id === id)
      if (!currentItem) {
        throw new Error('공지사항을 찾을 수 없습니다.')
      }
      
      const newBookmarkStatus = await toggleBookmark(parseInt(id), currentItem.isBookmarked)
      
      // 검색 결과에서 해당 항목의 북마크 상태 업데이트
      setSearchResults(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, isBookmarked: newBookmarkStatus }
            : item
        )
      )
      
      console.log(`✅ 검색 결과 공지사항 ${newBookmarkStatus ? '저장' : '저장 해제'} 완료:`, currentItem.title)
    } catch (error) {
      console.error('북마크 토글 실패:', error)
      alert('북마크 처리에 실패했습니다.')
    } finally {
      setBookmarkLoading(null) // 로딩 종료
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <h2 className="text-xl font-bold mb-6">검색</h2>

      {/* Search Bar */}
      <div className="mb-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedFilter(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === option
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Search Input Area */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="w-full px-6 py-2 bg-white border border-gray-200 rounded-2xl text-gray-700 text-base  placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-8 py-2 bg-navy text-white rounded-2xl hover:bg-navy/90 disabled:bg-navy/50 transition-colors font-medium"
          >
            {loading ? '검색 중...' : '검색'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {!loading && searchResults.length > 0 && (
        <div className="space-y-4 mb-8">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className={`px-6 py-4 rounded-2xl border transition-colors hover:shadow-md bg-white cursor-pointer ${
                result.isBookmarked ? 'border-navy' : 'border-gray-200'
              }`}
              onClick={() => window.open(result.originalLink, '_blank')}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 leading-tight">
                    {result.title}
                  </h3>
                  {result.content && (
                    <div 
                      className="text-sm text-gray-600 mb-2 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: result.content.substring(0, 100) + '...' }}
                    />
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{result.department}</span>
                    <span>{result.date}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleBookmark(result.id)
                  }}
                  disabled={bookmarkLoading === result.id}
                  className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  {bookmarkLoading === result.id ? (
                    <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg 
                      className={`w-6 h-6 ${result.isBookmarked ? 'text-navy' : 'text-gray-400'}`}
                      fill={result.isBookmarked ? 'currentColor' : 'none'}
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
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">검색 중...</p>
        </div>
      )}

      {/* No Results Message */}
      {!loading && hasSearched && searchResults.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">다른 키워드로 검색해보세요.</p>
        </div>
      )}

      {/* Initial State Message */}
      {!loading && !hasSearched && (
        <div className="text-center py-12">
          <p className="text-gray-500">검색어를 입력하고 검색 버튼을 눌러주세요.</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && searchResults.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handleSearch(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            이전
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={() => handleSearch(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}

export default Search