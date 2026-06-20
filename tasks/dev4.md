# Dev 4 — Own Profile & Image Upload

## Overview
Extend the readonly `/agent/page.tsx` built by Dev 3 with edit mode, profile picture upload/crop, and the PATCH API route.

**Start after Dev 3 merges.**

---

## Files to implement

| File | Task |
|---|---|
| `src/app/(main)/agent/page.tsx` | Add edit mode + upload/crop on top of Dev 3's readonly skeleton |
| `src/app/api/students/[id]/route.ts` | Add `PATCH` handler (Dev 3 owns `GET`) |
| `src/lib/r2.ts` | Cloudflare R2 upload utility |

---

## Dependencies to install

```bash
npm install @aws-sdk/client-s3 react-image-crop
```

- `@aws-sdk/client-s3` — R2 is S3-compatible
- `react-image-crop` — client-side image crop before upload

---

## `src/lib/r2.ts` — Cloudflare R2 utility

```ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,     // https://<account-id>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(
  key: string,        // e.g. `profiles/${studentId}.jpg`
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
```

Env vars required:
```env
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=   # public CDN base URL for the bucket
```

---

## `src/app/api/students/[id]/route.ts` — PATCH

Auth: session required. Only the student themselves can update their own profile (`session.userId === params.id`). Return `403` otherwise.

Accepted body fields:
```ts
{
  nickname?: string;
  nationality?: string;
  instagram?: string;
  discord?: string;
  line?: string;
  profilePic?: string; // base64 data URI — triggers R2 upload
}
```

If `profilePic` is a base64 data URI:
1. Parse the MIME type and base64 payload from the data URI
2. Convert to `Buffer`
3. Call `uploadToR2(`profiles/${id}.jpg`, buffer, contentType)`
4. Set `profileUrl` to the returned public URL

Validate:
- `nickname`: 2–30 chars if provided
- `profilePic`: must be `image/jpeg` or `image/png` if provided; max ~2MB (reject if base64 length > ~2.7M chars)

Return updated student on success.

---

## `src/app/(main)/agent/page.tsx` — Edit mode + image upload

Reference: `reference/Profile.dc.html` — the edit mode toggle and social input fields.

Dev 3 already built the readonly skeleton with placeholder comment markers. You are filling in the `{/* === DEV 4: Edit mode controls === */}` section and wiring the edit button.

### Edit mode toggle

Navbar already has an `EDIT FILE` button stub from Dev 3. Wire it up:
- Click toggles `editMode` state
- When `editMode = true`: button label → `SAVE FILE`, amber border/color
- When `editMode = false`: button label → `EDIT FILE`, muted

### Social links in edit mode

Reference: `reference/Profile.dc.html` Instagram/Discord/Line inputs in edit state.

When `editMode`:
- Each social field becomes an `<input>` (transparent bg, Cormorant Garamond, amber caret)
- Border of each field highlights to `#A86A2A` amber

When view mode:
- Display static text value (or `—` if null) in Cormorant Garamond

### Profile picture upload

When `editMode`, show a camera/upload button overlaying the profile photo.

Flow:
1. User selects image file via `<input type="file" accept="image/*">`
2. Show `react-image-crop` crop UI (square crop, min 200×200)
3. On confirm crop: convert canvas to base64 JPEG data URI
4. Store in local state `pendingPic`
5. Show preview in the photo slot

On "SAVE FILE":
- Build PATCH body with all changed fields + `profilePic` (if `pendingPic` is set)
- `PATCH /api/students/[currentUser.id]`
- On success: update local user state, exit edit mode, clear `pendingPic`
- On error: show inline error in Cormorant Garamond muted red

### Coordination with Dev 5 and Dev 6

Dev 5 adds the mentee/hints section (seniors) and Dev 6 adds the accusation terminal (juniors) — both below this edit section. Leave the placeholder comments from Dev 3 intact:

```tsx
{/* === DEV 5: Mentee & Hints section — seniors/house_leaders only === */}

{/* === DEV 6: Accusation terminal — juniors only === */}
```

Dev 5 needs `editMode` state passed down — expose it via a context or prop. Dev 6 reads hints independently.
