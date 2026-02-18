import { useState, useCallback } from 'react'

const STORAGE_KEY = 'kn_analysis_history'

function loadHistory() {
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
    setHistory((prev) => {
      const updated = [entry, ...prev]
      saveHistory(updated)
      return updated
    })
  }, [])

  /** Merge partial changes into a history entry by id */
  const updateEntry = useCallback((id, changes) => {
    setHistory((prev) => {
      const updated = prev.map((e) =>
        e.id === id ? { ...e, ...changes } : e
      )
      saveHistory(updated)
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const getEntry = useCallback((id) => {
    return loadHistory().find((e) => e.id === id) ?? null
  }, [])

  return { history, addEntry, updateEntry, clearHistory, getEntry }
}
