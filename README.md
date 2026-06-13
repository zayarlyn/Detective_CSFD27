# CS First Date

A detective-themed mentor-mentee matching game for CS students (CS25 seniors & CS26 juniors). Juniors solve clues to identify their senior mentor (P'code) before running out of strikes.

## Tech Stack

- **Framework:** Next.js (App Router)
- **UI:** shadcn/ui + Tailwind CSS
- **ORM:** Drizzle
- **Database:** PostgreSQL
- **Auth:** Microsoft OAuth

## Houses

| House | — |
|-------|---|
| Noir | — |
| Foxlock | — |
| Tracer | — |
| Cipher | — |

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (main)/                # Authenticated layout (sidebar)
│   │   ├── houses/            # Onboarding + house briefing
│   │   ├── houses/[house]/    # House detail page
│   │   ├── houses/[house]/agents/  # House roster
│   │   ├── profile/           # Agent dossier
│   │   └── admin/dashboard/   # HQ case board (admin only)
│   └── api/                   # Route handlers
│       ├── auth/              # login, callback, me, logout
│       ├── students/          # GET all, GET/PUT by id
│       ├── hints/             # POST, PUT/DELETE by id
│       ├── guess/             # POST
│       └── pcodes/            # GET (admin)
├── components/
│   ├── ui/                    # shadcn primitives
│   ├── layout/                # sidebar, navbar, loading
│   ├── house/                 # house cards, badges, roster
│   ├── hints/                 # HintsDialog, clue cards, countdown
│   ├── profile/               # dossier form, photo upload
│   └── admin/                 # pairs table, filter tabs
├── db/
│   ├── schema.ts              # Drizzle schema
│   ├── index.ts               # DB client
│   └── migrations/
├── lib/
│   ├── auth.ts                # session helpers
│   ├── utils.ts               # cn() etc.
│   └── constants/houses.ts    # house names + data
├── hooks/
└── types/
middleware.ts                  # route protection
```

## Setup

1. **Clone the repository**

   ```sh
   git clone <repo-url>
   cd csfd27
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Configure environment variables**

   ```sh
   cp .env.example .env
   ```

   Fill in:
   - `DATABASE_URL`
   - `MICROSOFT_CLIENT_ID`
   - `MICROSOFT_CLIENT_SECRET`
   - `SESSION_SECRET`

4. **Run database migrations**

   ```sh
   npx drizzle-kit migrate
   ```

5. **Start the development server**

   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).
