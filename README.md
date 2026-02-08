# Valentine Bloom (Next.js + Tailwind + Framer Motion)

A romantic, time-locked Valentine web app built with Next.js App Router and Tailwind CSS, ready to deploy on Vercel.

## Routes

- `/` date gate + live countdown to February 14
- `/passcode` passcode unlock screen
- `/bloom` rose grow and bloom animation
- `/memories` scattered polaroid gallery with stories
- `/valentine` final proposal page with heart/confetti reactions

## Run locally

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run start
```

## Customize passcode

Edit:

- `lib/constants.ts`

Default passcode is:

- `rosebloom14`

## Add your own music

Place your mp3 at:

- `public/music/romantic.mp3`

Music behavior:

- Never autoplays on initial load.
- Starts only after user interaction (passcode success or music toggle button).
- Volume is set to `25%`.
- Continues across route navigation.

## Add your own photos

Replace these files with your own images:

- `public/images/memory-1.svg`
- `public/images/memory-2.svg`
- `public/images/memory-3.svg`
- `public/images/memory-4.svg`
- `public/images/memory-5.svg`
- `public/images/memory-6.svg`

You can use `.jpg`/`.png` too. If you change names, update image paths in:

- `app/memories/page.tsx`

## Deploy on Vercel

1. Push this project to GitHub/GitLab/Bitbucket.
2. Import the repo in Vercel.
3. Deploy with defaults (no extra configuration needed).

This project is fully client-side and requires no backend.
