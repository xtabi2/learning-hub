# Reading Progress Game

Progressive K-3 reading practice web app with a parent portal. Built as **supplemental home practice** aligned in spirit with Big Walnut Local Schools / Ohio Third Grade Reading Guarantee goals. It is **not** an official district curriculum, assessment, or intervention.

Original science-of-reading style activities only. Do **not** treat this as a copy of proprietary school reading programs.

## Disclaimer (required)

This software is for **family home practice**. It does not replace classroom instruction, Ohio Third Grade Reading Guarantee supports, school-provided interventions, or licensed instructional materials. Progress shown here is a home-lab signal, not an official school reading score.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- SQLite via Prisma
- Email/password parent auth (bcrypt-hashed credentials in SQLite)
- Vitest coverage for mastery gating

## Home lab run

```
cp .env.example .env
# set AUTH_SECRET to a long random string

npm install && npm run db:setup && npm run build && npm run start
```

Open http://localhost:3000

Also useful: `npm run dev` and `npm test`.

### Optional Docker (home lab / Portainer)

A `Dockerfile`, `docker-entrypoint.sh`, and `docker-compose.yml` are included.

```bash
export AUTH_SECRET="$(openssl rand -base64 48)"
docker compose up -d --build
```

- Publishes port `3000`
- Persists SQLite on named volume `reading-progress-data` mounted at `/data`
- Requires `AUTH_SECRET` (long random string) in the environment / Portainer stack env
- First boot initializes and seeds SQLite when `/data/dev.db` is missing
- Entrypoint runs `prisma db push` on every start so additive schema changes (e.g. `Child.isDemo`) apply to existing volumes

