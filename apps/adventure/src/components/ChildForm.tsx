"use client";

import { useActionState, useEffect, useState } from "react";
import { hub, type Child } from "../../../../shared/index.js";
import { addChildAction } from "@/app/actions/children";
import { GRADES } from "@/lib/constants";

export function ChildForm() {
  const [state, formAction, pending] = useActionState(addChildAction, null);
  const [prefill, setPrefill] = useState<Child | null>(null);

  useEffect(() => {
    setPrefill(hub().getCurrentChild());
  }, []);

  return (
    <form key={prefill?.id ?? "blank"} action={formAction} className="card mx-auto max-w-md space-y-4">
      <h1 className="font-display text-3xl text-pine-900">Add a child</h1>
      <p className="text-sm text-pine-700">
        Create a play profile for grades K–3. Placement and practice stay on
        this device&apos;s local database for your home lab.
      </p>
      <label className="block space-y-1 text-sm">
        <span>Child&apos;s first name</span>
        <input className="input" name="name" defaultValue={prefill?.name ?? ""} required />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Grade</span>
        <select className="input" name="grade" defaultValue={prefill?.grade ?? "K"} required>
          {GRADES.map((grade) => (
            <option key={grade} value={grade}>
              {grade === "K" ? "Kindergarten" : `Grade ${grade}`}
            </option>
          ))}
        </select>
      </label>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button className="btn-primary w-full" disabled={pending} type="submit">
        {pending ? "Saving..." : "Save child"}
      </button>
    </form>
  );
}
