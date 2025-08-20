import { useState } from 'react'

interface SearchResult {
  id: string
  title: string
  department: string
  date: string
  isBookmarked?: boolean
}

const Search = () => {
  const [selectedFilter, setSelectedFilter] = useState('제목+내용')
  const [searchKeyword, setSearchKeyword] = useState('튜터')
  const [showSavedOnly, setShowSavedOnly] = useState(false)

  const searchResults: SearchResult[] = [
    {
      id: '1',
      title: '2025학년도 1학기 학부교과목 "실전코딩" 튜터 신청 안내 (교수님께 신청 기한: 2025.2.21.(금) 18:00까지)',
      department: '컴퓨터융합학부',
      date: '2025.08.05',
      isBookmarked: false
    },
    {
      id: '2',
      title: '2025학년도 하기계절학기 SW기초교양교과목 학습도우미(튜터) 모집',
      department: '충남대학교 학사정보',
      date: '2025.08.04',
      isBookmarked: true
    },
    {
      id: '3',
      title: '[소프트웨어중심대학사업단] 2025 코딩 튜터 매칭 결과 안내',
      department: '컴퓨터융합학부',
      date: '2025.06.09',
      isBookmarked: false
    }
  ]

  const filterOptions = ['제목+내용', '제목', '내용', '작성자']

  const handleSearch = () => {
    console.log('검색:', searchKeyword, selectedFilter)
  }

  const toggleBookmark = (id: string) => {
    // 북마크 토글 로직 (실제로는 상태 업데이트 필요)
    console.log('북마크 토글:', id)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <h2 className="text-xl font-bold mb-6">검색</h2>

      {/* Search Bar */}
      <div className="flex gap-4 mb-6">
        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-40 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm appearance-none focus:ring-2 focus:ring-navy focus:border-navy"
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="튜터"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:ring-2 focus:ring-navy focus:border-navy"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-end mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-gray-600">저장 게시글만 보기</span>
          <input
            type="checkbox"
            checked={showSavedOnly}
            onChange={(e) => setShowSavedOnly(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
        </label>
      </div>

      {/* Search Results */}
      <div className="space-y-4 mb-8">
        {searchResults.map((result) => (
          <div
            key={result.id}
            className={`px-6 py-4  rounded-2xl border transition-colors hover:shadow-md bg-white ${
              result.isBookmarked ? 'border-navy' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2 leading-tight">
                  {result.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{result.department}</span>
                  <span>{result.date}</span>
                </div>
              </div>
              <button
                onClick={() => toggleBookmark(result.id)}
                className="ml-4 p-2"
              >
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
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message (if needed) */}
      {searchResults.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export default Search