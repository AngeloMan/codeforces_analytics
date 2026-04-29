import { useEffect } from 'react'
import { useCodeforcesData } from './hooks/useCodeforcesData'
import { getRatingColor } from './utils/cfColors'
import Header from './components/Header'
import RatingChart from './components/RatingChart'
import ActivityHeatmap from './components/ActivityHeatmap'
import AnalyticsCharts from './components/AnalyticsCharts'
import UnsolvedCemetery from './components/UnsolvedCemetery'
import LoadingSpinner from './components/LoadingSpinner'

function StatCard({ label, value, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-gray-500 text-xs uppercase tracking-wide font-medium">{label}</p>
      <p
        className="text-2xl font-bold mt-1.5 tabular-nums"
        style={{ color: color ?? '#fff' }}
      >
        {value ?? '—'}
      </p>
    </div>
  )
}

function Card({ title, badge, children }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-white font-semibold text-sm">{title}</h2>
        {badge != null && (
          <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

export default function App() {
  const { loading, error, ratingHistory, analytics, userHandle, fetchData } = useCodeforcesData()

  useEffect(() => {
    fetchData('angeloman')
  }, [fetchData])

  const currentRating = ratingHistory?.length
    ? ratingHistory[ratingHistory.length - 1].newRating
    : null

  const maxRating = ratingHistory?.length
    ? Math.max(...ratingHistory.map((r) => r.newRating))
    : null

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header
        onSearch={fetchData}
        loading={loading}
        userHandle={userHandle}
        currentRating={currentRating}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {loading && <LoadingSpinner />}

        {error && (
          <div className="bg-red-950/50 border border-red-800 rounded-xl p-4">
            <p className="text-red-400 font-medium text-sm">Error</p>
            <p className="text-red-300/80 text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && analytics && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Current Rating"
                value={currentRating}
                color={currentRating ? getRatingColor(currentRating) : undefined}
              />
              <StatCard
                label="Peak Rating"
                value={maxRating}
                color={maxRating ? getRatingColor(maxRating) : undefined}
              />
              <StatCard label="Problems Solved" value={analytics.totalSolved} />
              <StatCard label="Contests" value={ratingHistory?.length ?? 0} />
            </div>

            {/* Rating chart */}
            <Card title="Rating History" badge={`${ratingHistory?.length ?? 0} contests`}>
              <RatingChart data={ratingHistory} />
            </Card>

            {/* Activity heatmap */}
            <Card title="Activity Heatmap">
              <ActivityHeatmap dailyData={analytics.dailyData} years={analytics.years} />
            </Card>

            {/* Analytics charts */}
            <AnalyticsCharts
              ratingData={analytics.ratingData}
              tagData={analytics.tagData}
            />

            {/* Unsolved cemetery */}
            <Card
              title="Unsolved Cemetery"
              badge={`${analytics.totalUnsolved} problems`}
            >
              <UnsolvedCemetery problems={analytics.unsolvedProblems} />
            </Card>
          </>
        )}

        {/* Empty state before first search */}
        {!loading && !error && !analytics && (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-2xl font-black text-yellow-400">
              CF
            </div>
            <p className="text-gray-400 text-sm">Enter a Codeforces handle to begin.</p>
          </div>
        )}
      </main>
    </div>
  )
}
