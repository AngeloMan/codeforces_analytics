import { getRatingColor } from './cfColors'

export function transformSubmissions(submissions) {
  // Track all problems: key -> { problem, hasOk }
  const problemMap = new Map()

  for (const sub of submissions) {
    const { problem } = sub
    const key = problem.contestId != null
      ? `${problem.contestId}-${problem.index}`
      : `gym-${problem.name}`

    if (!problemMap.has(key)) {
      problemMap.set(key, { problem, hasOk: false })
    }
    if (sub.verdict === 'OK') {
      problemMap.get(key).hasOk = true
    }
  }

  const solvedProblems = []
  const unsolvedProblems = []

  for (const { problem, hasOk } of problemMap.values()) {
    if (hasOk) {
      solvedProblems.push(problem)
    } else {
      unsolvedProblems.push({
        name: problem.name,
        rating: problem.rating || null,
        tags: problem.tags || [],
        contestId: problem.contestId,
        index: problem.index,
        link: `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`,
      })
    }
  }

  // Sort unsolved by rating descending (hardest first)
  unsolvedProblems.sort((a, b) => (b.rating || 0) - (a.rating || 0))

  // Tag frequency from solved problems
  const tagMap = new Map()
  for (const p of solvedProblems) {
    for (const tag of (p.tags || [])) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    }
  }
  const tagData = [...tagMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, value]) => ({ name, value }))

  // Rating distribution buckets (per 100)
  const ratingMap = new Map()
  for (const p of solvedProblems) {
    if (p.rating) {
      const bucket = Math.floor(p.rating / 100) * 100
      ratingMap.set(bucket, (ratingMap.get(bucket) || 0) + 1)
    }
  }
  const ratingData = [...ratingMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([rating, count]) => ({
      rating: String(rating),
      count,
      fill: getRatingColor(rating),
    }))

  // Daily data for heatmap: max rating + all solved problems per day
  const dailyMap = new Map()
  const yearsSet = new Set()

  for (const sub of submissions) {
    const d = new Date(sub.creationTimeSeconds * 1000)
    yearsSet.add(String(d.getFullYear()))

    if (sub.verdict === 'OK') {
      const y = d.getFullYear()
      const mo = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const dateStr = `${y}-${mo}-${day}`

      if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, { maxRating: 0, problemsMap: new Map() })
      }
      const entry = dailyMap.get(dateStr)

      // Track unique problems by name
      if (!entry.problemsMap.has(sub.problem.name)) {
        entry.problemsMap.set(sub.problem.name, sub.problem.rating || null)
      }
      // Track max rated problem of the day
      if (sub.problem.rating && sub.problem.rating > entry.maxRating) {
        entry.maxRating = sub.problem.rating
      }
    }
  }

  const dailyData = {}
  for (const [date, { maxRating, problemsMap }] of dailyMap) {
    dailyData[date] = {
      maxRating: maxRating || null,
      color: maxRating ? getRatingColor(maxRating) : null,
      problems: [...problemsMap.entries()]
        .map(([name, rating]) => ({ name, rating }))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0)),
    }
  }

  const years = [...yearsSet].sort((a, b) => Number(b) - Number(a))

  return {
    solvedProblems,
    unsolvedProblems,
    tagData,
    ratingData,
    dailyData,
    years,
    totalSolved: solvedProblems.length,
    totalUnsolved: unsolvedProblems.length,
  }
}
