import { getRatingColor } from '../utils/cfColors'

export default function UnsolvedCemetery({ problems }) {
  if (!problems?.length) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-600 text-sm">
        No unsolved problems found — clean slate!
      </div>
    )
  }

  return (
    <div className="overflow-auto max-h-96 rounded-lg">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-gray-900 z-10">
          <tr className="border-b border-gray-800">
            <th className="text-left text-gray-500 font-medium text-xs pb-3 pr-4 pl-1 uppercase tracking-wide">
              Problem
            </th>
            <th className="text-left text-gray-500 font-medium text-xs pb-3 pr-4 uppercase tracking-wide w-20">
              Rating
            </th>
            <th className="text-left text-gray-500 font-medium text-xs pb-3 uppercase tracking-wide">
              Tags
            </th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p, i) => (
            <tr
              key={i}
              className="border-b border-gray-800/40 hover:bg-gray-800/30 transition-colors"
            >
              <td className="py-2.5 pr-4 pl-1">
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline underline-offset-2 transition-colors"
                >
                  {p.name}
                </a>
              </td>
              <td className="py-2.5 pr-4">
                <span
                  className="font-mono font-bold text-sm"
                  style={{ color: p.rating ? getRatingColor(p.rating) : '#4B5563' }}
                >
                  {p.rating ?? '—'}
                </span>
              </td>
              <td className="py-2.5">
                <div className="flex flex-wrap gap-1">
                  {p.tags.slice(0, 5).map((tag, ti) => (
                    <span
                      key={ti}
                      className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full border border-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {p.tags.length > 5 && (
                    <span className="text-gray-600 text-xs px-1 py-0.5">
                      +{p.tags.length - 5}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
