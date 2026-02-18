import { useState, useCallback } from 'react'

const STORAGE_KEY = 'kn_analysis_history'

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function useHistory() {
  const [history, setHistory] = useState(loadHistory)

  const addEntry = useCallback((entry) => {
    // Read fresh from localStorage — avoids stale React state
    const current = loadHistory()
    const updated = [entry, ...current]
    saveHistory(updated)
    setHistory(updated)
  }, [])

  /**
   * Merge partial changes into an existing history entry.
   * Always reads fresh from localStorage so concurrent hook
   * instances don't clobber each other.
   */
  const updateEntry = useCallback((id, changes) => {
    const current = loadHistory()           // always fresh
    const updated = current.map((e) =>
      e.id === id ? { ...e, ...changes } : e
    )
    saveHistory(updated)                    // persist immediately
    setHistory(updated)                     // sync React state
  }, [])

  const clearHistory = useCallback(() => {
    saveHistory([])
    setHistory([])
  }, [])

  /** Always returns fresh data straight from localStorage */
  const getEntry = useCallback((id) => {
    return loadHistory().find((e) => e.id === id) ?? null
  }, [])

  return { history, addEntry, updateEntry, clearHistory, getEntry }
}
