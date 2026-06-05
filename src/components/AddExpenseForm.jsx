import { useState } from 'react'
import { createExpense } from '../api'

const CATEGORIES = ['Lebensmittel', 'Kind', 'Haushalt', 'Freizeit', 'Sonstiges']

export default function AddExpenseForm({ onClose, onSaved }) {
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    paid_by: 'alex',
    amount: '',
    category: 'Lebensmittel',
    description: '',
    date: today,
    split: '0.5',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!amount || amount <= 0) {
      setError('Bitte einen gültigen Betrag eingeben.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await createExpense({
        paid_by: form.paid_by,
        amount,
        category: form.category,
        description: form.description.trim(),
        date: form.date,
        split: parseFloat(form.split),
        is_settlement: false,
      })
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-bold text-slate-800 mb-4">Neuer Eintrag</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Payer */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Wer hat bezahlt?</label>
          <div className="grid grid-cols-2 gap-2">
            {['alex', 'karin'].map(person => (
              <button
                key={person}
                type="button"
                onClick={() => set('paid_by', person)}
                className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
                  form.paid_by === person
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {person === 'alex' ? '👨 Alex' : '👩 Karin'}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Betrag (€)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            value={form.amount}
            onChange={e => set('amount', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategorie</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => set('category', cat)}
                className={`py-2 px-1 rounded-xl text-xs font-medium border-2 transition-colors ${
                  form.category === cat
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {catEmoji(cat)} {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Split */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Aufteilung</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => set('split', '0.5')}
              className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
                form.split === '0.5'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              50/50 teilen
            </button>
            <button
              type="button"
              onClick={() => set('split', '1')}
              className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
                form.split === '1'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              Zahler alleine
            </button>
          </div>
          {form.split === '0.5' && form.amount && (
            <p className="text-xs text-slate-400 mt-1.5 text-center">
              Jeder zahlt {(parseFloat(form.amount || 0) / 2).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Beschreibung (optional)</label>
          <input
            type="text"
            placeholder="z.B. Wocheneinkauf Billa"
            value={form.description}
            onChange={e => set('description', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Datum</label>
          <input
            type="date"
            value={form.date}
            onChange={e => set('date', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Speichern…' : 'Speichern'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function catEmoji(cat) {
  const map = { Lebensmittel: '🛒', Kind: '👧', Haushalt: '🏠', Freizeit: '🎉', Sonstiges: '📦' }
  return map[cat] || '📦'
}

export function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6 max-h-[92vh] overflow-y-auto shadow-xl">
        {children}
      </div>
    </div>
  )
}
