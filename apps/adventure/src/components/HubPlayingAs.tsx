"use client";

import { useEffect, useState } from "react";
import { gradeLabel, hub } from "../../../../shared/index.js";

export function HubPlayingAs() {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const child = hub().getCurrentChild();
    if (!child) return;
    setLabel(`${child.name} · ${gradeLabel(child.grade)}`);
  }, []);

  if (!label) return null;
  return <span className="text-sm font-semibold text-pine-700">Playing as {label}</span>;
}
