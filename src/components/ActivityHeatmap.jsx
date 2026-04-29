import { useMemo, useState } from 'react'
import { HEATMAP_LEGEND, getRatingColor, getRatingLabel } from '../utils/cfColors'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CELL = 14 // 12px square + 2px gap

function toDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildGrid(dailyData, period) {
  const now = new Date()
  now.setHours(23, 59, 59, 999)

  let rangeStart, rangeEnd

  if (period === 'last365') {
    rangeEnd = new Date(now)
    rangeStart = new Date(now)
    rangeStart.setDate(rangeStart.getDate() - 364)
    rangeStart.setHours(0, 0, 0, 0)
  } else {
    const year = Number(period)
    rangeStart = new Date(year, 0, 1, 0, 0, 0, 0)
    rangeEnd = new Date(year, 11, 31, 23, 59, 59, 999)
    if (rangeEnd > now) rangeEnd = new Date(now)
  }

  // Snap grid to nearest preceding Sunday
  const gridStart = new Date(rangeStart)
  gridStart.setDate(gridStart.getDate() - gridStart.getDay())

  const weeks = []
  const monthLabels = []
  const seenMonths = new Set()
  let current = new Date(gridStart)

  while (current <= rangeEnd) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const dateStr = toDateStr(current)
      const inRange = current >= rangeStart && current <= rangeEnd
      const entry = dailyData[dateStr]

      // Month label at first appearance per month (Sunday column only)
      if (inRange && d === 0) {
        const key = `${current.getFullYear()}-${current.getMonth()}`
        if (!seenMonths.has(key)) {
          seenMonths.add(key)
          monthLabels.push({ weekIndex: weeks.length, label: MONTHS[current.getMonth()] })
        }
      }

      week.push({
        dateStr,
        inRange,
        maxRating: entry?.maxRating ?? null,
        color: entry?.color ?? null,
        problems: entry?.problems ?? [],
      })
      current.setDate(current.getDate() + 1)
    }
    weeks.push(week)
  }

  return { weeks, monthLabels }
}

function HeatmapTooltip({ tooltip }) {
  if (!tooltip) return null
  const { day, x, y } = tooltip
  const estWidth = 240
  const adjustedX = x + estWidth > window.innerWidth ? x - estWidth - 20 : x
  const adjustedY = Math.max(8, y - 8)

  return (
    <div
      className="fixed z-50 bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-2xl pointer-events-none text-xs"
      style={{ left: adjustedX, top: adjustedY, minWidth: 160, maxWidth: estWidth }}
    >
      <p className="font-semibold text-white mb-2">{day.dateStr}</p>
      {day.problems.length > 0 ? (
        <ul className="space-y-1 max-h-52 overflow-auto pr-1">
          {day.problems.map((p, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: p.rating ? getRatingColor(p.rating) : '#6B7280' }}
              />
              <span className="text-gray-300 leading-tight">
                {p.name}
                {p.rating && (
                  <span
                    className="ml-1 font-mono font-bold text-[10px]"
                    style={{ color: getRatingColor(p.rating) }}
                  >
                    ({p.rating} · {getRatingLabel(p.rating)})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No solved problems</p>
      )}
    </div>
  )
}

export default function ActivityHeatmap({ dailyData, years = [] }) {
  const [selectedPeriod, setSelectedPeriod] = useState('last365')
  const [tooltip, setTooltip] = useState(null)

  const { weeks, monthLabels } = useMemo(
    () => buildGrid(dailyData, selectedPeriod),
    [dailyData, selectedPeriod],
  )

  const handleMouseEnter = (e, day) => {
    if (!day.inRange || day.problems.length === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({ x: rect.right + 8, y: rect.top, day })
  }

  return (
    <div>
      {/* Period selector */}
      <div className="mb-4">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-yellow-400 transition-colors cursor-pointer"
        >
          <option value="last365">Last 365 days</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block">
          {/* Month labels */}
          <div
            className="relative h-5 mb-1"
            style={{ width: weeks.length * CELL + 28 }}
          >
            {monthLabels.map(({ weekIndex, label }) => (
              <span
                key={`${weekIndex}-${label}`}
                className="absolute text-xs text-gray-500"
                style={{ left: 28 + weekIndex * CELL }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-0.5">
            {/* Day-of-week labels */}
            <div className="flex flex-col gap-0.5 mr-1 w-6 shrink-0">
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((lbl, i) => (
                <div
                  key={i}
                  className="h-3 flex items-center justify-end pr-1 text-gray-600 text-[9px] leading-none"
                >
                  {lbl}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: day.inRange
                        ? (day.color ?? 'rgba(255,255,255,0.07)')
                        : 'transparent',
                      cursor: day.inRange && day.problems.length > 0 ? 'pointer' : 'default',
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Difficulty legend */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-xs text-gray-600">Difficulty:</span>
        {HEATMAP_LEGEND.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      <HeatmapTooltip tooltip={tooltip} />
    </div>
  )
}
