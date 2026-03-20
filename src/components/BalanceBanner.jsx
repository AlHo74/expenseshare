import { fmt } from '../App'

export default function BalanceBanner({ balance, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-200 animate-pulse rounded-2xl h-28 mb-4" />
    )
  }

  const absBalance = Math.abs(balance)
  const isBalanced = absBalance < 0.01

  let bgClass, title, subtitle

  if (isBalanced) {
    bgClass = 'bg-emerald-500'
    title = 'Ausgeglichen ✓'
    subtitle = 'Keine offenen Beträge'
  } else if (balance > 0) {
    bgClass = 'bg-orange-500'
    title = fmt(absBalance)
    subtitle = 'Karin schuldet Alex'
  } else {
    bgClass = 'bg-blue-500'
    title = fmt(absBalance)
    subtitle = 'Alex schuldet Karin'
  }

  return (
    <div className={`${bgClass} rounded-2xl p-5 mb-4 text-white`}>
      <p className="text-sm font-medium opacity-80 mb-1">Aktueller Saldo</p>
      <p className="text-3xl font-bold tracking-tight">{title}</p>
      <p className="text-sm opacity-80 mt-1">{subtitle}</p>
    </div>
  )
}
