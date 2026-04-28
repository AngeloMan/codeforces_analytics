export default function LoadingSpinner({ message = 'Fetching data from Codeforces...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="w-12 h-12 border-4 border-gray-700 border-t-yellow-400 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  )
}
