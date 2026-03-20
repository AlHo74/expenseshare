import { useState, useEffect } from 'react'

const STORAGE_KEY = 'fs_auth'
const PASSWORD = import.meta.env.VITE_APP_PASSWORD

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') setUnlocked(true)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (input === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setInput('')
      setTimeout(() => setError(false), 2000)
    }
  }

  if (unlocked) return children

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm border border-slate-200 shadow-sm">
        <p className="text-3xl text-center mb-2">💸</p>
        <h1 className="text-xl font-bold text-slate-800 text-center mb-1">FamilyShare</h1>
        <p className="text-sm text-slate-400 text-center mb-6">Bitte Passwort eingeben</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Passwort"
            autoFocus
            className={`w-full px-4 py-3 rounded-xl border text-slate-800 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              error ? 'border-red-400 bg-red-50' : 'border-slate-300'
            }`}
          />
          {error && (
            <p className="text-sm text-red-500 text-center">Falsches Passwort</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Weiter
          </button>
        </form>
      </div>
    </div>
  )
}
