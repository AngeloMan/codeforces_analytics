export const CF_BANDS = [
  { min: 3000, color: '#FF0000', label: 'Legendary Grandmaster' },
  { min: 2400, color: '#FF7777', label: 'Red' },
  { min: 2100, color: '#FFCC88', label: 'Orange' },
  { min: 1900, color: '#FF88FF', label: 'Violet' },
  { min: 1600, color: '#AAAAFF', label: 'Blue' },
  { min: 1400, color: '#77DDBB', label: 'Cyan' },
  { min: 1200, color: '#77FF77', label: 'Green' },
  { min: 0, color: '#CCCCCC', label: 'Gray' },
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

// Reference areas for the rating chart background coloring
export const REFERENCE_AREAS = [
  { y1: 0,    y2: 1199, fill: '#CCCCCC', label: 'Newbie' },
  { y1: 1200, y2: 1399, fill: '#77FF77', label: 'Pupil' },
  { y1: 1400, y2: 1599, fill: '#77DDBB', label: 'Specialist' },
  { y1: 1600, y2: 1899, fill: '#AAAAFF', label: 'Expert' },
  { y1: 1900, y2: 2099, fill: '#FF88FF', label: 'Candidate Master' },
  { y1: 2100, y2: 2399, fill: '#FFCC88', label: 'Master' },
  { y1: 2400, y2: 4000, fill: '#FF7777', label: 'Grandmaster+' },
]

// Heatmap legend squares
export const HEATMAP_LEGEND = [
  { color: 'rgba(255,255,255,0.08)', label: 'No activity' },
  { color: '#CCCCCC', label: '< 1200' },
  { color: '#77FF77', label: '1200–1399' },
  { color: '#77DDBB', label: '1400–1599' },
  { color: '#AAAAFF', label: '1600–1899' },
  { color: '#FF88FF', label: '1900–2099' },
  { color: '#FFCC88', label: '2100–2399' },
  { color: '#FF7777', label: '2400+' },
]
