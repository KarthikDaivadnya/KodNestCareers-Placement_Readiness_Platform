import { useNavigate } from 'react-router-dom'
import { Code2, Video, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Code2,
    title: 'Practice Problems',
    description: 'Solve curated DSA and aptitude problems tailored for placements.',
  },
  {
    icon: Video,
    title: 'Mock Interviews',
    description: 'Simulate real interviews with timed rounds and instant feedback.',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'Visualise your readiness score and improvement over time.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── Navbar ───────────────────────────────────── */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-widest uppercase text-primary-600">
          KodNest Careers
        </span>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-150"
        >
          Sign in
        </button>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-36 flex-1">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary-500 mb-4">
          Placement Readiness Platform
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight max-w-2xl mb-6">
          Ace Your Placement
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-xl leading-relaxed mb-10">
          Practice, assess, and prepare for your dream job — all in one structured platform.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3.5 rounded-lg text-base transition-colors duration-150"
        >
          Get Started
        </button>
      </section>

      {/* ── Features Grid ────────────────────────────── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="border border-gray-200 rounded-xl p-6 flex flex-col gap-4 hover:border-primary-200 transition-colors duration-150"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-6 px-6 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} KodNest Careers. All rights reserved.
        </p>
      </footer>

    </div>
  )
}
