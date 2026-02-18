import { BarChart3, Code2, ClipboardList, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Problems Solved', value: '0', icon: Code2, color: 'text-primary-500 bg-primary-50' },
  { label: 'Mock Interviews', value: '0', icon: BarChart3, color: 'text-purple-500 bg-purple-50' },
  { label: 'Assessments Done', value: '0', icon: ClipboardList, color: 'text-indigo-500 bg-indigo-50' },
  { label: 'Readiness Score', value: '—', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
]

export default function Dashboard() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Track your placement preparation at a glance.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="mt-8 border border-dashed border-gray-200 rounded-xl p-12 text-center">
        <p className="text-sm font-medium text-gray-400">Nothing here yet.</p>
        <p className="text-sm text-gray-400 mt-1">Start by solving a practice problem or taking a mock interview.</p>
      </div>
    </div>
  )
}
