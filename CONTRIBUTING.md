# Contributing

This repo is a monorepo. Learning Hub owns the menu, the shared profile, root config, CI, Reading, and Math; Head Developer (Reading Game Team) owns Adventure.

| Folder | Owner | Also owns |
| --- | --- | --- |
| `apps/home`, `shared/`, root config (`package.json`, `vercel.json`, `README.md`, `CONTRIBUTING.md`), CI (`.github/`) | Learning Hub | |
| `apps/reading` | Learning Hub | Original `sight-word-game` repo and site |
| `apps/math` | Learning Hub | Original `math-fluency-game` repo and site |
| `apps/adventure` | Head Developer (Reading Game Team) | |

## Rules

- Edit only the folder you own. If a change needs another folder, ask that owner and keep the pull request small.
- Open a small pull request. Do not mix an unrelated game fix with hub work.
- The original `math-fluency-game`, `sight-word-game`, and `reading-progress-game` repos and sites stay live as the upstream games. Only their owner changes them; do not change them from work in this repo.
- `npm test` and `npm run build` must pass before merge. CI runs both on every pull request.

## Checks

```bash
npm install
npm test
npm run build
```

Node.js 22 or newer.
