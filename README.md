# Email Agent (TypeScript / Next.js)

A reference implementation of an AI-assisted leasing email workflow. It handles:

1. Receiving inbound emails via SendGrid Inbound Parse
2. Displaying an inbox & draft manager (React + Tailwind)
3. One-click GPT-generated replies
4. Sending messages via SendGrid

---

## Architecture

```
Lead ➜ SendGrid (Inbound Parse)
     ➜ POST /api/email/inbound          # stores InboundEmail
                                   
Inbox list      Draft list
(page.tsx)  ◀── GET /api/email/inbound  # show inbox
            ──► POST /api/email/:id/generate-draft  # create AI reply draft
            ──► sendEmail() ▶ SendGrid (REST)       # send outbound
```

Key files:

| Path | Purpose |
|------|---------|
| `page.tsx` | Client UI for inbox/drafts (Framer-motion, Tailwind) |
| `store.ts` | **In-memory** persistence (`InboundEmail`, `DraftEmail`) – swap with DB when ready |
| `eagent.ts` | Drafts **first** follow-up email to a new lead |
| `replyAgent.ts` | Drafts a **reply** based on the lead's latest inbound message |
| `sendgrid.ts` | Thin wrapper around `@sendgrid/mail` (adds text fallback) |
| `app/api/email/inbound/route.ts` | Webhook endpoint for SendGrid Inbound Parse (`POST` + `GET`) |
| `app/api/email/[id]/generate-draft/route.ts` | Creates an AI reply draft for a given inbound email |

---

## Getting Started

### 1. Clone & install deps

```bash
npm install           # installs React, Next.js, Tailwind, etc.
# add runtime deps
npm install openai @sendgrid/mail mailparser uuid
# add types (dev)
npm install -D @types/uuid @types/node
```

### 2. Environment Variables

Create a `.env.local` file:

```bash
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG....
DEFAULT_FROM_EMAIL=ava@grandoaks.com   # optional (fallback "from" address)
```

### 3. Configure SendGrid Inbound Parse

1. In SendGrid, navigate to **Settings → Inbound Parse**.
2. Add a hostname (e.g. `inbound.grandoaks.com`) and point its MX record to `mx.sendgrid.net`.
3. Set the **destination URL** to your deployment:
   `https://<domain>/api/email/inbound`
4. Choose `POST` and enable raw MIME.

### 4. Run locally

```bash
npm run dev      # Next.js dev server at http://localhost:3000
```

Send a test email to your Parse address. It should appear in the **Inbox** column. Click **Generate Response** and a GPT-drafted reply will populate the Drafts list.

### 5. Deploy

Any platform that runs Next.js (Vercel, Netlify, Fly, Render). Make sure to set the same env vars and update the Parse webhook URL.

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/email/inbound` | SendGrid webhook – stores inbound email |
| `GET`  | `/api/email/inbound` | Returns list of stored inbound emails |
| `POST` | `/api/email/:id/generate-draft` | Generates a reply draft for that inbound email |

(Note: Outbound send action is performed client-side via `sendgrid.ts`.)

---

## Swapping in a Real Database

`store.ts` is intentionally simple. Replace the arrays with your DB calls (Prisma, Drizzle, etc.). The rest of the codebase remains untouched.

---

## Roadmap / Ideas

• Conversation-level threading (multiple replies)
• Auto-summaries stored in `aiSummary`
• Admin authentication & role-based views
• Message analytics / open tracking

Contributions welcome! 🙌 