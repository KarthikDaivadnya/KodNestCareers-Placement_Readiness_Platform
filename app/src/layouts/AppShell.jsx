import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Code2,
  ClipboardList,
  BookOpen,
  UserCircle,
  Sparkles,
  FileSearch,
  Clock,
  CheckSquare,
  Rocket,
  BadgeCheck,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',             label: 'Dashboard',   icon: LayoutDashboard, end: true },
  { to: '/dashboard/practice',    label: 'Practice',    icon: Code2 },
  { to: '/dashboard/assessments', label: 'Assessments', icon: ClipboardList },
  { to: '/dashboard/resources',   label: 'Resources',   icon: BookOpen },
  { to: '/dashboard/profile',     label: 'Profile',     icon: UserCircle },
]

const analyzerItems = [
  { to: '/dashboard/analyzer', label: 'JD Analyzer', icon: Sparkles },
  { to: '/dashboard/results',  label: 'Results',     icon: FileSearch },
  { to: '/dashboard/history',  label: 'History',     icon: Clock },
]

const qualityItems = [
  { to: '/dashboard/test',  label: 'Test Checklist', icon: CheckSquare },
  { to: '/dashboard/proof', label: 'Proof',           icon: BadgeCheck },
  { to: '/dashboard/ship',  label: 'Ship',            icon: Rocket },
]

export default function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className="w-60 shrink-0 border-r border-gray-200 bg-white flex flex-col">

        {/* Brand */}
        <div className="h-14 px-5 flex items-center border-b border-gray-100">
          <span className="text-sm font-semibold tracking-widest uppercase text-primary-600">
            KodNest
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">

          {/* Core navigation */}
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}

          {/* Analyzer section divider */}
          <div className="mt-4 mb-1.5 px-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              JD Analysis
            </span>
          </div>

          {analyzerItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}

          {/* Quality / Ship section */}
          <div className="mt-4 mb-1.5 px-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Quality
            </span>
          </div>

          {qualityItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}

        </nav>

        {/* Bottom user hint */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary-600">K</span>
            </div>
            <span className="text-sm text-gray-600 font-medium">Student</span>
          </div>
        </div>

      </aside>

      {/* ── Right side ───────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Header */}
        <header className="h-14 px-6 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
          <span className="text-sm font-semibold text-gray-900">Placement Prep</span>
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-600">K</span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
