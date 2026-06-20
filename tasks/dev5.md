# Dev 5 — Hints System

## Overview
Own the hints API and UI. Seniors write hints for their mentee; juniors see hints in the accusation terminal on `/agent`. Also adds the "Assigned Case" + hint cards section to `/agent/page.tsx` (seniors only, bottom half).

**Start after Dev 3 merges.**

---

## Files to implement

| File | Task |
|---|---|
| `src/app/api/hints/route.ts` | `GET` — fetch hints for current user |
| `src/app/api/hints/[id]/route.ts` | `PATCH` (edit hint), `DELETE` |
| `src/components/hints/hint-card.tsx` | Hint card — editable (senior) and sealed (junior) variants |
| `src/components/admin/hint-manager.tsx` | Admin hint status table component |
| `src/app/(main)/agent/page.tsx` | Add mentee + hint cards section (bottom half, seniors only) |

---

## Design tokens

- Background: `#F3EEE5`, surfaces: `#E5E0CF`
- Accent: `#A86A2A`, Primary text: `#1C1A17`, Muted: `#7A6A58`, `#A0907E`
- Danger: `#8b2020`, Success: `#3a6a2a`
- Fonts: `Cinzel Decorative` (headings), `Cormorant Garamond` (body), `Special Elite` (labels/codes)

---

## `src/app/api/hints/route.ts` — GET

Auth: required.

Behavior differs by role:
- **Senior / house_leader**: find their `pcode` where `seniorId = session.userId`. Return the pcode's hints (all 3), including `revealDate` and `content`.
- **Junior**: find all `pcode` records where `juniorId = session.userId`. Return hints where `revealDate <= now()`. Do not return hints with future `revealDate`.

Response shape:
```ts
{
  hints: Array<{
    id: string;
    content: string;
    revealDate: string; // ISO timestamp
    isRevealed: boolean; // revealDate <= now
  }>;
}
```

---

## `src/app/api/hints/[id]/route.ts`

### PATCH — Edit hint content

Auth: required. Only the senior who owns the hint's pcode can edit.

Check: `hint.revealDate > now()` — reject with `403` if already revealed ("Cannot edit a released hint").

Body: `{ content: string }` — max 500 chars.

Returns updated hint.

### DELETE

Auth: required. Same ownership check as PATCH.

Soft delete: set `deletedAt = now()`.

---

## `src/components/hints/hint-card.tsx`

Two variants controlled by a `variant` prop.

```ts
type HintCardProps = {
  hint: {
    id: string;
    content: string;
    revealDate: string;
    isRevealed: boolean;
  };
  variant: 'senior' | 'junior';
  onSave?: (id: string, content: string) => Promise<void>; // senior only
};
```

### Senior variant (editable)

Reference: `reference/Profile.dc.html` hint cards in edit mode.

Three states based on `isRevealed` and date:

**Released** (success green border, `rgba(58,106,42,0.25)`):
- Header: green dot + `HINT N · RELEASED` in Special Elite + date
- Body: textarea (editable in parent edit mode, readonly in view mode)
- Background tint: `rgba(58,106,42,0.06)` on `#E5E0CF` card

**Pending** (amber border, `rgba(168,106,42,0.3)`):
- Header: `HINT N · PENDING` + date in amber Special Elite
- Body: editable textarea always (not yet released)

**Sealed** (dim, low opacity):
- Header: `HINT N · SEALED` + date in muted Special Elite
- Body: striped redacted bar pattern (CSS repeating-linear-gradient with `#C4B8A8`)
- No textarea — content is locked visually

### Junior variant (readonly/sealed)

Reference: `reference/Profile.dc.html` evidence cards in junior view.

**Revealed** (success green border):
- Green dot + `HINT N · RELEASED` header + date in Special Elite
- Content in italic Cormorant Garamond: `"[hint text]"`

**Sealed** (dim):
- `HINT N · SEALED` header + date in Special Elite
- Three lines of redacted stripes (varying widths) in `#C4B8A8`
- `SEALED` stamp overlay (rotate -4deg, red border)

---

## `src/app/(main)/agent/page.tsx` — Mentee & hints section

**Start after Dev 4 has added the edit mode section.**

Fill in the `{/* === DEV 5: Mentee & Hints section === */}` comment block.

**Only render this section if `user.role === 'senior' || user.role === 'house_leader'`.**

Reference: `reference/Profile.dc.html` senior view — "ASSIGNED CASE" + "EVIDENCE HINTS" sections.

### Mentee card

- Section label: `ASSIGNED CASE` in red Special Elite + `SENIOR ONLY` stamp (rotated, red border)
- Card on `#E5E0CF` with mentee's photo (44px circle), name in Cinzel Decorative, house + junior badges in Special Elite
- Click navigates to `/agent/[mentee.id]`
- Fetch mentee data from `/api/auth/me` response (`mentee` field)

### Hint cards

- Section label: `EVIDENCE HINTS` in Special Elite
- 3 `<HintCard variant="senior" />` components
- Fetch hints from `GET /api/hints`
- `onSave` calls `PATCH /api/hints/[id]` — only active when `editMode` is true (receive via prop/context from Dev 4)
- Save is triggered when senior clicks "SAVE FILE" in the navbar (Dev 4 owns that button)
  - Wire: Dev 4's save handler should call a ref/callback that Dev 5 exposes from the hints section

---

## `src/components/admin/hint-manager.tsx`

Used on the admin dashboard (Dev 7 may embed this or reference it).

```ts
type HintManagerProps = {
  pairs: Array<{
    seniorCode: string;   // student ID (65XXXXXXXX format)
    juniorCode: string;   // student ID (66XXXXXXXX format)
    hints: Array<{ content: string; revealDate: string }>;
  }>;
};
```

Layout:
- Table columns: SENIOR · JUNIOR · HINT 1 · HINT 2 · HINT 3
- Each hint column: green dot + `SET` if content non-empty, red `EMPTY` if blank
- Filter tabs: ALL · MISSING (any hint empty) · COMPLETE (all 3 set)

Global release schedule section (top):
- 3 date displays for hint 1/2/3 reveal dates
- Status per hint: RELEASED (green) / PENDING (amber, pulsing dot) / SCHEDULED (dim)
- "RELEASE NOW" buttons for early release (sends PATCH to update `revealDate` to now)

> This component is data-display only — wire up API calls when integrating.
