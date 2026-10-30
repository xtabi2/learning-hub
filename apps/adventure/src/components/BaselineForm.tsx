"use client";

import { useActionState } from "react";
import {
  saveBaselineAction,
  type BaselineActionState,
} from "@/app/actions/baseline";
import {
  BASELINE_BANDS,
  BASELINE_BAND_LABELS,
  BASELINE_SOURCE_LABEL,
  PILLAR_LABELS,
  PILLARS,
  type BaselineBand,
  type Pillar,
} from "@/lib/constants";

type Props = {
  childId: string;
  childName: string;
  initialBands: Partial<Record<Pillar, BaselineBand>>;
  initialInstrumentLabel?: string | null;
  initialNotes?: string | null;
};

export function BaselineForm({
  childId,
  childName,
  initialBands,
  initialInstrumentLabel,
  initialNotes,
}: Props) {
  const [state, formAction, pending] = useActionState(
    saveBaselineAction,
    null as BaselineActionState,
  );

  return (
    <form action={formAction} className="card space-y-5">
      <input type="hidden" name="childId" value={childId} />
      <div>
        <h1 className="font-display text-3xl text-pine-900">
          School baseline for {childName}
        </h1>
        <p className="mt-2 text-sm text-pine-700">
          Enter known school assessment results as coarse bands so home practice
          can start closer to the right skill level. This is{" "}
          <strong>{BASELINE_SOURCE_LABEL}</strong> data for this app only — not
          an official ODE, district, or vendor score.
        </p>
      </div>

      <aside className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
        <strong>Home practice placement only.</strong> Do not treat these bands
        as official cut scores. We map them with a transparent home-lab
        heuristic into this app&apos;s pillars (PA, phonics, fluency, vocabulary,
        comprehension). Skills not covered by the baseline still require normal
        mastery gates. Raising a band can award more starting mastery; lowering
        a band does not revoke mastery already earned.
      </aside>

      <label className="block space-y-1 text-sm">
        <span>Instrument label (optional, free text)</span>
        <input
          className="input"
          name="instrumentLabel"
          placeholder="e.g. Fall school reading check"
          defaultValue={initialInstrumentLabel ?? ""}
          maxLength={120}
        />
        <span className="text-xs text-pine-600">
          Generic names only for your reference — no proprietary score tables.
        </span>
      </label>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-wide text-pine-600">
          Per-pillar bands
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {PILLARS.map((pillar) => (
            <label key={pillar} className="block space-y-1 text-sm">
              <span>{PILLAR_LABELS[pillar]}</span>
              <select
                className="input"
                name={`band_${pillar}`}
                defaultValue={initialBands[pillar] ?? ""}
              >
                <option value="">— skip / unknown —</option>
                {BASELINE_BANDS.map((band) => (
                  <option key={band} value={band}>
                    {BASELINE_BAND_LABELS[band]}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block space-y-1 text-sm">
        <span>Notes (optional)</span>
        <textarea
          className="input min-h-[80px]"
          name="notes"
          defaultValue={initialNotes ?? ""}
          maxLength={500}
          placeholder="Anything helpful for your family (optional)"
        />
      </label>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button className="btn-primary w-full" disabled={pending} type="submit">
        {pending ? "Saving baseline..." : "Save baseline & update skill path"}
      </button>
    </form>
  );
}
