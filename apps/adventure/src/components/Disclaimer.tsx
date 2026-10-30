const FULL =
  "This app is a supplemental reading practice tool for families. It is not an official Big Walnut Local Schools curriculum, assessment, or intervention program, and it does not replace classroom instruction, Ohio Third Grade Reading Guarantee supports, or licensed programs such as those used by your school.";

export function Disclaimer({
  compact = false,
  oneLine = false,
}: {
  compact?: boolean;
  /** Kid screens: one line + "More" expander with the full text. */
  oneLine?: boolean;
}) {
  if (oneLine) {
    return (
      <details className="disclaimer-oneline rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-950">
        <summary>
          <strong>Home practice only.</strong> Not a school program.{" "}
          <span className="disclaimer-more">More</span>
        </summary>
        <p className="mt-1">{FULL}</p>
      </details>
    );
  }
  return (
    <aside
      className={`rounded-xl border border-amber-200 bg-amber-50 text-amber-950 ${
        compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
      }`}
    >
      <strong>Home practice only.</strong> This app is a supplemental reading
      practice tool for families. It is not an official Big Walnut Local Schools
      curriculum, assessment, or intervention program, and it does not replace
      classroom instruction, Ohio Third Grade Reading Guarantee supports, or
      licensed programs such as those used by your school.
    </aside>
  );
}
