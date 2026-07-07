# Naver Blog Player

Naver Blog custom widget that renders a Spotify Top 10 music-player-style chart.

Naver Blog widget HTML does not reliably support JavaScript, iframes, or Spotify embeds. This project serves static HTML/SVG from a Next.js API, stores the latest Spotify ranking in Upstash Redis, and lets Naver Blog load image URLs only.

## Table Of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Environment](#environment)
- [Local Setup](#local-setup)
- [Spotify Setup](#spotify-setup)
- [Updating Rankings](#updating-rankings)
- [Applying To Naver Blog](#applying-to-naver-blog)
- [Routes](#routes)
- [Stack](#stack)

## Features

- Spotify Top 10 track widget
- Four 170x150 snippets for Naver Blog widget layout
- One copy page for all four widget snippets
- Rank row SVG images
- Spotify track/profile links
- Daily Vercel Cron update
- Manual update from `/admin`
- Short server/browser cache to reduce Upstash reads and flicker

## How It Works

1. Spotify OAuth issues a refresh token.
2. `/api/cron/update-top-tracks` fetches Top 10 tracks from Spotify.
3. The latest ranking is stored in Upstash Redis.
4. `/api/rank/[rank].svg` renders each row from stored data.
5. `/api/naver-html` shows four copyable HTML snippets for Naver Blog.

## Environment

Copy `.env.example` to `.env.local` and fill in the values.

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/auth/callback
SPOTIFY_REFRESH_TOKEN=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

CRON_SECRET=
WIDGET_BASE_URL=http://127.0.0.1:3000
WIDGET_TIME_RANGE=short_term
WIDGET_TITLE=Top 10
WIDGET_BACKGROUND_COLOR=#121212
WIDGET_DATA_CACHE_SECONDS=60
WIDGET_SVG_CACHE_SECONDS=60
WIDGET_PROFILE_URL=
WIDGET_PROFILE_IMAGE_URL=
```

Key values:

- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`: Spotify Developer app credentials
- `SPOTIFY_REDIRECT_URI`: OAuth callback URL
- `SPOTIFY_REFRESH_TOKEN`: refresh token returned after Spotify login
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: Redis REST credentials
- `CRON_SECRET`: secret for cron/manual updates
- `WIDGET_BASE_URL`: deployed site URL
- `WIDGET_TIME_RANGE`: `short_term`, `medium_term`, or `long_term`
- `WIDGET_TITLE`: widget title shown in the header
- `WIDGET_BACKGROUND_COLOR`: widget background color, also used for the Naver group box color
- `WIDGET_DATA_CACHE_SECONDS`: in-memory server cache TTL for Redis reads
- `WIDGET_SVG_CACHE_SECONDS`: browser/edge cache TTL for SVG images

Spotify scopes: `user-top-read user-read-private`.

## Local Setup

```bash
npm install
npm run dev
```

Local URL:

```text
http://127.0.0.1:3000
```

## Spotify Setup

1. Create an app in Spotify Developer Dashboard.
2. Add the local redirect URI:

```text
http://127.0.0.1:3000/api/auth/callback
```

3. Fill `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REDIRECT_URI`.
4. Open `/api/auth/login`.
5. Copy the returned refresh token into `SPOTIFY_REFRESH_TOKEN`.
6. Restart the dev server.

For production, also add:

```text
https://your-domain.example/api/auth/callback
```

## Updating Rankings

Vercel Cron updates the ranking daily. KST 00:00 is UTC 15:00.

```json
{
  "crons": [
    {
      "path": "/api/cron/update-top-tracks",
      "schedule": "0 15 * * *"
    }
  ]
}
```

Manual update:

```text
https://your-domain.example/admin
```

Or call the API directly:

```text
https://your-domain.example/api/cron/update-top-tracks?secret=CRON_SECRET_VALUE
```

## Applying To Naver Blog

Open the snippet page:

```text
https://your-domain.example/api/naver-html
```

Copy the four snippets with the copy buttons, then create four Naver Blog custom widgets in this order:

1. Widget 1: header, rank 1-2
2. Widget 2: rank 3-5
3. Widget 3: rank 6-8
4. Widget 4: rank 9-10, profile link

Place them from top to bottom in the Naver layout. The four widgets should appear as one stacked player.

To make the four separate Naver widgets look like one player, set the Naver group box color to the same value as `WIDGET_BACKGROUND_COLOR`:

```text
Blog Admin > Customize Settings > Detailed Design Settings > Group Box
블로그 관리 > 꾸미기 설정 > 세부 디자인 설정 > 그룹 박스
```

Default widget color:

```text
#121212
```

Use a dark color unless you also adjust the text colors in code.

## Customizing The Widget

For now, the fastest customization path is environment variables:

- `WIDGET_TITLE`: header title, for example `Top 10`
- `WIDGET_BACKGROUND_COLOR`: main widget background, for example `#121212`

These values are not secrets. They live in env because this project is currently a single-owner deployment: changing Vercel env values is easier than editing source files, and it keeps the generated widget snippets consistent across SVG routes, demo, and Naver copy page.

If the widget becomes a shared multi-user service later, move these values into a small settings screen backed by Redis or a database. That would let each user customize title/color without touching Vercel or redeploying.

## Routes

- `/`: project home
- `/admin`: manual update page
- `/demo`: widget preview
- `/api/auth/login`: start Spotify OAuth
- `/api/auth/callback`: exchange Spotify authorization code
- `/api/cron/update-top-tracks`: update Top 10 data
- `/api/widget-data`: inspect stored Top 10 JSON
- `/api/widget.svg`: full SVG preview
- `/api/header.svg`: dynamic widget header SVG
- `/api/rank/[rank].svg`: rank row SVG
- `/api/cover/[rank]`: rank cover image proxy
- `/api/profile-image`: profile image proxy
- `/go/[rank]`: redirect to Spotify track
- `/api/naver-html`: copy page for four Naver Blog widget snippets

## Stack

- Next.js App Router
- TypeScript
- Vercel Cron
- Upstash Redis
- Spotify Web API
