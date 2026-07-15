# Language101 Study Toolkit

A production-ready, mobile-first activity hub for Language101 meetups. Participants can scan a QR code, search or filter 17 activities, save favorites on their device, and open the original material without creating an account.

## Features

- Combined search, level, duration, group-size, and category filters
- Filter-aware random activity with no immediate repeats
- Device-local favorites using `localStorage`
- Activity detail pages with source notices and a collapsible mini timer
- 172 natural English expressions: 72 beginner, 50 intermediate, and 50 advanced
- 80 local conversation questions across eight categories
- 60 missions across six categories, with three distinct categories selected daily
- Five quick-start modes with three tailored activity recommendations
- Table mode with Wake Lock support where available
- Date-organized learning notes and an end-of-session summary
- Dynamic `/qr` page using the current site URL
- SEO metadata, Open Graph fields, sitemap, robots.txt, and favicon
- Responsive, accessible interface with reduced-motion support

## Requirements

- Node.js 22.13 or newer
- pnpm 11 or newer

## Local setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
pnpm validate:content
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`validate:content` checks the actual content totals, required fields, duplicate IDs, normalized duplicates, and near-duplicate warnings. In development, `/admin/content-stats` shows the same totals. Set `NEXT_PUBLIC_SHOW_CONTENT_STATS=true` only when this page should also be available in production.

## Add an activity

All activity content lives in `data/activities.ts`. Copy an existing object, assign a unique `id`, and update the title, category, level, duration, group sizes, description, instructions, URL, source type, and tags.

Supported `sourceType` values:

- `interactive`
- `naver-cafe`
- `internal`

## Edit expressions and conversation questions

- Edit `data/expressions.ts` to add or change daily English expressions.
- Edit `data/conversation-topics.ts` to manage the eight question categories and their local questions.
- Edit `data/missions.ts` to change the daily mission pool.

Each data file includes its TypeScript type and a short copy-and-edit comment.

Daily content selection lives in `lib/daily-content.ts`, while `hooks/use-daily-content.ts` detects Korean date changes without a refresh. The `Asia/Seoul` `YYYY-MM-DD` date is the seed, so every visitor sees the same default expression and missions on the same Korean date. Browser-only rerolls and completion state are stored under `language101-daily-YYYY-MM-DD`.

The expression practice area stores up to five custom or recommended expressions under `language101-practice-expressions-YYYY-MM-DD`. Usage counts, optional notes, edits, and completion state remain attached to that Korean date. Use `/expression-history` to review, copy, delete, or bring an older expression back into today’s list.

## Site settings

Operator-facing defaults live in `config/site.ts`. Change the site name, description, default production URL, reservation link, Naver Cafe link, Instagram link, contact link, and brand color in that one file. Public environment variables override the link and color defaults at deployment time.

Create `.env.local` for local overrides:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RESERVATION_URL=https://example.com/reserve
NEXT_PUBLIC_NAVER_CAFE_URL=https://cafe.naver.com/language101
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/101language
NEXT_PUBLIC_CONTACT_URL=https://example.com/contact
NEXT_PUBLIC_BRAND_COLOR=#6C4CF1
```

## Deploy to Vercel

1. Push this project to a Git repository.
2. In Vercel, select **Add New → Project** and import the repository.
3. Keep the detected framework as **Next.js** and the default build settings.
4. Add the public environment variables listed above. `NEXT_PUBLIC_RESERVATION_URL` is required for the meetup application button; the others have defaults in `config/site.ts`.
5. Deploy, then redeploy once the production URL is confirmed so QR, sitemap, and sharing URLs use the final domain.

No database, login, or private server secret is required.
