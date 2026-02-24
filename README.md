# Serlo بالعربي

An Arabic mathematics learning platform inspired by [Serlo.org](https://serlo.org), built with Next.js 14, Prisma, and the Serlo Editor.

## Features

- 📚 **3-level math hierarchy** — Math → Branches → Subtopics → Articles
- ✏️ **Cascading article editor** — step-by-step wizard to select branch/topic before writing
- 👤 **Auth system** — admin and contributor roles (NextAuth.js + bcrypt)
- 🔐 **Admin panel** — manage content, contributors, and publishing
- 📄 **Article reader** — full RTL rendering via SerloRenderer with breadcrumb navigation
- 🌐 **Arabic RTL** — fully right-to-left interface

## Getting Started

### 1. Clone & install
```bash
git clone https://github.com/Raji-co/Math-arabic.git
cd Math-arabic
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Edit .env with your values
# Generate a secret: openssl rand -base64 32
```

### 3. Set up database
```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Run
```bash
npm run dev
# → http://localhost:3000
```

## Default Admin Account
> ⚠️ Change this password immediately in production!
- **Email:** `admin@serlo-ar.local`
- **Password:** `admin123`

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite via Prisma (switch to PostgreSQL for production)
- **Auth:** NextAuth.js with credentials provider
- **Editor:** [@serlo/editor](https://www.npmjs.com/package/@serlo/editor)
- **Styling:** Styled Components + Vanilla CSS

## Production Deployment
Switch `prisma/schema.prisma` datasource from `sqlite` to `postgresql` and update `DATABASE_URL` in your environment. Works with Coolify, Railway, or any Node.js host.
