import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CheckSquare, BookOpen, Calendar, HelpCircle,
  Tag, ArrowLeft, Copy, Download, Check,
  ThumbsUp, AlertCircle, Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { useHistory } from '../hooks/useHistory'

/* ── category badge colors ───────────────────────────────── */
const CATEGORY_COLORS = {
  'Core CS':      { base: 'bg-blue-50 text-blue-700 border border-blue-100',   know: 'bg-blue-500 text-white border-blue-500' },
  'Languages':    { base: 'bg-purple-50 text-purple-700 border border-purple-100', know: 'bg-purple-500 text-white border-purple-500' },
  'Web':          { base: 'bg-primary-50 text-primary-700 border border-primary-100', know: 'bg-primary-500 text-white border-primary-500' },
  'Data':         { base: 'bg-amber-50 text-amber-700 border border-amber-100',  know: 'bg-amber-500 text-white border-amber-500' },
  'Cloud/DevOps': { base: 'bg-teal-50 text-teal-700 border border-teal-100',    know: 'bg-teal-500 text-white border-teal-500' },
  'Testing':      { base: 'bg-pink-50 text-pink-700 border border-pink-100',    know: 'bg-pink-500 text-white border-pink-500' },
  'General':      { base: 'bg-gray-100 text-gray-600 border border-gray-200',   know: 'bg-gray-500 text-white border-gray-500' },
}

/* ── SVG Readiness Gauge ─────────────────────────────────── */
function ReadinessGauge({ score }) {
  const radius = 44
  const stroke = 7
  const circ   = 2 * Math.PI * radius
  const offset = circ - (Math.max(0, Math.min(100, score)) / 100) * circ
  const color  = score >= 70 ? '#16a34a' : score >= 50 ? 'hsl(245,58%,51%)' : '#dc2626'

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle
          cx="55" cy="55" r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 55 55)"
          style={{ transition: 'stroke-dashoffset 0.4s ease-in-out' }}
        />
        <text x="55" y="51" textAnchor="middle" dominantBaseline="middle"
          fontSize="22" fontWeight="700" fill="#111827" fontFamily="Inter,sans-serif">{score}</text>
        <text x="55" y="67" textAnchor="middle" fontSize="10"
          fill="#9ca3af" fontFamily="Inter,sans-serif">/ 100</text>
      </svg>
      <p className="text-xs font-medium text-gray-500">Live Score</p>
    </div>
  )
}

