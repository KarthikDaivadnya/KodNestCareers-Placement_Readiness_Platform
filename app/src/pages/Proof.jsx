import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2, Circle, Copy, Check,
  Link2, Github, Globe, Rocket,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'

/* ── Constants ──────────────────────────────────────────────── */
const SUBMISSION_KEY   = 'prp_final_submission'
const TEST_KEY         = 'kn_test_checklist'
const HISTORY_KEY      = 'kn_analysis_history'
const TEST_TOTAL       = 10

/* ── 8 Step definitions ─────────────────────────────────────── */
const STEPS = [
  {
    id: 's01',
    label: 'Project Setup',
    description: 'Vite + React + Tailwind app scaffolded and running.',
    check: () => true,   // always complete — app is serving this page
  },
  {
    id: 's02',
    label: 'JD Analyzer',
    description: 'User can paste a JD, click Analyze, and receive a result.',
    check: () => {
      try {
        const h = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
        return Array.isArray(h) && h.length > 0
      } catch { return false }
    },
  },
  {
    id: 's03',
    label: 'Skill Extraction Engine',
    description: 'Skills are grouped into categories (Core CS, Web, Data, etc.).',
    check: () => {
      try {
        const h = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
        if (!Array.isArray(h) || h.length === 0) return false
        const latest = h[0]
        const cats   = Object.keys(latest?.extractedSkills ?? {})
        return cats.length > 0 && !cats.every(c => c === 'General')
      } catch { return false }
    },
  },
  {
    id: 's04',
    label: 'Round Mapping Engine',
    description: 'Company intel + dynamic interview round track generated.',
    check: () => {
      try {
        const h = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
        return Array.isArray(h) && h.some(e => e?.companyIntel?.rounds?.length > 0)
      } catch { return false }
    },
  },
  {
    id: 's05',
    label: '7-Day Study Plan',
    description: 'Adaptive prep plan generated from extracted skills.',
    check: () => {
      try {
        const h = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
        return Array.isArray(h) && h.some(e => Array.isArray(e?.plan) && e.plan.length > 0)
      } catch { return false }
    },
  },
  {
    id: 's06',
    label: 'Interactive Score System',
    description: 'Skills can be toggled; score updates live and persists.',
    check: () => {
      try {
        const h = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
        return Array.isArray(h) && h.some(e => {
          const map = e?.skillConfidenceMap ?? {}
          return Object.values(map).some(v => v === 'know')
        })
      } catch { return false }
    },
  },
  {
    id: 's07',
    label: 'Test Checklist Verified',
    description: 'All 10 pre-ship tests manually verified and passed.',
    check: () => {
      try {
        const raw = localStorage.getItem(TEST_KEY)
        return raw ? JSON.parse(raw).length >= TEST_TOTAL : false
      } catch { return false }
    },
  },
  {
    id: 's08',
    label: 'Proof Links Provided',
    description: 'Lovable project, GitHub repo, and deployed URL all submitted.',
    check: (links) => !!(links?.lovable && links?.github && links?.deployed),
  },
]

/* ── Helpers ─────────────────────────────────────────────────── */
function loadLinks() {
  try {
    const raw = localStorage.getItem(SUBMISSION_KEY)
    return raw ? JSON.parse(raw) : { lovable: '', github: '', deployed: '' }
  } catch {
    return { lovable: '', github: '', deployed: '' }
  }
}

