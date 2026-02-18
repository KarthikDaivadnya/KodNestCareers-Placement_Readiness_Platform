import { useState, useCallback } from 'react'

const STORAGE_KEY = 'kn_analysis_history'

/** Minimum fields required for an entry to be considered valid */
function isValidEntry(entry) {
  return (
    entry !== null &&
    typeof entry === 'object' &&
    typeof entry.id === 'string' && entry.id.length > 0 &&
    typeof entry.createdAt === 'string' &&
    entry.extractedSkills !== null &&
    typeof entry.extractedSkills === 'object'
  )
}

/** Read raw array from localStorage. Returns { entries, corruptedCount }. */
function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { entries: [], corruptedCount: 0 }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return { entries: [], corruptedCount: 1 }

    const valid   = parsed.filter(isValidEntry)
    return { entries: valid, corruptedCount: parsed.length - valid.length }
  } catch {
    return { entries: [], corruptedCount: 1 }
  }
}

/** Public helper — returns clean entries array (used by History.jsx openResult) */
export function loadHistory() {
  return readFromStorage().entries
}

function saveHistory(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function useHistory() {
  const [history,        setHistory]        = useState(() => readFromStorage().entries)
  const [corruptedCount, setCorruptedCount] = useState(() => readFromStorage().corruptedCount)

  const addEntry = useCallback((entry) => {
    const current = loadHistory()
    const updated = [entry, ...current]
    saveHistory(updated)
    setHistory(updated)
  }, [])

  /**
   * Merge partial changes into an existing history entry.
   * Always reads fresh from localStorage — no stale-state risk.
   */
  const updateEntry = useCallback((id, changes) => {
    const current = loadHistory()
    const updated = current.map((e) =>
      e.id === id ? { ...e, ...changes } : e
    )
    saveHistory(updated)
    setHistory(updated)
  }, [])

  const clearHistory = useCallback(() => {
    saveHistory([])
    setHistory([])
    setCorruptedCount(0)
  }, [])

  /** Always returns fresh data straight from localStorage */
  const getEntry = useCallback((id) => {
    return loadHistory().find((e) => e.id === id) ?? null
  }, [])

  return { history, corruptedCount, addEntry, updateEntry, clearHistory, getEntry }
}
