import { useState } from 'react'
import { createExpense } from '../api'
import { Modal } from './AddExpenseForm'
import { fmt } from '../App'

export default function SettleUpModal({ balance, onClose, onSaved }) {
  const today = new Date().toISOString().split('T')[0]

  const absBalance = Math.abs(balance)
  const suggestedPayer = balance > 0 ? 'karin' : 'alex'
  const suggestedPayerLabel = suggestedPayer === 'karin' ? 'Karin' : 'Alex'

  const [form, setForm] = useState({
    paid_by: suggestedPayer,
    amount: absBalance > 0 ? absBalance.toFixed(2) : '',
    date: today,
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
        category: 'Ausgleich',
        description: 'Ausgleichszahlung',
        date: form.date,
        split: 1,
        is_settlement: true,
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
      <h2 className="text-lg font-bold text-slate-800 mb-2">Ausgleichen</h2>

      {absBalance > 0.01 ? (
        <p className="text-sm text-slate-500 mb-4">
          Vorschlag: {suggestedPayerLabel} zahlt {fmt(absBalance)} zurück.
        </p>
      ) : (
        <p className="text-sm text-slate-500 mb-4">Der Saldo ist bereits ausgeglichen.</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Wer zahlt zurück?</label>
          <div className="grid grid-cols-2 gap-2">
            {['alex', 'karin'].map(person => (
              <button
                key={person}
                type="button"
                onClick={() => set('paid_by', person)}
                className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
                  form.paid_by === person
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {person === 'alex' ? '👨 Alex' : '👩 Karin'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Betrag (€)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            value={form.amount}
            onChange={e => set('amount', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Datum</label>
          <input
            type="date"
            value={form.date}
            onChange={e => set('date', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
            className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? 'Speichern…' : 'Ausgleich speichern'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
