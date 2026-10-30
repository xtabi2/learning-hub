"use client";

import { useEffect, useState } from "react";
import { hub } from "../../../../shared/index.js";

export function HubPlayingAs() {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const child = hub().getCurrentChild();
    if (!child) return;
    const grade = child.grade === "K" ? "Kindergarten" : `Grade ${child.grade}`;
    setLabel(`${child.name} · ${grade}`);
  }, []);

  if (!label) return null;
  return <span className="text-sm font-semibold text-pine-700">Playing as {label}</span>;
}
