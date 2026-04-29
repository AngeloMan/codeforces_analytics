// Exact official Codeforces rank titles with correct rating thresholds
export const CF_BANDS = [
  { min: 3000, color: '#FF0000', label: 'Legendary Grandmaster' },
  { min: 2600, color: '#FF7777', label: 'International Grandmaster' },
  { min: 2400, color: '#FF7777', label: 'Grandmaster' },
  { min: 2300, color: '#FFCC88', label: 'International Master' },
  { min: 2100, color: '#FFCC88', label: 'Master' },
  { min: 1900, color: '#FF88FF', label: 'Candidate Master' },
  { min: 1600, color: '#AAAAFF', label: 'Expert' },
  { min: 1400, color: '#77DDBB', label: 'Specialist' },
  { min: 1200, color: '#77FF77', label: 'Pupil' },
  { min: 0,    color: '#CCCCCC', label: 'Newbie' },
]

export function getRatingColor(rating) {
  if (rating === null || rating === undefined) return '#CCCCCC'
  for (const band of CF_BANDS) {
    if (rating >= band.min) return band.color
  }
  return '#CCCCCC'
}

export function getRatingLabel(rating) {
  if (rating === null || rating === undefined) return 'Unrated'
  for (const band of CF_BANDS) {
    if (rating >= band.min) return band.label
  }
  return 'Unrated'
}

// Reference areas for the rating chart — one per official rank tier
export const REFERENCE_AREAS = [
  { y1: 0,    y2: 1199, fill: '#CCCCCC', label: 'Newbie' },
  { y1: 1200, y2: 1399, fill: '#77FF77', label: 'Pupil' },
  { y1: 1400, y2: 1599, fill: '#77DDBB', label: 'Specialist' },
  { y1: 1600, y2: 1899, fill: '#AAAAFF', label: 'Expert' },
  { y1: 1900, y2: 2099, fill: '#FF88FF', label: 'Candidate Master' },
  { y1: 2100, y2: 2299, fill: '#FFCC88', label: 'Master' },
  { y1: 2300, y2: 2399, fill: '#FFCC88', label: 'International Master' },
  { y1: 2400, y2: 2599, fill: '#FF7777', label: 'Grandmaster' },
  { y1: 2600, y2: 2999, fill: '#FF7777', label: 'International Grandmaster' },
  { y1: 3000, y2: 5000, fill: '#FF0000', label: 'Legendary Grandmaster' },
]

// Heatmap legend — one entry per unique color group
export const HEATMAP_LEGEND = [
  { color: 'rgba(255,255,255,0.08)', label: 'No activity' },
  { color: '#CCCCCC', label: 'Newbie' },
  { color: '#77FF77', label: 'Pupil' },
  { color: '#77DDBB', label: 'Specialist' },
  { color: '#AAAAFF', label: 'Expert' },
  { color: '#FF88FF', label: 'Candidate Master' },
  { color: '#FFCC88', label: 'Master' },
  { color: '#FF7777', label: 'Grandmaster' },
  { color: '#FF0000', label: 'Legendary GM' },
]
