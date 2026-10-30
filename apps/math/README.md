# Math Fluency Game

Flash-card math fact game for 1st/2nd graders (React + Vite + TypeScript). No login, no database.

**How to play:** pick Addition, Subtraction, Multiplication, Division or Mixed → answer 10 problems by tapping one of 4 answers → see accuracy, average time, and your 3 slowest facts.

Ranges: addition sums ≤ 20 · subtraction from ≤ 20, no negatives · multiplication factors 0–5 · division divisor 1–5, quotient 0–5 (whole numbers only).

## Develop
```
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest unit tests (src/logic.test.ts)
npm run build    # static output in dist/
```

## Deploy (Docker)
```
docker compose up -d --build   # serves on http://<host>:3100
```
Multi-stage Dockerfile runs tests + build in Node, then serves `dist/` with nginx on port 80 (mapped to host 3100).
