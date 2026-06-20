# CSFD27 Architecture

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **ORM:** Drizzle
- **Database:** PostgreSQL
- **Auth:** Microsoft OAuth (MSAL)
- **Image upload:** Cloudinary

---

## Frontend Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Landing — event countdown + Microsoft login button; redirect to `/houses` if authenticated |
| `/login` | `app/(auth)/login/page.tsx` | Login page |
| `/houses` | `app/(main)/houses/page.tsx` | Houses directory — grid of all 4 houses; onboarding flow (nickname prompt + magic pot) if `user.nickname` is null |
| `/houses/[house]` | `app/(main)/houses/[house]/page.tsx` | House detail — image, lore, description + full member grid (leaders first) |
| `/agent` | `app/(main)/agent/page.tsx` | Own profile — view + edit info, upload + crop pic; hints shown as dialog |
| `/agent/[id]` | `app/(main)/agent/[id]/page.tsx` | Another member's public profile — pic, name, house, social links |
| `/admin/dashboard` | `app/(main)/admin/dashboard/page.tsx` | Admin only — mentor-pair table with found/not_found/all filter |
| `/*` | `app/not-found.tsx` | 404 |

---

## API Routes

### `/api/auth`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/auth/login` | — | Redirect to MSAL auth URL |
| `GET` | `/api/auth/callback` | — | MSAL callback — exchange code, upsert student, set session, redirect |
| `POST` | `/api/auth/complete-registration` | required | Save nickname on first login |
| `GET` | `/api/auth/me` | required | Current user: profile, hints, mentees, guessCheck, isAdmin |
| `POST` | `/api/auth/logout` | — | Destroy session |

### `/api/students`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/students` | — | All students; supports `?role=senior\|junior` and `?house=` |
| `GET` | `/api/students/[id]` | — | Single student — used by `/agent/[id]` |
| `PATCH` | `/api/students/[id]` | required (self only) | Update profile; Cloudinary upload if `profilePic` is a data URI |

### `/api/hints`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/hints` | required | Senior: given hints per mentee. Junior: received hints |
| `PATCH` | `/api/hints/[id]` | required (senior, before reveal date) | Update single hint content |

### `/api/guess`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/guess` | required (junior only) | Submit guess; correct → `isFound = true`; wrong → decrement `lives` |

### `/api/pcodes`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/pcodes` | required | Junior: last-3-digit codes for seniors in same house (lucky draw pool). Admin: full mentor-pair list with `?status=found\|not_found\|all` |

---

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── admin/dashboard/page.tsx
│   │   ├── agent/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── houses/
│   │       ├── page.tsx
│   │       └── [house]/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── callback/route.ts
│   │   │   ├── complete-registration/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── guess/route.ts
│   │   ├── hints/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── pcodes/route.ts
│   │   └── students/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   │   ├── hint-manager.tsx
│   │   └── student-table.tsx
│   ├── hints/
│   │   └── hint-card.tsx
│   ├── house/
│   │   ├── agent-card.tsx
│   │   └── house-card.tsx
│   ├── layout/
│   │   └── navbar.tsx
│   ├── profile/
│   │   └── profile-card.tsx
│   └── ui/
│       ├── badge.tsx
│       └── button.tsx
├── db/
│   ├── index.ts
│   ├── schema.sql
│   └── schema.ts
└── lib/
    ├── auth.ts
    ├── constants/
    │   └── houses.ts
    └── utils.ts
```

---

## Houses

| Key | Display Name |
|---|---|
| `noir` | Noir |
| `foxlock` | Foxlock |
| `tracer` | Tracer |
| `cipher` | Cipher |

## Roles

| Role | Description |
|---|---|
| `CS25` | Seniors (P'codes) — write hints, have mentees |
| `CS26` | Juniors (Freshmen) — receive hints, guess mentor |
| Admin | Hardcoded by student ID — access to `/admin/dashboard` and full `/api/pcodes` |
