import { Code2 } from 'lucide-react'

export default function Practice() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Practice Problems</h1>
        <p className="text-sm text-gray-500">Curated DSA and aptitude problems for placement readiness.</p>
      </div>

      <div className="border border-dashed border-gray-200 rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
          <Code2 className="w-6 h-6 text-primary-500" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-700">Problems coming soon</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            A structured problem set tailored to placement rounds will appear here.
          </p>
        </div>
      </div>
    </div>
  )
}
