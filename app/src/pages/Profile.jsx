import { UserCircle } from 'lucide-react'

export default function Profile() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile</h1>
        <p className="text-sm text-gray-500">Your account details and placement preferences.</p>
      </div>

      {/* Avatar + name placeholder */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
          <UserCircle className="w-9 h-9 text-primary-500" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">Student</p>
          <p className="text-sm text-gray-400">student@kodnest.com</p>
        </div>
      </div>

      <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
        <p className="text-sm font-medium text-gray-400">Profile settings coming soon</p>
        <p className="text-sm text-gray-400 mt-1">
          Edit your name, target companies, and notification preferences here.
        </p>
      </div>
    </div>
  )
}
