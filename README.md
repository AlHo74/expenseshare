# FamilyShare — Gemeinsame Ausgaben

Einfache Web-App für Alex & Karin zum Tracken von geteilten Familienausgaben.

## Setup

### 1. Supabase — Datenbank einrichten

1. Öffne dein Supabase-Projekt → **SQL Editor** → **New query**
2. Füge den Inhalt von `supabase-migration.sql` ein und klicke **Run**
3. Fertig — die Tabelle `expenses` ist erstellt.

### 2. Lokale Entwicklung

```bash
npm install
cp .env.example .env.local
# VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY eintragen
npm run dev
```

### 3. Deployment auf Vercel

1. Repository auf GitHub pushen
2. vercel.com → **New Project** → GitHub-Repo auswählen
3. Framework: **Vite** (wird automatisch erkannt)
4. **Environment Variables** hinzufügen:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. **Deploy** klicken

## Umgebungsvariablen

| Variable | Beschreibung |
|---|---|
| `VITE_SUPABASE_URL` | URL deines Supabase-Projekts |
| `VITE_SUPABASE_ANON_KEY` | Öffentlicher Anon Key (publishable) |

## Features

- Saldo-Anzeige — prominent wer wem wie viel schuldet
- Ausgaben hinzufügen — Zahler, Betrag, Kategorie, Aufteilung (50/50 oder 100%)
- Kategorien — Lebensmittel, Kind, Haushalt, Freizeit, Sonstiges
- Ausgleichen — Rückzahlungen mit Vorausfüllung des offenen Betrags
- Verlauf — Filter nach Kategorie und Person, Löschen möglich
- Echtzeit — Änderungen erscheinen sofort auf beiden Geräten (Supabase Realtime)
- Mobil-optimiert — funktioniert auf iPhone/Android

## Tech Stack

React + Vite · Tailwind CSS v4 · Supabase (PostgreSQL + Realtime) · Vercel
