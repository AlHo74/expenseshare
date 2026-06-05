const BASE = '/api'

export async function getExpenses() {
  const res = await fetch(`${BASE}/expenses`)
  if (!res.ok) throw new Error('Laden fehlgeschlagen')
  return res.json()
}

export async function createExpense(data) {
  const res = await fetch(`${BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Speichern fehlgeschlagen')
  return res.json()
}

export async function deleteExpense(id) {
  const res = await fetch(`${BASE}/expenses/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Löschen fehlgeschlagen')
}
