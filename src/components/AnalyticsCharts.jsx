import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'

const PIE_COLORS = [
  '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA',
  '#FB923C', '#38BDE8', '#4ADE80', '#F472B6', '#818CF8',
  '#FB7185', '#FCD34D', '#67E8F9', '#86EFAC', '#C4B5FD',
]

function BarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-gray-400">Rating {payload[0].payload.rating}</p>
      <p className="text-white font-bold text-sm mt-0.5">{payload[0].value} solved</p>
    </div>
  )
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="font-bold text-white">{payload[0].name}</p>
      <p className="text-gray-400 mt-0.5">{payload[0].value} problems</p>
    </div>
  )
}

function PieLegend({ payload }) {
  return (
    <ul className="flex flex-col gap-1 text-xs overflow-auto max-h-48 pl-1">
      {payload?.map((entry, i) => (
        <li key={i} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-400 truncate">{entry.value}</span>
        </li>
      ))}
    </ul>
  )
}

export default function AnalyticsCharts({ ratingData, tagData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Bar chart: problems by difficulty */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Problems by Difficulty Rating</h3>
        {ratingData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-600 text-sm">No data</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ratingData} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="rating"
                tick={{ fill: '#6B7280', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: '#1f2937' }}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={50}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {ratingData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Doughnut chart: tag distribution */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Top Problem Tags</h3>
        {tagData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-600 text-sm">No data</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={tagData}
                cx="40%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                dataKey="value"
                nameKey="name"
                paddingAngle={1}
              >
                {tagData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                content={<PieLegend />}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
