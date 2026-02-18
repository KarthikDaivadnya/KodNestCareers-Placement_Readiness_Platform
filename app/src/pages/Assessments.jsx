import { ClipboardList } from 'lucide-react'

export default function Assessments() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Assessments</h1>
        <p className="text-sm text-gray-500">Timed tests that simulate company-style placement rounds.</p>
      </div>

      <div className="border border-dashed border-gray-200 rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
          <ClipboardList className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-700">Assessments coming soon</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            Mock aptitude and coding assessments will be available here.
          </p>
        </div>
      </div>
    </div>
  )
}
