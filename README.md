# Learning Hub

One kid-friendly site for three games that already exist on their own:

| Menu | Game | Folder | Served at |
| --- | --- | --- | --- |
| Math | [math-fluency-game](https://github.com/xtabi2/math-fluency-game) | `apps/math` | `/math` |
| Reading | [sight-word-game](https://github.com/xtabi2/sight-word-game) | `apps/reading` | `/reading` |
| Adventure | [reading-progress-game](https://github.com/xtabi2/reading-progress-game) | `apps/adventure` | `/adventure` |

The home menu at `/` is where a child picks who is playing, then taps a game. Profiles live in `localStorage` on this site (`shared/`), so every game can read the same name and grade.

## Folder ownership

| Folder | Owner | Also owns |
| --- | --- | --- |
| `apps/home`, `shared/`, root config (`package.json`, `vercel.json`, `README.md`, `CONTRIBUTING.md`), CI (`.github/`) | Learning Hub | |
| `apps/reading` | Learning Hub | Original `sight-word-game` repo and site |
| `apps/math` | Learning Hub | Original `math-fluency-game` repo and site |
| `apps/adventure` | Head Developer (Reading Game Team) | |

Each owner edits only their folder. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Source commits

The original repos were not modified.

| App | Commit | How it was copied |
| --- | --- | --- |
| Math | `5279c3a7db29aa7f0065040d464b36866f22ff2f` | `git subtree` (that repo's history is this one commit) |
| Reading | `03a1f02b3258f0c836d0e2cbf154ec37593a3cc5` | `git subtree` (full `main` history) |
| Adventure | `4aa3069ef5498cddb36ca04a38ba0bc18bb14186` | Plain copy. Subtree was not practical: the clone Vercel could read was shallow and missing parents of `4ebb13d` and `92703a4`. |

## Build and run

Node.js 22 or newer. From the repo root:

```bash
npm install
npm test
npm run build
```

`npm test` runs every workspace test, including the games' existing suites and the shared profile tests. `npm run build` builds the home menu, both Vite games, and the Adventure Next.js app.

Local dev servers (each on its own port):

```bash
npm run dev:home       # http://localhost:5170
npm run dev:math       # http://localhost:5173/math/
npm run dev:reading    # http://localhost:5174/reading/  (Vite picks the next free port)
npm run dev:adventure  # http://localhost:3000/adventure
```

Adventure local data uses SQLite. Copy `apps/adventure/.env.example` to `apps/adventure/.env` and run `npm run db:setup -w reading-progress-game` once if you want the parent portal against a local database. `DATABASE_URL` defaults to `file:./dev.db` during `npm run build` when it is unset.

## Deploy (one Vercel Hobby project)

This repo deploys as **one** Vercel project using [Vercel Services](https://vercel.com/docs/services) (Beta, included on Hobby). Four services build from this monorepo and ship together. Public traffic is split in `vercel.json`:

- `/` → `apps/home` (static menu)
- `/math` → `apps/math` (Vite). The service strips the `/math` prefix; Vite `base` is `/math/`.
- `/reading` → `apps/reading` (Vite). Same pattern with base `/reading/`.
- `/adventure` → `apps/adventure` (Next.js). `basePath` is `/adventure`, so Next keeps the prefix. Art that used to live in `public/adventure/` now lives in `public/` so those `/adventure/...` image URLs still resolve.

### Vercel project settings

Create a **new** project named `learning-hub`. Do not attach this repo to the existing `math-fluency-game`, `sight-word-game`, or `reading-progress-game` projects. Those deployments stay as they are.

| Setting | Value |
| --- | --- |
| Framework preset | Other (Services reads `vercel.json`; do not force a single framework) |
| Root directory | repository root (`.`) |
| Build command | leave empty so each service uses `vercel.json` |
| Output directory | leave empty (per service) |
| Install command | leave empty (per service) |
| Node.js | 22.x or 24.x |

Hobby environment variables to copy from the existing **reading-progress-game** project if the parent portal should keep working (Turso free store, Resend free tier, no new paid services):

- `DATABASE_URL` (`file:./dev.db` is enough for Prisma's schema; runtime uses Turso when the next two are set)
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `AUTH_SECRET`
- `AUTH_COOKIE_SECURE` (`true` on Vercel HTTPS)
- `TURSO_AUTH_TOKEN` (sensitive; copy it from the reading-progress-game project — it cannot be read back from the API)
- `RESEND_API_KEY` and `EMAIL_FROM` if password-reset email should send (the API key is sensitive and must be copied by hand)

`AUTH_SECRET` on learning-hub is a new value used only to sign cookies for this site. `TURSO_DATABASE_URL` is already set. Until `TURSO_AUTH_TOKEN` is set, the build skips Turso migrations and the parent portal cannot reach the database. Math, Reading, and the home menu do not need those variables.

Sharing the existing Turso database means Adventure progress stays in the same place as the standalone game. The build runs `scripts/turso-migrate.ts --if-configured`, which skips when `TURSO_DATABASE_URL` is unset and is idempotent when it is set.

There is no paid AI API.

## Shared profile

`shared/index.js` stores kids in `localStorage` key `learning-hub.v1`:

- list, add, update, remove, and pick the current child (`name` + grade `K` | `1` | `2` | `3`)
- `recordProgress(childId, patch)` merges math, reading, and adventure progress
- string arrays such as `reading.masteredWords` and `reading.practicedWords` are unioned

Each game reads the current child:

- **Math** shows the name. There is no grade picker in this game. A round at 80% or better records `progress.math.level` as the operation (`add`, `sub`, `mul`, `div`, or `mixed`).
- **Reading** shows the name and highlights that grade on the deck picker (`K` maps to the kindergarten button). Flash cards add viewed words to `practicedWords`. A sentence that checks out adds those words to `masteredWords`.
- **Adventure** shows "Playing as …" in the header, prefills the parent-portal "Add a child" name and grade, and, when that portal child has the same name, copies story band and ship parts into `progress.adventure`. The portal's own accounts and database progress are unchanged.

A **Home** link in each game returns to `/`.

## What did not port unchanged

- Adventure git history before `4ebb13d` is not in this repo (shallow clone). The tree at `4aa3069` is.
- Adventure art files moved from `public/adventure/` to `public/` so Next `basePath: "/adventure"` serves the same URLs. Path strings in the game code are unchanged.
- Password-reset links include `/adventure`. Page guards (`requireUser`) redirect to `/adventure/login`. The old Edge middleware file is not in this copy: Vercel Services does not run Edge middleware, and those pages already check the session.
- Math still has its Docker/nginx files. The hub deploy does not use them.
- Math and Reading had no `localStorage` of their own. Their in-memory play is unchanged; hub progress is extra.
- Adventure still needs the env vars above for accounts, email, and Turso. Without them the game builds and the kid UI shell loads, but parent login and saved portal progress do not.

## Family PIN gate

Every page is behind a family PIN (`middleware.mjs`, Vercel Routing Middleware; logic in `pin-gate/gate.mjs`, tests in `pin-gate/gate.unit.mjs`). Same pattern as the Reading Progress Game gate.

- Env vars: `FAMILY_PIN` and `PIN_COOKIE_SECRET` (or `FAMILY_PIN_SECRET`), production + preview. If `FAMILY_PIN` is unset, the gate is off.
- Not signed in: redirect to `/pin?next=<path>`. The keypad sends the PIN to `POST /api/pin` once 4 digits are entered (`{pin, next}` returns `{ok, next}` or `{error, retryAfterMs}`). The PIN is checked with a constant-time compare.
- Success sets `family_pin` = `v1.<issuedAt>.<HMAC>` (HttpOnly, Secure, SameSite=Lax, 1 year). The key comes from the secret plus the PIN, so changing the PIN signs everyone out.
- Wrong tries: the first 3 are free, then waits of 1s, 2s, 4s and so on up to 30s, and a 15-minute lockout after 10. Tracked by a signed `family_pin_tries` cookie and a best-effort per-IP counter.
- Exempt: `/pin`, `/api/pin`, `_next`, favicon, and static files.
