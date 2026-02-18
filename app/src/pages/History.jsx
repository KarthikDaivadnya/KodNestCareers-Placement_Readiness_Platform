import { useNavigate } from 'react-router-dom'
import { Clock, Trash2, ChevronRight, BarChart2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { useHistory, loadHistory } from '../hooks/useHistory'

function scoreColor(score) {
  if (score >= 70) return 'text-green-600 bg-green-50'
  if (score >= 50) return 'text-primary-600 bg-primary-50'
  return 'text-red-600 bg-red-50'
}

export default function History() {
  const navigate = useNavigate()
  const { history, clearHistory } = useHistory()

  const openResult = (entry) => {
    // Always read the LATEST version from localStorage (includes any
    // skill-confidence toggles saved after the initial analysis).
    const fresh = loadHistory().find((e) => e.id === entry.id) ?? entry
    localStorage.setItem('kn_latest_analysis', JSON.stringify(fresh))
    navigate('/dashboard/results', { state: { analysisId: entry.id } })
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-0.5">Analysis History</h1>
          <p className="text-sm text-gray-500">All JDs you've analyzed. Persists across refreshes.</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => { if (window.confirm('Clear all history?')) clearHistory() }}
            className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center text-center gap-3 py-14">
            <Clock className="w-9 h-9 text-gray-300" />
            <p className="text-base font-semibold text-gray-700">No history yet</p>
            <p className="text-sm text-gray-400">Analyze a job description to see it appear here.</p>
            <button
              onClick={() => navigate('/dashboard/analyzer')}
              className="mt-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Go to Analyzer
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((entry) => (
            <button
              key={entry.id}
              onClick={() => openResult(entry)}
              className="w-full text-left group"
            >
              <Card className="hover:border-primary-200 transition-colors duration-150">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    {/* Score badge — show liveScore if toggles were made, else base score */}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${scoreColor(entry.liveScore ?? entry.readinessScore)}`}>
                      {entry.liveScore ?? entry.readinessScore}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {entry.company || 'Unknown Company'}
                        {entry.role ? ` — ${entry.role}` : ''}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                      {/* Skill categories */}
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {Object.keys(entry.extractedSkills).slice(0, 4).map((cat) => (
                          <span key={cat} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {cat}
                          </span>
                        ))}
                        {Object.keys(entry.extractedSkills).length > 4 && (
                          <span className="text-xs text-gray-400">
                            +{Object.keys(entry.extractedSkills).length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors shrink-0" />
                </CardContent>
              </Card>
            </button>
          ))}

          {/* Stats summary */}
          <Card className="mt-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary-500" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center py-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">{history.length}</p>
                <p className="text-xs text-gray-400">Total Analyses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(history.reduce((a, e) => a + (e.liveScore ?? e.readinessScore), 0) / history.length)}
                </p>
                <p className="text-xs text-gray-400">Avg Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.max(...history.map((e) => e.liveScore ?? e.readinessScore))}
                </p>
                <p className="text-xs text-gray-400">Best Score</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
