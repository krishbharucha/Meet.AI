# MeetAI (Next.js 15)

MeetAI is a modern video meetings platform built with Next.js 15, Stream Video, Better Auth, Drizzle ORM (Neon Postgres), Inngest, and OpenAI.  
It supports authentication, live meetings, transcripts, and AI-generated meeting summaries.

⚠️ Billing (Polar) has been intentionally disabled in this version.

---

## 🚀 Features

- 🔐 Authentication (GitHub, Google, Email/Password)
- 🎥 Live video meetings (Stream Video)
- 🧠 AI meeting summaries (OpenAI)
- 📝 Meeting transcripts
- 📊 Dashboard for agents and meetings
- ⚡ Background jobs powered by Inngest
- 🗄️ Neon PostgreSQL + Drizzle ORM

---

## 🧰 Tech Stack

- Next.js 15 (App Router)
- Better Auth
- Stream Video + Stream Chat
- Drizzle ORM
- Neon PostgreSQL
- Inngest
- OpenAI

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
npm install --legacy-peer-deps
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root.

```env
DATABASE_URL="postgresql://..."

BETTER_AUTH_SECRET="your-random-secret"
BETTER_AUTH_URL="http://localhost:3000"

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

NEXT_PUBLIC_APP_URL="http://localhost:3000"

NEXT_PUBLIC_STREAM_VIDEO_API_KEY=""
STREAM_VIDEO_SECRET_KEY=""
NEXT_PUBLIC_STREAM_CHAT_API_KEY=""
STREAM_CHAT_SECRET_KEY=""

OPENAI_API_KEY=""
```

Notes:

- Stream keys are required for meetings, transcripts, and recordings.
- OpenAI API key is required for AI summaries.
- Billing is disabled, so no Polar keys are required.

---

## 🗄️ Database Setup

Push schema to Neon database:

```bash
npm run db:push
```

Optional database studio:

```bash
npm run db:studio
```

---

## 💻 Development Setup

You must run **3 terminals** for full local functionality.

---

### 🟢 Terminal 1 — Next.js App

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

### 🟣 Terminal 2 — Inngest Background Jobs

```bash
npx inngest-cli@latest dev
```

Open Inngest UI:

```
http://localhost:8288
```

This powers:

- Meeting transcripts
- AI summaries
- Background processing

---

### 🟡 Terminal 3 — ngrok (Webhook Tunnel)

Install ngrok if needed:

```bash
brew install ngrok
```

Start tunnel:

```bash
ngrok http 3000
```

Copy the HTTPS forwarding URL (example):

```
https://abc123.ngrok-free.dev
```

Update `.env.local`:

```env
NEXT_PUBLIC_APP_URL="https://abc123.ngrok-free.dev"
BETTER_AUTH_URL="https://abc123.ngrok-free.dev"
```

Restart Next.js after changing env:

```bash
npm run dev
```

---

## 🔔 Stream Webhook Setup (Required)

In Stream Dashboard:

Add webhook endpoint:

```
https://YOUR_NGROK_DOMAIN.ngrok-free.dev/api/webhook
```

Select all relevant Video/Call events.

Verification:

Open ngrok inspector:

```
http://127.0.0.1:4040
```

After ending a meeting, you should see:

```
POST /api/webhook
```

---

## 🧪 Testing the Full Pipeline

1. Open the app using your ngrok URL.
2. Start a meeting.
3. Speak for a few seconds.
4. End the meeting.
5. Watch:

- ngrok inspector → webhook requests
- Inngest terminal → job execution
- Dashboard → transcript + AI summary

---

## 🏗️ Production Build

```bash
npm run build
npm run start
```

For production summaries:

- Configure Stream webhook to deployed domain
- Use Inngest Cloud or a production worker

---

## 💳 Billing (Polar)

Billing is disabled in this repository.

- Upgrade UI remains
- Checkout and billing portal actions removed
- Users operate in free-tier mode

---

## 🐞 Troubleshooting

### `/api/webhook` shows 405 in browser

Normal behavior. Webhooks expect POST requests.

---

### No transcripts or summaries

Check:

1. ngrok inspector shows POST `/api/webhook`
2. Inngest dev server is running
3. Stream webhook endpoint is correct
4. Stream secret keys are valid
5. OpenAI API key exists

---

## 📄 License

MIT
