import { useState } from 'react'
import { deleteExpense } from '../api'
import { ExpenseRow } from '../App'

const CATEGORIES = ['Alle', 'Lebensmittel', 'Kind', 'Haushalt', 'Freizeit', 'Sonstiges', 'Ausgleich']

export default function ExpenseHistory({ expenses, onDelete }) {
  const [filterCat, setFilterCat] = useState('Alle')
  const [filterPayer, setFilterPayer] = useState('alle')
  const [deletingId, setDeletingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const filtered = expenses.filter(e => {
    const cat = e.is_settlement ? 'Ausgleich' : e.category
    if (filterCat !== 'Alle' && cat !== filterCat) return false
    if (filterPayer !== 'alle' && e.paid_by !== filterPayer) return false
    return true
  })

  async function handleDelete(id) {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      return
    }
    setDeletingId(id)
    setConfirmDeleteId(null)
    try {
      await deleteExpense(id)
      onDelete()
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterCat === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {[['alle', 'Alle'], ['alex', 'Alex'], ['karin', 'Karin']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilterPayer(val)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterPayer === val
                  ? 'bg-slate-700 text-white'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          Keine Einträge gefunden.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map(exp => (
              <div key={exp.id} className="relative group">
                <ExpenseRow expense={exp} />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(exp.id)}
                    disabled={deletingId === exp.id}
                    className={`text-xs px-2 py-1 rounded-lg font-medium transition-colors ${
                      confirmDeleteId === exp.id
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    {deletingId === exp.id ? '…' : confirmDeleteId === exp.id ? 'Sicher?' : '✕'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-center text-slate-400">{filtered.length} Einträge</p>
      )}
    </div>
  )
}
