import { useState, useEffect, useCallback } from 'react'

const POLL_MS = 20_000

export function useFichas() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      const base = import.meta.env.VITE_API_URL ?? ''
      const res = await fetch(`${base}/fichas`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail || `Error ${res.status}`)
      }
      const json = await res.json()
      setData(json.data ?? [])
      setError(json.error ?? null)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, POLL_MS)
    return () => clearInterval(id)
  }, [fetchData])

  return { data, loading, error, lastUpdated, refetch: fetchData }
}
