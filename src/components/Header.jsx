import { useState } from 'react'
import { getRatingColor, getRatingLabel } from '../utils/cfColors'

export default function Header({ onSearch, loading, userHandle, currentRating }) {
  const [input, setInput] = useState('tourist')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) onSearch(input.trim())
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-gray-900 font-black text-sm">
            CF
          </div>
          <h1 className="text-white font-bold text-lg tracking-tight">
            CF Analytics
          </h1>
          {userHandle && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">/</span>
              <span className="text-gray-300 text-sm font-medium">{userHandle}</span>
              {currentRating != null && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-800"
                  style={{ color: getRatingColor(currentRating) }}
                >
                  {currentRating} · {getRatingLabel(currentRating)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="flex gap-2 sm:ml-auto w-full sm:w-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Codeforces handle..."
            className="flex-1 sm:flex-none sm:w-52 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400 text-sm placeholder-gray-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-900 disabled:text-yellow-700 text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            {loading ? 'Loading…' : 'Analisar'}
          </button>
        </form>
      </div>
    </header>
  )
}
