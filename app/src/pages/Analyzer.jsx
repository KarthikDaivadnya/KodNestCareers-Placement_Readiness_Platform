import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { analyzeJD } from '../lib/skillExtractor'
import { useHistory } from '../hooks/useHistory'

export default function Analyzer() {
  const navigate = useNavigate()
  const { addEntry } = useHistory()

  const [company,   setCompany]   = useState('')
  const [role,      setRole]      = useState('')
  const [jdText,    setJdText]    = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [jdWarning, setJdWarning] = useState('')

  const handleJdChange = (e) => {
    const val = e.target.value
    setJdText(val)
    setError('')
    if (val.trim().length > 0 && val.trim().length < 200) {
      setJdWarning('This JD is too short to analyze deeply. Paste the full job description for better output.')
    } else {
      setJdWarning('')
    }
  }

  const handleAnalyze = () => {
    if (!jdText.trim()) {
      setError('Paste a job description to analyze.')
      return
    }
    setJdWarning('')
    setError('')
    setLoading(true)

    // Small timeout to show loading state (analysis is synchronous)
    setTimeout(() => {
      const result = analyzeJD({ company, role, jdText })
      addEntry(result)
      // Store latest for Results page
      localStorage.setItem('kn_latest_analysis', JSON.stringify(result))
      setLoading(false)
      navigate('/dashboard/results', { state: { analysisId: result.id } })
    }, 600)
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-0.5">JD Analyzer</h1>
        <p className="text-sm text-gray-500">
          Paste a job description — we extract skills, build a study plan, and generate likely interview questions. Offline, no API.
        </p>
      </div>

      <div className="flex flex-col gap-5">

        {/* Company + Role row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Company Name
            </label>
            <input
              type="text"
              placeholder="e.g. Google, Infosys, Flipkart"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Role / Position
            </label>
            <input
              type="text"
              placeholder="e.g. SDE-1, Backend Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
            />
          </div>
        </div>

        {/* JD text area */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <textarea
              rows={14}
              placeholder={`Paste the full job description here...\n\nExample:\n"We are looking for a Software Development Engineer with strong DSA skills, experience in Java or Python, familiarity with SQL and MongoDB, and knowledge of REST APIs and Docker."`}
              value={jdText}
              onChange={handleJdChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all resize-y leading-relaxed"
            />

            {/* JD too short — calm amber warning */}
            {jdWarning && (
              <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg">
                <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 6v4m0 2h.01M8 2a6 6 0 100 12A6 6 0 008 2z" />
                </svg>
                {jdWarning}
              </div>
            )}

            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs ${jdText.length > 800 ? 'text-green-600' : 'text-gray-400'}`}>
                {jdText.length} characters
                {jdText.length > 800 && ' — long JD detected (+10 score)'}
              </span>
              {error && (
                <span className="text-xs text-red-600 font-medium">{error}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors duration-150 self-start"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze JD
            </>
          )}
        </button>

      </div>
    </div>
  )
}