On knowledge via Portainer, bind `0.0.0.0:3000:3000` so the app is reachable on LAN and Tailscale (e.g. http://100.115.249.38:3000).

## MVP features

1. Parent sign up / login, add child (name, grade K-3)
2. Dashboard with weak strands, streak, and recent sessions
3. Child placement mini-quiz, then a skill path with **locked nodes until mastery**
4. Five pillars seeded for a demo path: phonemic awareness, phonics, fluency, vocabulary, comprehension
5. Printable parent progress report (/report/[childId])
6. Automated Vitest suite proving skills stay locked until >=80% over the last 10 items
7. **Try as kid / Demo mode** — signed-in parents can preview the kid UI via a synthetic `isDemo` child owned by the parent; demo attempts never update real children's mastery
8. **School baseline (parent-entered)** — parents can record school-reported starting bands per pillar so the skill path can skip ahead reasonably; labeled as home practice only (hidden for demo kids)
9. **Spoken kid instructions** — PlacementQuiz and skill QuizPlayer auto-read prompts aloud via on-device Web Speech (`SpeechSynthesisUtterance`), with a large speaker replay control and karaoke-style word highlight when `onboundary` is available (no cloud TTS keys)
10. **Kid celebration + flash cards** — correct QuizPlayer answers trigger a brief (~1.5s) unicorn/balloon/sparkle overlay; prompts sit in a large flash-card panel with touch-friendly option buttons
11. **Kid shell UX** — play placement / skill path / practice wrap in `kid-shell` (Material-inspired large targets, high-contrast focus/selected, enhanced flash cards); parent dashboard stays adult

12. **Space adventure (Star Nook hub + Nibbles companion + galaxies)** — kid home hub is **Star Nook** (dockyard moon); **Nibbles** is the goo mechanic/guide companion (`/nibbles-companion.png`); galaxy map 6–10 planets/grade; mastery awards parts; launch-ready celebration; forward travel needs ship upgrades / gear gates (stubs); parent labels unchanged
13. **Glowtrail Galaxy (first stretch)** — starting grade (K) galaxy display name is **Glowtrail Galaxy** (no grade label for kids); fixed Star Nook + 8 bible planets (Mistwhisper → Sparktown Dock) with kid hooks/gear; Nibbles TTS script pack (`planetScripts.ts`) for arrive/gear/start/win + galaxy arrive/map nudge/clear; parent skill notes stay metadata-only
Mastery constants in `src/lib/constants.ts`: `MASTERY_THRESHOLD=0.8`, `MASTERY_WINDOW=10`.

## Kid play UX (Material-inspired, research-based)

Play routes (`/play/...`, including demo-kid) wrap content in a `kid-shell` so kid UI can use larger, more playful styling while the **parent portal** (dashboard, nav, auth, baseline, reports) stays calmer and adult.

Principles applied (public Material accessibility + kid UX research guidance from Smashing/NN/g-style sources — **not** a copy of proprietary kids’ apps):

1. **Large tap targets** — Material min ~48px; kid option buttons prefer ~`min-h-16` / ~64–75px
2. **High contrast + clear selected/focus** — thick borders, focus-visible rings; selected options also show a ✓ so meaning is not color-alone
3. **Simple hierarchy / limited on-screen text** — TTS (`SpokenPrompt`) already speaks prompts; flash cards stay primary
4. **Playful but not cluttered** — rounded surfaces, soft elevation, generous 8–16px+ spacing under `kid-shell`
5. **Short, purposeful motion** — light Material-like press ripple on options; existing celebrations stay brief; `prefers-reduced-motion` respected
6. **Parent portal stays calmer** — only kid play routes use `kid-shell`; dashboard/nav/auth unchanged


## Space adventure theme (iteration 1)

Kid play routes use a **space adventure** fantasy layer on home hub **Star Nook** (catalog id `nibbles`):

- Companion **Nibbles** (green goo mechanic/guide) at `/nibbles-companion.png` (avatar fallback `/nibbles-avatar.png`), journey card, and spaceship-parts progress
- Completing a skill (mastery or placement/baseline synthetic mastery) awards a ship part
- Collecting enough parts shows **Ready for launch from Star Nook!** (next planet unlocks via galaxy map / ship tier)
- Kid UI copy uses adventure language (missions, power-ups, ship parts) — **no phonics/mastery jargon on kid screens**
- Parent dashboard and printable report keep real skill / pillar / mastery labels unchanged
- Progress stored in additive Prisma model `ChildAdventure` (`planetId`, `partsCollected`, `shipPartsJson`)

## Space adventure theme (iteration 2)

Multi-planet **galaxies** (one galaxy per grade K–3) with original cartoon planet / ship / gear art (no cuisine theming, no third-party IP):

- Each child gets a **deterministic 6–10 planet layout** seeded from `childId` (`planetCountForChild` / `buildPlanetOrder`)
- Grades **K and 1** always start on **Star Nook** (id `nibbles`) as hub/planet 1 in their galaxy
- **Nibbles companion** lines (`src/lib/nibblesCompanion.ts`) guide, pep-talk misses, celebrate clears, and explain gear/ship blockers in story terms (optional Story Star hint)
- Kid play shows a **galaxy / planet map**: revisit unlocked planets; **forward** hops need a higher **ship tier** (upgrade stubs); planets may show **“Need X to land”** gear gates (spacesuit / environment pieces)
- Additive `ChildAdventure` fields: `galaxyId`, `planetOrderJson`, `currentPlanetId`, `shipTier`, `gearOwnedJson`
- Parent competency / pillar labels stay parent-only; kid UI keeps fantasy theme names
- Placeholder art under `/public/adventure/` (SVG + optional PNG for Nibbles / starter ship)

## Nibbles companion + Star Nook (story bible)

- **Star Nook** = kid-facing home hub (cozy dockyard moon). Ship parks here between adventures. Long arc: Story Star dimming (hub copy).
- **Nibbles** = character companion (not a place). Morphs into temporary gear for gags until real gear unlocks.
- Companion UX: warm “we” guide lines; never shame misses; celebrate clears/upgrades; blockers as gear/ship story; optional Story Star / next-beat hints — not “practice reading”.
- Helpers: `pickNibblesLine`, `kidPlanetDisplayName`, `nibblesBlockerLine`, `nibblesMorphTeaser`, `nibblesArriveLine` / `nibblesWinLine` / `nibblesStartLine` in `src/lib/nibblesCompanion.ts`
- UI: `NibblesCompanionBanner` on kid play hub / map / quiz feedback; SpokenPrompt wired where a single short line is natural

## Glowtrail Galaxy (Creative Writer first-galaxy bible)

- Kid galaxy name for grade **K**: **Glowtrail Galaxy** (hide grade labels on kid UI)
- Layout: **Star Nook** hub + eight skill planets in fixed order — Mistwhisper, Bouncebloom, Echo Canyon, Bubbledeep, Sizzle Rock, Flipcliff, Softsnow Drift, Sparktown Dock
- Kid hooks + required gear (fog lantern helm, spring boots, echo headphones, scuba bubble, fire suit, sticky boots, hush scarf, sorter mitts)
- Parent skill notes (`parentSkillNote` / `parentPillarHint`) are catalog metadata only — never rendered on kid play
- Story stubs: clear all 8 → Story Star brightens; revisit free; forward after Sparktown needs ship upgrade; Nibbles celebration lines in `GLOWTRAIL_STORY_BEATS`
- TTS script pack: `src/lib/planetScripts.ts` — per-planet arrive / gearLocked / gearUnlocked / start / win plus galaxy arrive, map nudge, galaxy clear; play hub speaks galaxy arrive; quiz speaks win on mastery clear; item karaoke TTS unchanged
- **storyReadingBand** (`emerging|early|growing|fluent-ms`): placement sets START_BAND; Glowtrail climbs via grade midpoints to personal peak (cap fluent-ms); modular bookends + scenePacks + default planet beats; `runSeed` reserved for V1.5 pickers
- **Narrative book UX**: every Nibbles / planet / galaxy story beat uses `SpokenPrompt` — auto-read (when primary), karaoke word highlight, and **tap any word to hear that word again**; companion banners never render as text-only

## Post-MVP TODO (owned later by Reading Game agent)

- **AI coach (struggle detection + kid-safe hints)** detect repeated misses / long hesitations and offer short, age-appropriate hints.
- Coach must **never** skip or bypass mastery unlocks; hints only scaffold the current unlocked skill.
- Keep content original and family-safe; no proprietary program material.

## Known gaps

- Content depth is demo-scale (K-1 heavy); grades 2-3 need more nodes later
- No email verification / password reset yet
- Single-device SQLite home lab (not multi-device sync)
- Placement awards synthetic mastery only for strong *entry* skills; later nodes still require the mastery window
- Parent-entered **school baseline** bands (dashboard → School baseline) map coarse well-below→above bands into this app’s pillars with a documented home-lab heuristic — **not** official ODE/district/vendor cut scores; skills not covered still use normal mastery gates


## School baseline (parent-entered)

Parents can enter coarse per-pillar bands (well below / below / approaching / on grade / above) from the dashboard **School baseline** link when the school already evaluated the child. Optional free-text instrument label is for family reference only.

- Rows are labeled **School-reported / parent-entered**
- Mapping into this app’s skills is a transparent home-lab heuristic (see `src/lib/baseline.ts`) — **not** official cut scores and **not** a copy of proprietary assessment content
- Applying a baseline awards synthetic mastery for a prefix of each pillar’s skill chain (additive; does not revoke practiced mastery) and can mark placement complete so play starts on the skill path
- Demo (`isDemo`) children cannot use the baseline UI

## License / use

Private home-lab MVP for the `xtabi2/reading-progress-game` repository.

## Deploy on Vercel (Hobby)

Home-lab Docker is **unchanged**: it still uses `DATABASE_URL=file:/data/dev.db`, `prisma db push` on boot and the SQLite seed. The Turso path only activates when `TURSO_DATABASE_URL` is set.

Vercel's filesystem is read-only/ephemeral, so on Vercel the DB must be hosted: we use **Turso (libSQL, free tier)** through Prisma's driver adapter (`@prisma/adapter-libsql`). Provider stays `sqlite`; one cached `PrismaClient` per server instance (`src/lib/db.ts`).

### Environment variables (Vercel → Project → Settings → Environment Variables, Production + Preview)

| Name | Example | Required | Purpose |
|---|---|---|---|
| `TURSO_DATABASE_URL` | `libsql://reading-progress-<org>.turso.io` | **Required on Vercel** | Switches Prisma to the libSQL adapter. Unset ⇒ classic SQLite via `DATABASE_URL`. |
| `TURSO_AUTH_TOKEN` | `eyJhbGciOi...` | **Required on Vercel** (optional for `file:` URLs) | Turso DB token. |
| `DATABASE_URL` | `file:./dev.db` | Recommended | Ignored when Turso is set, but the Prisma schema references it; setting a dummy `file:` value avoids "env not found" errors. Required for local/Docker. |
| `AUTH_SECRET` | `openssl rand -base64 32` output | **Required** (≥16 chars) | Signs session JWTs (server + middleware). |
| `AUTH_URL` | `https://<project>.vercel.app` | Optional | Canonical public URL; also the base for password-reset links (`<AUTH_URL>/reset-password?token=...`, falls back to request host). If missing, falls back to `https://$VERCEL_PROJECT_PRODUCTION_URL` (production) / `https://$VERCEL_URL` (previews). `NEXTAUTH_URL` is accepted as a legacy alias. |
| `AUTH_COOKIE_SECURE` | `true` | Recommended on Vercel | `true`/`false` forces the session cookie `Secure` flag; if unset it's inferred from the URL above (https ⇒ Secure). Keep `false` on home-lab plain HTTP. |
| _(build)_ | | | `npm run build` runs `scripts/turso-migrate.ts --if-configured`: when `TURSO_DATABASE_URL` is set (e.g. on Vercel) pending `prisma/migrations/*` are applied idempotently before `next build`; otherwise it is skipped. |
| `RESEND_API_KEY` | `re_...` | Optional (needed for real reset emails) | Resend free-tier API key for "Forgot password?" emails (sent via plain `fetch`). Unset ⇒ reset link is logged server-side in dev only; users still get the generic response. |
| `EMAIL_FROM` | `Reading Game <onboarding@resend.dev>` | Optional | Sender. Default `onboarding@resend.dev` can only deliver to the Resend account owner's own email until you verify a domain. |
| `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_ENV` | (set by Vercel) | Automatic | Only used for the `AUTH_URL` fallback. |

### Turso setup (once)

```bash
curl -sSfL https://get.tur.so/install.sh | bash   # or: brew install tursodatabase/tap/turso
turso auth signup            # or: turso auth login
turso db create reading-progress
turso db show reading-progress --url          # -> TURSO_DATABASE_URL
turso db tokens create reading-progress       # -> TURSO_AUTH_TOKEN
```

### Migrate + seed the hosted DB (from your machine)

```bash
export TURSO_DATABASE_URL="libsql://reading-progress-<org>.turso.io"
export TURSO_AUTH_TOKEN="..."
npm run db:turso:migrate   # applies prisma/migrations/*/migration.sql; idempotent (tracked in _turso_migrations)
npm run db:turso:seed      # ONLY on a fresh DB: the seed deletes skills/items/attempts/sessions/progress before re-inserting
```

Schema changes later: edit `schema.prisma`, then create the next migration folder and apply it:

```bash
mkdir prisma/migrations/0002_<name>
npm run -s db:migration:new > prisma/migrations/0002_<name>/migration.sql
npm run db:turso:migrate
```

(Docker keeps using `prisma db push`, so it is unaffected by the migrations folder.)

### Deploy

Import the repo in Vercel (framework: Next.js, defaults). `npm install` runs `postinstall: prisma generate` and `npm run build` runs `prisma generate && next build`; nothing in the build touches a database. No server route writes to the local filesystem.
