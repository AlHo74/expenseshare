-- FamilyShare: Expense tracking schema
-- Run this once after creating the PostgreSQL database in Coolify

CREATE TABLE IF NOT EXISTS expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  date date NOT NULL,
  paid_by text NOT NULL CHECK (paid_by IN ('alex', 'karin')),
  amount numeric(10, 2) NOT NULL CHECK (amount > 0),
  split numeric(3, 2) NOT NULL DEFAULT 0.5 CHECK (split IN (0.5, 1.0)),
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_settlement boolean NOT NULL DEFAULT false
);