/* ── Copy button with feedback ───────────────────────────── */
function CopyButton({ label, onCopy }) {
  const [copied, setCopied] = useState(false)
  const handleClick = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

/* ── Export helpers ──────────────────────────────────────── */
function planToText(plan) {
  return plan.map(b => `${b.days} — ${b.focus}\n${b.tasks.map(t => `  • ${t}`).join('\n')}`).join('\n\n')
}
function checklistToText(checklist) {
  return checklist.map(r => `${r.round}\n${r.items.map(i => `  □ ${i}`).join('\n')}`).join('\n\n')
}
function questionsToText(questions) {
  return questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
}
function downloadTXT(analysis, liveScore, confidenceMap) {
  const skills = Object.entries(analysis.extractedSkills)
    .map(([cat, list]) => `${cat}: ${list.join(', ')}`)
    .join('\n')

  const confLines = Object.entries(confidenceMap)
    .map(([sk, v]) => `  ${v === 'know' ? '✓' : '○'} ${sk} — ${v === 'know' ? 'I know this' : 'Need practice'}`)
    .join('\n')

  const text = [
    `KodNest JD Analysis Report`,
    `Company: ${analysis.company || '—'}`,
    `Role: ${analysis.role || '—'}`,
    `Date: ${new Date(analysis.createdAt).toLocaleString()}`,
    `Readiness Score: ${liveScore}/100`,
    `\n── SKILLS DETECTED ──\n${skills}`,
    `\n── SKILL CONFIDENCE ──\n${confLines}`,
    `\n── ROUND-WISE CHECKLIST ──\n${checklistToText(analysis.checklist)}`,
    `\n── 7-DAY STUDY PLAN ──\n${planToText(analysis.plan)}`,
    `\n── INTERVIEW QUESTIONS ──\n${questionsToText(analysis.questions)}`,
  ].join('\n')

  const blob = new Blob([text], { type: 'text/plain' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${(analysis.company || 'kodnest').toLowerCase().replace(/\s+/g, '-')}-prep.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/* ── Main Results Component ──────────────────────────────── */
export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { getEntry, updateEntry } = useHistory()

  const [analysis,      setAnalysis]      = useState(null)
  const [checked,       setChecked]       = useState({})        // checklist ticks
  const [confidenceMap, setConfidenceMap] = useState({})        // skill → 'know' | 'practice'
  const [liveScore,     setLiveScore]     = useState(0)

  /* Load analysis on mount */
  useEffect(() => {
    let result = null
    const id = location.state?.analysisId
    if (id) result = getEntry(id)
    if (!result) {
      try { result = JSON.parse(localStorage.getItem('kn_latest_analysis')) } catch { /**/ }
    }
    if (!result) return

    setAnalysis(result)
    setLiveScore(result.readinessScore)

    // Init confidence map: use saved map or default all to 'practice'
    const allSkills = Object.values(result.extractedSkills).flat()
    const saved     = result.skillConfidenceMap ?? {}
    const initMap   = {}
    allSkills.forEach(s => { initMap[s] = saved[s] ?? 'practice' })
    setConfidenceMap(initMap)
  }, [location.state, getEntry])

  /* Recompute live score whenever confidenceMap changes */
  useEffect(() => {
    if (!analysis) return
    const knowCount     = Object.values(confidenceMap).filter(v => v === 'know').length
    const practiceCount = Object.values(confidenceMap).filter(v => v === 'practice').length
    const newScore      = Math.max(0, Math.min(100,
      analysis.readinessScore + knowCount * 2 - practiceCount * 2
    ))
    setLiveScore(newScore)
  }, [confidenceMap, analysis])

  /* Persist confidence changes to localStorage */
  const persistConfidence = useCallback((newMap, newScore) => {
    if (!analysis) return

    // Update latest analysis blob
    const updated = { ...analysis, skillConfidenceMap: newMap, liveScore: newScore }
    localStorage.setItem('kn_latest_analysis', JSON.stringify(updated))

    // Update history entry
    updateEntry(analysis.id, { skillConfidenceMap: newMap, liveScore: newScore })
  }, [analysis, updateEntry])

  const toggleSkill = (skill) => {
    setConfidenceMap(prev => {
      const next = { ...prev, [skill]: prev[skill] === 'know' ? 'practice' : 'know' }
      // Score computed in effect, but also persist with current liveScore estimate
      const knowCount     = Object.values(next).filter(v => v === 'know').length
      const practiceCount = Object.values(next).filter(v => v === 'practice').length
      const newScore      = Math.max(0, Math.min(100,
        analysis.readinessScore + knowCount * 2 - practiceCount * 2
      ))
      persistConfidence(next, newScore)
      return next
    })
  }

  const toggleCheck = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }))

  /* ── Empty state ─── */
  if (!analysis) {
    return (
      <div className="max-w-xl flex flex-col items-center text-center gap-4 py-16">
        <HelpCircle className="w-10 h-10 text-gray-300" />
        <p className="text-base font-semibold text-gray-700">No analysis yet</p>
        <p className="text-sm text-gray-400">Go to the Analyzer, paste a JD, and click Analyze.</p>
        <button
          onClick={() => navigate('/dashboard/analyzer')}
          className="mt-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Go to Analyzer
        </button>
      </div>
    )
  }

  const { company, role, createdAt, extractedSkills, checklist, plan, questions } = analysis

  // Top 3 weak skills (practice-marked)
  const weakSkills = Object.entries(confidenceMap)
    .filter(([, v]) => v === 'practice')
    .slice(0, 3)
    .map(([sk]) => sk)

  return (
    <div className="max-w-5xl">

      {/* ── Page header ─── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {company || 'Analysis'}{role ? ` — ${role}` : ''}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Analyzed {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        <ReadinessGauge score={liveScore} />
      </div>

      {/* ── Export toolbar ─── */}
      <div className="flex flex-wrap gap-2 mb-5 p-4 bg-white border border-gray-200 rounded-xl">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider self-center mr-1">Export</span>
        <CopyButton label="Copy 7-day plan"     onCopy={() => navigator.clipboard.writeText(planToText(plan))} />
        <CopyButton label="Copy checklist"       onCopy={() => navigator.clipboard.writeText(checklistToText(checklist))} />
        <CopyButton label="Copy questions"       onCopy={() => navigator.clipboard.writeText(questionsToText(questions))} />
        <button
          onClick={() => downloadTXT(analysis, liveScore, confidenceMap)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download .txt
        </button>
      </div>

      <div className="flex flex-col gap-5">

        {/* 1. Extracted Skills — with confidence toggles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-500" />
                Key Skills Extracted
              </CardTitle>
              <p className="text-xs text-gray-400">Click a skill to toggle confidence</p>
            </div>
          </CardHeader>
          <CardContent>
            {Object.entries(extractedSkills).map(([cat, skills]) => {
              const colors = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.General
              return (
                <div key={cat} className="mb-4 last:mb-0">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{cat}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => {
                      const isKnow = confidenceMap[skill] === 'know'
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          title={isKnow ? 'Click to mark "Need practice"' : 'Click to mark "I know this"'}
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-150 select-none ${
                            isKnow ? colors.know : colors.base
                          }`}
                        >
                          {isKnow
                            ? <ThumbsUp className="w-3 h-3" />
                            : <AlertCircle className="w-3 h-3 opacity-60" />
                          }
                          {skill}
                          <span className="opacity-70 font-normal">
                            {isKnow ? ' · know' : ' · practice'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* Confidence summary bar */}
            <div className="mt-4 flex items-center gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3">
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <ThumbsUp className="w-3.5 h-3.5" />
                {Object.values(confidenceMap).filter(v => v === 'know').length} known
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {Object.values(confidenceMap).filter(v => v === 'practice').length} need practice
              </span>
              <span className="ml-auto text-gray-400">
                Score adjusts ±2 per skill
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Round-wise checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-primary-500" />
              Round-wise Preparation Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {checklist.map((round, ri) => (
              <div key={ri}>
                <p className="text-sm font-semibold text-gray-800 mb-2">{round.round}</p>
                <ul className="flex flex-col gap-1.5">
                  {round.items.map((item, ii) => {
                    const key = `R${ri}-${ii}`
                    return (
                      <li
                        key={key}
                        className="flex items-start gap-2.5 cursor-pointer group"
                        onClick={() => toggleCheck(key)}
                      >
                        <span className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${checked[key] ? 'bg-primary-500 border-primary-500' : 'border-gray-300 group-hover:border-primary-300'}`}>
                          {checked[key] && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="2">
                              <path d="M1 5l3 3 5-5" />
                            </svg>
                          )}
                        </span>
                        <span className={`text-sm leading-snug transition-colors ${checked[key] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {item}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 3. 7-day plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              7-Day Study Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {plan.map((block, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-20 text-right">
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-md whitespace-nowrap">
                    {block.days}
                  </span>
                </div>
                <div className="flex-1 border-l border-gray-100 pl-4 pb-4 last:pb-0">
                  <p className="text-sm font-semibold text-gray-800 mb-1.5">{block.focus}</p>
                  <ul className="flex flex-col gap-1">
                    {block.tasks.map((task, ti) => (
                      <li key={ti} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 4. Interview questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary-500" />
              10 Likely Interview Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-3">
              {questions.map((q, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-snug pt-0.5">{q}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* 5. Quick Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-500" />
              Quick Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: 'LeetCode',        url: 'https://leetcode.com' },
                { label: 'HackerRank',      url: 'https://hackerrank.com' },
                { label: 'NeetCode 150',    url: 'https://neetcode.io/practice' },
                { label: 'System Design',   url: 'https://github.com/donnemartin/system-design-primer' },
                { label: 'InterviewBit',    url: 'https://interviewbit.com' },
                { label: 'CS Cheat Sheets', url: 'https://github.com/jwasham/coding-interview-university' },
              ].map(({ label, url }) => (
                <a key={label} href={url} target="_blank" rel="noreferrer"
                  className="text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-lg text-center transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 6. Action Next box */}
        <Card className="border-primary-100 bg-primary-50/40">
          <CardContent className="py-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-semibold text-gray-900">Action Next</span>
            </div>

            {weakSkills.length > 0 ? (
              <>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Top skills to strengthen
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {weakSkills.map(sk => (
                      <span key={sk} className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  You have <strong>{Object.values(confidenceMap).filter(v => v === 'practice').length} skills</strong> to strengthen.
                  {' '}Start Day 1 plan now — focus on Core CS and basics first.
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-700">
                You've marked all skills as known. Great confidence!
                Run a mock interview to validate your readiness.
              </p>
            )}

            <button
              onClick={() => navigate('/dashboard/analyzer')}
              className="self-start text-xs font-semibold text-primary-600 bg-white border border-primary-200 hover:border-primary-400 px-4 py-2 rounded-lg transition-colors"
            >
              Analyze another JD →
            </button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
