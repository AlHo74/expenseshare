import express from 'express'
import pg from 'pg'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { Pool } = pg
const app = express()
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use(express.json())

// Serve Vite build
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(join(__dirname, '../dist')))

// GET all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM expenses ORDER BY date DESC, created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// POST new expense
app.post('/api/expenses', async (req, res) => {
  const { paid_by, amount, category, description, date, split, is_settlement } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO expenses (paid_by, amount, category, description, date, split, is_settlement)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [paid_by, amount, category, description ?? '', date, split, is_settlement ?? false]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// DELETE expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
