import { useState, useCallback } from 'react'
import { transformSubmissions } from '../utils/dataTransform'

function formatDate(unixSeconds) {
  const d = new Date(unixSeconds * 1000)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}

export function useCodeforcesData() {
  const [state, setState] = useState({
    loading: false,
    error: null,
    ratingHistory: null,
    analytics: null,
    userHandle: null,
  })

  const fetchData = useCallback(async (handle) => {
    if (!handle?.trim()) return
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const [ratingRes, statusRes] = await Promise.all([
        fetch(`https://codeforces.com/api/user.rating?handle=${handle}`),
        fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`),
      ])

      const [ratingJson, statusJson] = await Promise.all([
        ratingRes.json(),
        statusRes.json(),
      ])

      if (ratingJson.status !== 'OK') {
        throw new Error(ratingJson.comment || `Handle "${handle}" not found`)
      }
      if (statusJson.status !== 'OK') {
        throw new Error(statusJson.comment || 'Failed to fetch submissions')
      }

      const ratingHistory = ratingJson.result.map((r) => ({
        date: formatDate(r.ratingUpdateTimeSeconds),
        timestamp: r.ratingUpdateTimeSeconds,
        timestampMs: r.ratingUpdateTimeSeconds * 1000,
        newRating: r.newRating,
        oldRating: r.oldRating,
        // Heuristic: performance = oldRating + 3.5*(delta). First contest uses newRating directly.
        performance: r.oldRating === 0
          ? r.newRating
          : Math.round(r.oldRating + 3.5 * (r.newRating - r.oldRating)),
        contestName: r.contestName,
        rank: r.rank,
      }))

      const analytics = transformSubmissions(statusJson.result)

      setState({
        loading: false,
        error: null,
        ratingHistory,
        analytics,
        userHandle: handle,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'An unexpected error occurred',
      }))
    }
  }, [])

  return { ...state, fetchData }
}