function isValidUrl(str) {
  if (!str || str.trim() === '') return null   // empty → no error yet
  try {
    const u = new URL(str.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch { return false }
}

function buildSubmissionText(links) {
  return [
    '------------------------------------------',
    'Placement Readiness Platform — Final Submission',
    '',
    `Lovable Project:    ${links.lovable || '(not provided)'}`,
    `GitHub Repository:  ${links.github  || '(not provided)'}`,
    `Live Deployment:    ${links.deployed || '(not provided)'}`,
    '',
    'Core Capabilities:',
    '- JD skill extraction (deterministic)',
    '- Round mapping engine',
    '- 7-day prep plan',
    '- Interactive readiness scoring',
    '- History persistence',
    '------------------------------------------',
  ].join('\n')
}

/* ── Url Input ───────────────────────────────────────────────── */
function UrlInput({ label, icon: Icon, placeholder, value, onChange }) {
  const validity = isValidUrl(value)
  const showError = validity === false   // null = empty (no error shown)

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      <input
        type="url"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 transition-all
          ${showError
            ? 'border-red-300 focus:ring-red-200 focus:border-red-400 bg-red-50/30'
            : validity === true
              ? 'border-green-300 focus:ring-green-100 focus:border-green-400 bg-green-50/20'
              : 'border-gray-200 focus:ring-primary-200 focus:border-primary-400'
          }`}
      />
      {showError && (
        <p className="text-xs text-red-600">
          Enter a valid URL starting with https://
        </p>
      )}
    </div>
  )
}

/* ── Copy Button ─────────────────────────────────────────────── */
function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

/* ── Main Component ──────────────────────────────────────────── */
export default function Proof() {
  const navigate = useNavigate()
  const [links, setLinks] = useState(loadLinks)

  // Persist links on every change
  const setLink = (field) => (value) => {
    const next = { ...links, [field]: value }
    localStorage.setItem(SUBMISSION_KEY, JSON.stringify(next))
    setLinks(next)
  }

  // Evaluate step statuses — recomputed on every render (links change triggers re-render)
  const stepStatuses = useMemo(() =>
    STEPS.map(s => ({ ...s, completed: s.check(links) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [links.lovable, links.github, links.deployed]
  )

  const completedCount = stepStatuses.filter(s => s.completed).length
  const allStepsComplete = completedCount === STEPS.length

  // Shipped = all 8 steps + all 10 tests + 3 links
  const testsAllPassed = (() => {
    try {
      const raw = localStorage.getItem(TEST_KEY)
      return raw ? JSON.parse(raw).length >= TEST_TOTAL : false
    } catch { return false }
  })()

  const allLinksValid =
    isValidUrl(links.lovable) === true &&
    isValidUrl(links.github) === true &&
    isValidUrl(links.deployed) === true

  const isShipped = allStepsComplete && testsAllPassed && allLinksValid

  const submissionText = buildSubmissionText(links)

  return (
    <div className="max-w-3xl">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-0.5">Proof &amp; Submission</h1>
        <p className="text-sm text-gray-500">
          Complete all steps, verify tests, and submit your proof links to ship.
        </p>
      </div>

      {/* ── Status badge ── */}
      <div className={`mb-5 px-5 py-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
        isShipped ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
              isShipped ? 'bg-green-500 text-white' : 'bg-amber-400 text-white'
            }`}>
              {isShipped ? 'Shipped' : 'In Progress'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isShipped
              ? 'All conditions met. Project is verified and shipped.'
              : `${completedCount}/8 steps · ${testsAllPassed ? '10/10' : '< 10/10'} tests · ${allLinksValid ? 'All links' : 'Links pending'}`
            }
          </p>
        </div>
        {!isShipped && (
          <div className="text-xs text-amber-700 flex flex-col gap-0.5">
            {!allStepsComplete && <span>✗ {8 - completedCount} step{8 - completedCount > 1 ? 's' : ''} incomplete</span>}
            {!testsAllPassed && <span>✗ Test checklist not fully passed</span>}
            {!allLinksValid  && <span>✗ Proof links incomplete or invalid</span>}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">

        {/* ── A: Step Completion Overview ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                Step Completion Overview
              </CardTitle>
              <span className="text-xs font-semibold text-gray-400">
                {completedCount} / {STEPS.length} complete
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-0 divide-y divide-gray-50">
            {stepStatuses.map((step, i) => (
              <div key={step.id} className="flex items-start gap-3 py-3">
                {/* Icon */}
                {step.completed
                  ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  : <Circle      className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                }
                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-300 w-5 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-sm font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 ml-7 leading-snug">
                    {step.description}
                  </p>
                </div>
                {/* Status pill */}
                <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                  step.completed
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── B: Artifact Inputs ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary-500" />
              Proof Links
              <span className="text-xs font-normal text-gray-400 ml-1">Required for Ship status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <UrlInput
              label="Lovable Project Link"
              icon={Globe}
              placeholder="https://lovable.app/projects/..."
              value={links.lovable}
              onChange={setLink('lovable')}
            />
            <UrlInput
              label="GitHub Repository Link"
              icon={Github}
              placeholder="https://github.com/username/repo"
              value={links.github}
              onChange={setLink('github')}
            />
            <UrlInput
              label="Deployed URL"
              icon={Rocket}
              placeholder="https://your-app.vercel.app"
              value={links.deployed}
              onChange={setLink('deployed')}
            />

            {/* Validation summary */}
            {allLinksValid && (
              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                All 3 proof links are valid.
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── C: Export ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="w-4 h-4 text-primary-500" />
              Final Submission Export
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <pre className="text-xs font-mono text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-4 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {submissionText}
            </pre>
            <div className="flex gap-3 flex-wrap">
              <CopyButton text={submissionText} label="Copy Final Submission" />
            </div>
          </CardContent>
        </Card>

        {/* ── Shipped completion message ── */}
        {isShipped && (
          <div className="px-6 py-8 bg-gray-900 rounded-2xl text-center flex flex-col gap-4">
            <div className="inline-flex items-center justify-center mx-auto w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30">
              <Rocket className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-white text-lg font-semibold leading-snug">
                You built a real product.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                Not a tutorial. Not a clone.<br />
                A structured tool that solves a real problem.
              </p>
              <p className="text-gray-300 text-sm font-medium mt-1">
                This is your proof of work.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/ship')}
              className="mx-auto inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              <Rocket className="w-4 h-4" />
              View Ship Page
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
