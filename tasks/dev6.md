# Dev 6 — Guessing Game & Pcodes

## Overview
Own the core game mechanic: the guess submission API, the pcodes lookup, and the junior accusation terminal UI on `/agent/page.tsx`. The separate `/guess` page no longer exists — the entire guessing experience is embedded in the junior view of `/agent`.

**Start after Dev 3 merges.**

---

## Files to implement

| File | Task |
|---|---|
| `src/app/api/guess/route.ts` | `POST` — submit a guess |
| `src/app/api/pcodes/route.ts` | `GET` — junior house pool / admin full list |
| `src/app/(main)/agent/page.tsx` | Add junior accusation terminal (junior only section) |

---

## `src/app/api/guess/route.ts` — POST

Auth: required. Junior only — return `403` if `role !== 'junior'`.

Body: `{ studentId: string }` — the 10-digit student ID the junior is guessing.

Logic:
1. Find the junior's `pcode` record (`juniorId = session.userId`)
2. If `pcode.foundAt` is already set → return `400` ("Case already closed")
3. Fetch the senior from the `student` table where `studentId = body.studentId`
4. If senior not found → return `404` ("Unknown operative")
5. Check if `senior.id === pcode.seniorId`:
   - **Correct**: set `pcode.foundAt = now()` → return `{ correct: true, senior: { displayName, nickname, house, profileUrl } }`
   - **Wrong**: decrement `student.guessLeft` by 1 → return `{ correct: false, livesLeft: user.guessLeft - 1 }`
6. If `student.guessLeft === 0` before this guess → return `403` ("No attempts remaining")

---

## `src/app/api/pcodes/route.ts` — GET

Auth: required.

**Junior** (`role === 'junior'`):
- Find all seniors in the same house as the junior
- Return their last 3 digits of `studentId` as a lucky draw pool
- Response: `{ pool: string[] }` — e.g. `["042", "187", "903"]`
- Do NOT reveal which code belongs to which senior

**Admin** (`isAdmin === true`):
- Return all `pcode` records joined with senior + junior student data
- Supports `?status=solved|open|all` filter
- Response:
```ts
{
  pairs: Array<{
    id: string;
    senior: { id: string; studentId: string; };
    junior: { id: string; studentId: string; guessLeft: number; };
    foundAt: string | null;
    createdAt: string;
  }>;
}
```

Return `403` for any other role.

---

## `/agent/page.tsx` — Junior accusation terminal

Fill in the `{/* === DEV 6: Accusation terminal — juniors only === */}` comment block left by Dev 3.

**Only render this section if `user.role === 'junior'`.**

Reference: `reference/Profile.dc.html` junior view — "SUBMIT ACCUSATION" section + evidence cards + solved/expired states.

### Design tokens

- Background: `#F3EEE5`, surface: `#E5E0CF`
- Accent: `#A86A2A`, Primary text: `#1C1A17`, Muted: `#7A6A58`
- Danger: `#8b2020`, Success: `#3a6a2a`
- Fonts: `Cinzel Decorative` (headings), `Cormorant Garamond` (body), `Special Elite` (labels/codes/terminal)

### Data to fetch

- `GET /api/auth/me` — already loaded by parent (receive `guessLeft`, `isFound` as props or read from context)
- `GET /api/hints` — revealed hints (only revealed ones returned by the API)

### Active case state (when `!isFound && guessLeft > 0`)

**Attempts remaining block** (`#E5E0CF` card, danger border):
- `ATTEMPTS REMAINING` label in red Special Elite
- Tally marks display: each used attempt = a struck-through vertical line; remaining = plain vertical lines
- `N of 3 chances left` in Cormorant Garamond
- `N FAILED` badge (red border, Special Elite)

**Suspect ID Terminal** input block:
- `SUBMIT ACCUSATION` header in Cinzel Decorative + pulsing red dot
- `ENTER STUDENT ID:` label in Special Elite
- Input: `›_` prefix, Special Elite 18px, letter-spacing 3px, amber caret, placeholder `65XXXXXXXX`
- `maxLength={10}`, light parchment background

**Error state** (shown after wrong guess):
- Amber/red-tinted message block: "Wrong ID. That operative remains at large. N chances remaining." in Cormorant Garamond
- Input border turns `#8b2020` red
- Input shakes (CSS `shake` keyframe, 0.4s)

**"Submit Accusation" button**:
- Full-width dark `#2F241F` block
- "IRREVERSIBLE" in Special Elite subtitle
- On submit:
  - Validate: input must be exactly 10 digits
  - `POST /api/guess` with `{ studentId }`
  - If `correct: true` → switch to solved state
  - If `correct: false` → show error, decrement lives locally, shake animation
  - If `livesLeft === 0` → switch to expired state (disable input + button)

**Evidence cards** (below input):
- `EVIDENCE ON HAND` label in Special Elite
- Render `<HintCard variant="junior" />` for each hint from `GET /api/hints`
- Dev 5 owns `<HintCard />` — import and use it here

---

### Solved state (when `isFound === true`)

Reference: `reference/Profile.dc.html` "CASE SOLVED" section.

- Success green radial glow on `#F3EEE5` background
- `CASE CLOSED` stamp (green border, rotate -3deg, `closedStamp` fadeIn animation)
- `CONFESSION SEALED · OPERATIVE IDENTIFIED` labels in Special Elite
- Revealed identity card on `#E5E0CF`:
  - Senior's photo (56px circle), display name in Cinzel Decorative, alias in Cormorant Garamond italic, house badge, `IDENTIFIED` green badge
- Case reference footer: case number in Special Elite, date closed, attempts used

---

### Expired state (when `guessLeft === 0 && !isFound`)

- Muted danger tint — `rgba(139,32,32,0.06)` on parchment
- `CASE EXPIRED` heading in Cinzel Decorative
- "This operative has evaded identification." in Cormorant Garamond
- Show all revealed hints
- No input or submit button

---

## Notes

- The `guessLeft` and `isFound` values from `/api/auth/me` are authoritative — re-fetch after a correct guess to confirm solved state
- Import `<HintCard variant="junior" />` from `src/components/hints/hint-card.tsx` (Dev 5 implements that component)
- The lucky draw pcode pool (`GET /api/pcodes`) is available but not shown in this UI — it's reserved for a possible future feature
