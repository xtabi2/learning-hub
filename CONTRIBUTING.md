# Contributing

This repo is a monorepo with one owner per game, plus a hub owner for the menu and the shared profile.

| Folder | Who edits it |
| --- | --- |
| `apps/math` | Math owner |
| `apps/reading` | Reading owner |
| `apps/adventure` | Adventure owner |
| `shared/`, `apps/home`, root `vercel.json`, `.github/`, `README.md` | Hub owner |

## Rules

- Edit only the folder you own. If a change needs another folder, ask that owner and keep the pull request small.
- Open a small pull request. Do not mix an unrelated game fix with hub work.
- Do not push to or open pull requests against `math-fluency-game`, `sight-word-game`, or `reading-progress-game`. Those repos stay the upstream games.
- `npm test` and `npm run build` must pass before merge. CI runs both on every pull request.

## Checks

```bash
npm install
npm test
npm run build
```

Node.js 22 or newer.
