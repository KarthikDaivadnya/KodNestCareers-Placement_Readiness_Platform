import { BookOpen } from 'lucide-react'

export default function Resources() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Resources</h1>
        <p className="text-sm text-gray-500">Study materials, guides, and reference sheets for placements.</p>
      </div>

      <div className="border border-dashed border-gray-200 rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-700">Resources coming soon</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            Curated reading lists, cheat sheets, and interview guides will appear here.
          </p>
        </div>
      </div>
    </div>
  )
}
