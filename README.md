# Naver Blog Player

네이버 블로그 위젯 영역에 Spotify 청취 순위 Top 10을 보여주는 음악 플레이어형 커스텀 위젯입니다.

네이버 블로그의 `위젯직접등록` 환경은 JavaScript, iframe, Spotify embed를 안정적으로 사용할 수 없으므로, 이 프로젝트는 Next.js API가 Spotify Web API에서 순위를 가져와 Upstash Redis에 저장하고 네이버에는 정적 HTML/SVG URL만 붙여 넣는 방식으로 동작합니다.

## 목차

- [주요 기능](#주요-기능)
- [동작 방식](#동작-방식)
- [준비물](#준비물)
- [환경 변수](#환경-변수)
- [로컬 실행](#로컬-실행)
- [Spotify 연결](#spotify-연결)
- [순위 갱신](#순위-갱신)
- [네이버 블로그 적용 방법](#네이버-블로그-적용-방법)
- [배포 체크리스트](#배포-체크리스트)
- [라우트](#라우트)
- [기술 스택](#기술-스택)

## 주요 기능

- Spotify 개인 청취 순위 Top 10 표시
- 네이버 블로그 위젯용 정적 HTML 생성
- 네이버 위젯 높이 제한에 맞춘 4분할 위젯 제공
- 순위별 SVG row 이미지 제공
- 트랙 클릭 시 Spotify 트랙 페이지로 이동
- 매일 KST 00:00 자동 갱신
- `/admin` 페이지에서 수동 갱신

## 동작 방식

1. Spotify OAuth로 refresh token을 발급받습니다.
2. `/api/cron/update-top-tracks`가 Spotify API에서 Top 10 트랙을 가져옵니다.
3. 가져온 트랙 데이터를 Upstash Redis에 저장합니다.
4. `/api/rank/[rank].svg`가 저장된 데이터를 순위별 SVG 이미지로 렌더링합니다.
5. `/api/naver-html?mode=split-1`부터 `/api/naver-html?mode=split-4`까지가 네이버 블로그에 붙여 넣을 4개 위젯 HTML을 생성합니다.

## 준비물

- Node.js
- Spotify Developer 앱
- Upstash Redis REST URL/Token
- Vercel 프로젝트
- 네이버 블로그 `위젯직접등록` 접근 권한

## 환경 변수

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
WIDGET_PROFILE_URL=
WIDGET_PROFILE_IMAGE_URL=
```

### 주요 값 설명

- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`: Spotify Developer Dashboard에서 만든 앱의 값
- `SPOTIFY_REDIRECT_URI`: Spotify OAuth callback URL
- `SPOTIFY_REFRESH_TOKEN`: `/api/auth/login`으로 Spotify 연결 후 받은 refresh token
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: 순위 데이터를 저장할 Redis REST 접속 정보
- `CRON_SECRET`: 자동/수동 갱신 API 보호용 비밀값
- `WIDGET_BASE_URL`: 배포된 서비스 도메인
- `WIDGET_TIME_RANGE`: `short_term`, `medium_term`, `long_term` 중 하나
- `WIDGET_TITLE`: 위젯 제목
- `WIDGET_PROFILE_URL`: Spotify 프로필 링크 fallback
- `WIDGET_PROFILE_IMAGE_URL`: 프로필 이미지 fallback

Spotify OAuth scope는 `user-top-read user-read-private`를 사용합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

로컬 서버가 켜지면 아래 주소를 사용합니다.

```text
http://127.0.0.1:3000
```

## Spotify 연결

1. Spotify Developer Dashboard에서 앱을 생성합니다.
2. Redirect URI에 아래 값을 등록합니다.

```text
http://127.0.0.1:3000/api/auth/callback
```

3. `.env.local`에 `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI`를 입력합니다.
4. 로컬 서버에서 아래 주소에 접속합니다.

```text
http://127.0.0.1:3000/api/auth/login
```

5. callback 페이지에서 받은 refresh token을 `.env.local`의 `SPOTIFY_REFRESH_TOKEN`에 입력합니다.
6. 서버를 재시작합니다.

## 순위 갱신

### 자동 갱신

매일 한국 시간 00:00에 순위를 갱신합니다. Vercel Cron은 UTC 기준으로 동작하므로 KST 00:00은 UTC 15:00입니다.

`vercel.json`:

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

Vercel 프로젝트의 Production 환경 변수에 `CRON_SECRET`을 설정하면 Vercel Cron 요청에 `Authorization: Bearer CRON_SECRET값` 헤더가 자동으로 포함됩니다.

### 수동 갱신

배포된 사이트의 `/admin` 페이지에서 `CRON_SECRET`을 입력하고 `지금 순위 갱신` 버튼을 누릅니다.

또는 아래 URL을 직접 호출할 수 있습니다.

```text
https://your-domain.example/api/cron/update-top-tracks?secret=CRON_SECRET값
```

성공 응답 예시:

```json
{
  "ok": true,
  "updatedAtKst": "2026-07-08 00:00 KST",
  "count": 10,
  "schedule": "0 15 * * *"
}
```

## 네이버 블로그 적용 방법

현재 위젯은 네이버 블로그 위젯 높이와 여백을 맞추기 위해 4개 위젯으로 나누어 적용합니다. 각 위젯은 170x150 영역에 맞춰 렌더링됩니다.

### 1. 4개 HTML 생성

배포된 도메인에서 아래 주소 4개에 각각 접속해 HTML을 복사합니다.

```text
https://your-domain.example/api/naver-html?format=min&mode=split-1
https://your-domain.example/api/naver-html?format=min&mode=split-2
https://your-domain.example/api/naver-html?format=min&mode=split-3
https://your-domain.example/api/naver-html?format=min&mode=split-4
```

각 mode가 담당하는 영역은 다음과 같습니다.

- `split-1`: 헤더, 1위, 2위
- `split-2`: 3위, 4위, 5위
- `split-3`: 6위, 7위, 8위
- `split-4`: 9위, 10위, Spotify 프로필 링크

### 2. 네이버 블로그에 4개 위젯 등록

1. 네이버 블로그 관리 화면으로 이동합니다.
2. 레이아웃/위젯 설정에서 `위젯직접등록`을 선택합니다.
3. 첫 번째 위젯에 `split-1` HTML을 붙여 넣고 저장합니다.
4. 같은 방식으로 `split-2`, `split-3`, `split-4` HTML을 각각 별도 위젯으로 등록합니다.
5. 블로그 레이아웃에서 4개 위젯을 위에서부터 `split-1`, `split-2`, `split-3`, `split-4` 순서로 배치합니다.
6. 저장 후 블로그 화면에서 위젯이 하나의 플레이어처럼 이어져 보이는지 확인합니다.

### 3. 적용 확인

아래 항목을 확인합니다.

- 4개 위젯 순서가 `split-1`부터 `split-4`까지 맞는지
- 1위부터 10위까지 이미지가 보이는지
- 각 트랙을 클릭하면 Spotify로 이동하는지
- `/api/widget-data`의 `updatedAtKst`가 최신인지
- 네이버 블로그에서 이미지가 잘리거나 어긋나지 않는지

### 기타 HTML 모드

테스트나 대체 적용을 위해 아래 모드도 제공합니다.

- `/api/naver-html?format=min`: 10개 row를 한 HTML로 출력
- `/api/naver-html?mode=image`: 전체 SVG 이미지만 출력
- `/api/naver-html?mode=linked-image`: 전체 SVG를 하나의 링크로 출력
- `/api/naver-html?mode=map`: 전체 SVG와 image map을 출력

실제 네이버 블로그 적용에는 `split-1`부터 `split-4`까지의 4분할 방식을 권장합니다.

## 배포 체크리스트

- Vercel Production 환경 변수에 `.env.local`과 같은 값을 등록
- `WIDGET_BASE_URL`을 실제 배포 도메인으로 변경
- Spotify Developer Dashboard에 production callback URL 추가
- `/api/auth/login`으로 production refresh token 발급
- `/admin`에서 수동 갱신 성공 확인
- `/api/naver-html?format=min&mode=split-1`부터 `split-4`까지 HTML 확인
- 네이버 블로그에 4개 위젯을 순서대로 적용

Production callback URL 예시:

```text
https://your-domain.example/api/auth/callback
```

## 라우트

- `/`: 프로젝트 홈
- `/admin`: `CRON_SECRET`으로 수동 갱신하는 관리 페이지
- `/demo`: 위젯 디자인 미리보기
- `/api/auth/login`: Spotify OAuth 시작
- `/api/auth/callback`: Spotify authorization code 교환
- `/api/cron/update-top-tracks`: Top 10 갱신
- `/api/widget-data`: 저장된 Top 10 JSON 확인
- `/api/widget.svg`: 전체 Top 10 SVG
- `/api/rank/[rank].svg`: 170x43 순위별 SVG row
- `/api/cover/[rank]`: 순위별 커버 이미지 proxy
- `/api/profile-image`: 프로필 이미지 proxy
- `/go/[rank]`: 해당 순위의 Spotify track URL로 redirect
- `/api/naver-html?format=min&mode=split-1`: 네이버 1번째 위젯 HTML
- `/api/naver-html?format=min&mode=split-2`: 네이버 2번째 위젯 HTML
- `/api/naver-html?format=min&mode=split-3`: 네이버 3번째 위젯 HTML
- `/api/naver-html?format=min&mode=split-4`: 네이버 4번째 위젯 HTML

## 기술 스택

- Next.js App Router
- TypeScript
- Vercel Cron
- Upstash Redis
- Spotify Web API
