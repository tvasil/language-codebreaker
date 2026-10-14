import { useId } from "react";

type HintControlProps = {
  hints: readonly string[];
  shown: number;
  onReveal: () => void;
  idPrefix?: string;
};

export function HintControl({
  hints,
  shown,
  onReveal,
  idPrefix,
}: HintControlProps) {
  const generatedId = useId().replaceAll(":", "");
  const prefix = idPrefix ?? `hints-${generatedId}`;
  const titleId = `${prefix}-title`;
  const listId = `${prefix}-list`;
  const visibleCount = Math.max(0, Math.min(shown, hints.length));

  return (
    <section className="hint-panel" aria-labelledby={titleId}>
      <div className="hint-heading">
        <div>
          <p className="kicker" id={titleId}>Hints</p>
          <p className="hint-count">
            {visibleCount} of {hints.length} hints revealed
          </p>
        </div>
        <button
          className="button button--quiet"
          type="button"
          onClick={onReveal}
          disabled={visibleCount === hints.length}
          aria-controls={visibleCount > 0 ? listId : undefined}
          aria-expanded={visibleCount > 0}
        >
          {visibleCount ? "Another hint" : "Need a hint?"}
        </button>
      </div>
      {visibleCount > 0 && (
        <ol className="hint-list" id={listId}>
          {hints.slice(0, visibleCount).map((hint, index) => (
            <li key={`${index}-${hint}`}>{hint}</li>
          ))}
        </ol>
      )}
    </section>
  );
}
