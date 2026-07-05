# Naver Blog Player

Naver Blog의 `위젯직접등록` 환경에서 사용할 수 있는 Spotify Top 10 외부 위젯입니다.

네이버 위젯 안에서는 JavaScript, iframe, Spotify embed를 쓰지 않습니다. 외부 Next.js 서버가 Spotify API를 호출해 Top 10 데이터를 Upstash Redis에 저장하고, 네이버에는 정적 HTML과 SVG 이미지 URL만 붙입니다.

## Stack

- Next.js App Router
- TypeScript
- Vercel Cron
- Upstash Redis
- Spotify Web API

## Environment

`.env.example`을 `.env.local`로 복사한 뒤 값을 채웁니다.

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
WIDGET_TITLE=Wavy Top 10
```

Spotify scope는 MVP 기준 `user-top-read`만 사용합니다.

## Local Flow

1. `npm install`
2. `npm run dev`
3. Spotify Developer Dashboard에 `SPOTIFY_REDIRECT_URI` 등록
4. `/api/auth/login` 접속
5. callback에서 받은 refresh token을 `SPOTIFY_REFRESH_TOKEN`에 입력
6. `/api/cron/update-top-tracks?secret=CRON_SECRET값` 호출
7. `/api/widget-data`에서 저장 데이터 확인
8. `/api/rank/1.svg`부터 `/api/rank/10.svg` 확인
9. `/api/naver-html?format=min` 결과를 Naver Blog 위젯직접등록에 붙여넣기

## Routes

- `/api/auth/login`: Spotify OAuth 시작
- `/api/auth/callback`: Spotify authorization code 교환
- `/api/cron/update-top-tracks`: Top 10 갱신
- `/api/widget-data`: 저장된 Top 10 JSON 확인
- `/api/widget.svg`: 전체 Top 10 SVG
- `/api/rank/[rank].svg`: 170x52 순위별 SVG row
- `/go/[rank]`: 해당 순위의 Spotify track URL로 redirect
- `/api/naver-html?format=min`: 네이버에 붙여넣을 압축 HTML

## Cron

KST 00:00은 UTC 15:00입니다. `vercel.json`은 아래 스케줄을 사용합니다.

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

수동 호출은 `?secret=` query 또는 `Authorization: Bearer ...` header로 `CRON_SECRET`을 검증합니다. Vercel Cron 요청은 `vercel-cron` user-agent를 허용합니다.

## Naver Widget

최종 HTML은 170px 너비이며 `<a>`, `<img>`, `<div>`, `<br>`만 사용합니다.

```html
<div style="width:170px;font-family:Arial,sans-serif;font-size:12px"><a href="https://example.com/go/1" target="_blank"><img src="https://example.com/api/rank/1.svg" width="170" height="52" border="0"></a></div>
```

실제 `/api/naver-html?format=min` 응답은 1위부터 10위까지 모두 포함합니다.
