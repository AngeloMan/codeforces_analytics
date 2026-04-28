import { useState } from 'react'
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceArea, Brush,
} from 'recharts'
import { REFERENCE_AREAS, getRatingColor } from '../utils/cfColors'

function formatTickDate(ms) {
  const d = new Date(ms)
  return d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const dateStr = new Date(d.timestampMs).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs shadow-2xl max-w-64">
      <p className="text-gray-300 font-semibold mb-0.5">{dateStr}</p>
      <p className="text-gray-500 truncate mb-2">{d.contestName}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-yellow-400 inline-block" />
            <span className="text-gray-400">Rating</span>
          </div>
          <span className="font-bold tabular-nums" style={{ color: getRatingColor(d.newRating) }}>
            {d.newRating}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 border-t border-dashed border-gray-400 inline-block" />
            <span className="text-gray-400">Performance</span>
          </div>
          <span
            className="font-bold tabular-nums"
            style={{ color: getRatingColor(d.performance) }}
          >
            {d.performance}
          </span>
        </div>
      </div>
      <p className="text-gray-600 mt-2 border-t border-gray-700 pt-1.5">Rank #{d.rank}</p>
    </div>
  )
}

function CheckboxToggle({ checked, onChange, color, dashed, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none group">
      <div
        className="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors"
        style={{ borderColor: color, backgroundColor: checked ? color : 'transparent' }}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 fill-gray-900">
            <path d="M1 5l3 3 5-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium" style={{ color }}>
          {label}
        </span>
        {dashed ? (
          <svg width="20" height="4" className="shrink-0">
            <line x1="0" y1="2" x2="20" y2="2" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
        ) : (
          <svg width="20" height="4" className="shrink-0">
            <line x1="0" y1="2" x2="20" y2="2" stroke={color} strokeWidth="2" />
          </svg>
        )}
      </div>
    </label>
  )
}

export default function RatingChart({ data }) {
  const [showRating, setShowRating] = useState(true)
  const [showPerformance, setShowPerformance] = useState(true)

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
        No contest history yet.
      </div>
    )
  }

  // Compute Y domain across all visible series
  const allValues = [
    ...(showRating ? data.map((d) => d.newRating) : []),
    ...(showPerformance ? data.map((d) => d.performance) : []),
  ]
  const minY = allValues.length ? Math.max(0, Math.min(...allValues) - 100) : 0
  const maxY = allValues.length ? Math.max(...allValues) + 100 : 4000

  return (
    <div>
      {/* Toggles */}
      <div className="flex items-center gap-5 mb-5">
        <CheckboxToggle
          checked={showRating}
          onChange={setShowRating}
          color="#FFCC00"
          dashed={false}
          label="Rating"
        />
        <CheckboxToggle
          checked={showPerformance}
          onChange={setShowPerformance}
          color="#D1D5DB"
          dashed
          label="Performance"
        />
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />

          {REFERENCE_AREAS.map((area) => (
            <ReferenceArea
              key={area.y1}
              y1={area.y1}
              y2={area.y2}
              fill={area.fill}
              fillOpacity={0.10}
              strokeOpacity={0}
              ifOverflow="hidden"
            />
          ))}

          {/* Continuous time-proportional X axis */}
          <XAxis
            dataKey="timestampMs"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatTickDate}
            tick={{ fill: '#6B7280', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: '#1f2937' }}
            angle={-35}
            textAnchor="end"
            height={50}
          />
          <YAxis
            domain={[minY, maxY]}
            tick={{ fill: '#6B7280', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />

          {showRating && (
            <Line
              type="monotone"
              dataKey="newRating"
              stroke="#FFCC00"
              strokeWidth={2}
              dot={{ fill: '#FFCC00', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#FFCC00', strokeWidth: 0 }}
              connectNulls
              name="Rating"
            />
          )}

          {showPerformance && (
            <Line
              type="monotone"
              dataKey="performance"
              stroke="#D1D5DB"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, fill: '#D1D5DB', strokeWidth: 0 }}
              connectNulls
              name="Performance"
            />
          )}

          <Brush
            dataKey="timestampMs"
            height={28}
            stroke="#FFCC00"
            fill="#111827"
            tickFormatter={formatTickDate}
            travellerWidth={8}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
