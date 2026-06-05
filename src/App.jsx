import { useState, useEffect, useCallback } from 'react'
import { getExpenses } from './api'
import BalanceBanner from './components/BalanceBanner'
import AddExpenseForm from './components/AddExpenseForm'
import ExpenseHistory from './components/ExpenseHistory'
import SettleUpModal from './components/SettleUpModal'

export function fmt(amount) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
}

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showSettleUp, setShowSettleUp] = useState(false)
  const [activeTab, setActiveTab] = useState('balance')

  const fetchExpenses = useCallback(async () => {
    try {
      const data = await getExpenses()
      setExpenses(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchExpenses()
    // Polling alle 5 Sekunden für Live-Updates zwischen Alex & Karin
    const interval = setInterval(fetchExpenses, 5000)
    return () => clearInterval(interval)
  }, [fetchExpenses])

  // positive = Karin owes Alex, negative = Alex owes Karin
  function calculateBalance() {
    let balance = 0
    for (const exp of expenses) {
      if (exp.is_settlement) {
        if (exp.paid_by === 'karin') balance += Number(exp.amount)
        else balance -= Number(exp.amount)
      } else {
        const owedAmount = Number(exp.amount) * Number(exp.split)
        if (exp.paid_by === 'alex') balance += owedAmount
        else balance -= owedAmount
      }
    }
    return Math.round(balance * 100) / 100
  }

  const balance = calculateBalance()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800">💸 FamilyShare</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettleUp(true)}
              className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              Ausgleichen
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              + Eintrag
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4">
        <BalanceBanner balance={balance} loading={loading} />

        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-200 p-1 mb-4">
          {['balance', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'balance' ? 'Übersicht' : `Verlauf (${expenses.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'balance' ? (
          <BalanceBreakdown expenses={expenses} />
        ) : (
          <ExpenseHistory expenses={expenses} onDelete={fetchExpenses} />
        )}
      </div>

      {showAddForm && (
        <AddExpenseForm
          onClose={() => setShowAddForm(false)}
          onSaved={() => { setShowAddForm(false); fetchExpenses() }}
        />
      )}

      {showSettleUp && (
        <SettleUpModal
          balance={balance}
          onClose={() => setShowSettleUp(false)}
          onSaved={() => { setShowSettleUp(false); fetchExpenses() }}
        />
      )}
    </div>
  )
}

function BalanceBreakdown({ expenses }) {
  const alexPaid = expenses
    .filter(e => !e.is_settlement && e.paid_by === 'alex')
    .reduce((sum, e) => sum + Number(e.amount), 0)
  const karinPaid = expenses
    .filter(e => !e.is_settlement && e.paid_by === 'karin')
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const recent = expenses.slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Alex bezahlt</p>
          <p className="text-xl font-bold text-slate-800">{fmt(alexPaid)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Karin bezahlt</p>
          <p className="text-xl font-bold text-slate-800">{fmt(karinPaid)}</p>
        </div>
      </div>

      {recent.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Letzte Einträge</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recent.map(exp => (
              <ExpenseRow key={exp.id} expense={exp} />
            ))}
          </div>
        </div>
      )}

      {expenses.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-5xl mb-3">💰</p>
          <p className="text-sm">Noch keine Einträge vorhanden.</p>
          <p className="text-sm mt-1">Tippe auf &ldquo;+ Eintrag&rdquo; um zu starten.</p>
        </div>
      )}
    </div>
  )
}

export function ExpenseRow({ expense }) {
  const categoryEmoji = {
    Lebensmittel: '🛒',
    Kind: '👧',
    Haushalt: '🏠',
    Freizeit: '🎉',
    Sonstiges: '📦',
  }

  const emoji = expense.is_settlement ? '🤝' : (categoryEmoji[expense.category] || '📦')
  const payerLabel = expense.paid_by === 'alex' ? 'Alex' : 'Karin'
  const splitLabel = expense.is_settlement
    ? 'Ausgleich'
    : Number(expense.split) === 1
    ? '100% alleine'
    : '50/50'

  const date = new Date(expense.date + 'T00:00:00').toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })

  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <span className="text-2xl leading-none">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {expense.description || expense.category}
        </p>
        <p className="text-xs text-slate-400">
          {payerLabel} · {expense.is_settlement ? 'Ausgleich' : expense.category} · {splitLabel}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-slate-800">{fmt(expense.amount)}</p>
        <p className="text-xs text-slate-400">{date}</p>
      </div>
    </div>
  )
}
