# GlowTrails visual assets

Bluey-energy original. Cream / pine / sky / gold / lime / warm orange. Tidal spreads use soft underwater teal. **No gold dashed hotspot rings** — hides are camouflaged silhouettes with ≥64px soft hit.

Painted as SVG, rasterized with `rsvg-convert`.

## Runtime paths

Mirror this folder under the adventure pack:

```
/adventure/glowtrails/tree-home.png
/adventure/glowtrails/fruit-glowtrails.png
/adventure/glowtrails/hud-ship.png
/adventure/glowtrails/hud-starmap.png
/adventure/glowtrails/tidal/spread-oxygen-tank.png
/adventure/glowtrails/tidal/spread-dorsal-fin.png
/adventure/glowtrails/tidal/spread-sonar.png
/adventure/glowtrails/parts/oxygen-tank-idle.png
/adventure/glowtrails/parts/oxygen-tank-earned.png
/adventure/glowtrails/parts/dorsal-fin-idle.png
/adventure/glowtrails/parts/dorsal-fin-earned.png
/adventure/glowtrails/parts/sonar-idle.png
/adventure/glowtrails/parts/sonar-earned.png
```

SVG sources sit beside each PNG (same stem). Prefer PNG at runtime; keep SVG for retouch.

| Asset | Size | Notes |
|---|---|---|
| `tree-home` | 1024 | Full-screen Story Tree. One glowing GlowTrails fruit + label chip. |
| `fruit-glowtrails` | 512 | Juicy gold fruit mark, soft glow, readable “GlowTrails” label. |
| `hud-ship` | 1024 | Pilot interior chrome. Center bezel is the star-map screen slot. |
| `hud-starmap` | 1024 | Soft planet dots; **Tidal** highlighted (teal/aqua glow). Others dimmer. |
| `tidal/spread-*` | 1024 | One hide per spread. Desktop: full bleed / 2-page crop. Mobile: same art. |
| `parts/*-{idle,earned}` | 256 | Idle = muted silhouette on gray circle. Earned = gold rim + color fill. |

## Soft-hit centers (HD)

Percent of full **1024** art (`leftPct` / `topPct`). Use a ≥64×64 (prefer ~80–100) soft hit around the center — not a gold ring.

| Hide | Asset | leftPct | topPct | Zone |
|---|---|---|---|---|
| GlowTrails fruit | `tree-home` | **49** | **47** | Glowing fruit on the right of the canopy (label chip is *not* the hit). |
| oxygen-tank | `tidal/spread-oxygen-tank` | **60** | **68** | Sand-colored tank nestled as a turret in the sandcastle + coral cluster. |
| dorsal-fin | `tidal/spread-dorsal-fin` | **54** | **38** | Ship fin floating among the story sharks — **not** on a nose. Star + orange tip is the tell. |
| sonar | `tidal/spread-sonar` | **73** | **72** | Disc with faint concentric rings mixed into the gold pile by the wreck. |

Approximate pixel centers on 1024 art: fruit (502, 478) · tank (616, 696) · fin (552, 388) · sonar (744, 732).

## Hide notes for HD

- Hints already nudge zones only (sandcastle / shark group / gold). Do not encode exact pixels in copy.
- Tank: same sand as the castle; valve reads as a turret cap on a second look.
- Fin: gray-cream toy triangle among real dorsal fins; cream/star/orange tip distinguishes it.
- Sonar: gold-matched disc; rings + tiny pip distinguish it from coins.
- Friendly story sharks (round eyes, blush, no teeth). Cute dress-up crab + lobster pirates (not menacing).
- Part stickers must **not** reveal the exact hide placement — they show the clear part shape only.

## Palette

cream `#FBF6EE` · pine `#1d3023` · sky `#3A82C4` / `#38bdf8` · gold `#e4b84a` / `#FFC107` · Nibbles lime `#A4D65E` · warm orange `#E88E35` · Tidal teal `#14b8a6` / `#5eead4`
