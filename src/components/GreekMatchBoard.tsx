import { useMemo, useRef, useState, type ReactNode } from "react";

type PhraseTuple = readonly [id: string, text: string];

export type GreekMatchBoardProps = {
  phrases: readonly PhraseTuple[];
  translations: readonly PhraseTuple[];
  pairs: Record<string, string>;
  onAssign: (phraseId: string, translationId: string) => void;
  onRemove: (phraseId: string) => void;
};

function highlightedText(text: string, term: string): ReactNode {
  if (!term) return text;

  const source = text.toLocaleLowerCase();
  const query = term.toLocaleLowerCase();
  const parts: ReactNode[] = [];
  let cursor = 0;
  let match = source.indexOf(query);

  while (match !== -1) {
    if (match > cursor) parts.push(text.slice(cursor, match));
    parts.push(
      <mark className="greek-evidence__highlight" key={`${match}-${text.slice(match, match + term.length)}`}>
        {text.slice(match, match + term.length)}
      </mark>,
    );
    cursor = match + term.length;
    match = source.indexOf(query, cursor);
  }

  if (cursor === 0) return text;
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

export function GreekMatchBoard({
  phrases,
  translations,
  pairs,
  onAssign,
  onRemove,
}: GreekMatchBoardProps) {
  const evidenceRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState("");
  const [fragmentInput, setFragmentInput] = useState("");
  const [highlightTerm, setHighlightTerm] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null);
  const [draggedTranslation, setDraggedTranslation] = useState<string | null>(null);

  const translationById = useMemo(
    () => Object.fromEntries(translations),
    [translations],
  );
  const assignedTranslationIds = useMemo(
    () => new Set(Object.values(pairs)),
    [pairs],
  );

  function captureSelection() {
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    const evidence = evidenceRef.current;

    if (!selection || selection.isCollapsed || !range || !evidence) return;
    if (!evidence.contains(range.commonAncestorContainer)) return;

    const nextSelection = selection.toString().trim();
    if (!nextSelection) return;
    setSelectedText(nextSelection);
    setFragmentInput(nextSelection);
    setCopyStatus("");
  }

  function applyHighlight(term: string) {
    const normalizedTerm = term.trim();
    if (!normalizedTerm) return;
    setHighlightTerm(normalizedTerm);
    setCopyStatus(`Highlighted matches for “${normalizedTerm}”.`);
  }

  async function copySelection() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(selectedText);
      setCopyStatus(`Copied “${selectedText}” to the clipboard.`);
    } catch {
      setCopyStatus("Could not copy automatically. Keep the text selected and use your device’s copy command.");
    }
  }

  function assignToPhrase(phraseId: string, translationId: string | null) {
    if (!translationId || !(translationId in translationById)) return;
    onAssign(phraseId, translationId);
    setSelectedTranslation(null);
    setDraggedTranslation(null);
  }

  return (
    <div className="greek-match-board">
      <section className="greek-evidence" aria-labelledby="greek-evidence-title">
        <div className="greek-evidence__heading">
          <div>
            <p className="kicker">Evidence</p>
            <h3 id="greek-evidence-title">Compare words and recurring fragments</h3>
          </div>
          {highlightTerm && (
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setHighlightTerm("");
                setCopyStatus("Highlights cleared.");
              }}
            >
              Clear highlight
            </button>
          )}
        </div>

        <div
          className="greek-evidence__columns"
          ref={evidenceRef}
          onMouseUp={captureSelection}
          onKeyUp={captureSelection}
          onTouchEnd={captureSelection}
        >
          <section className="greek-evidence__column" aria-labelledby="greek-phrases-title">
            <h4 id="greek-phrases-title">Ancient Greek</h4>
            <ol className="greek-evidence__list">
              {phrases.map(([id, phrase]) => (
                <li key={id}>
                  <span className="greek-evidence__id" aria-hidden="true">{id}</span>
                  <span lang="grc-Latn">{highlightedText(phrase, highlightTerm)}</span>
                </li>
              ))}
            </ol>
          </section>
          <section className="greek-evidence__column" aria-labelledby="greek-translations-title">
            <h4 id="greek-translations-title">Unordered English translations</h4>
            <ul className="greek-evidence__list">
              {translations.map(([id, translation]) => (
                <li key={id}>
                  <span className="greek-evidence__id">{id}</span>
                  <span>{highlightedText(translation, highlightTerm)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {selectedText && (
          <div className="greek-evidence__actions" aria-label={`Actions for selected text: ${selectedText}`}>
            <span className="greek-evidence__selection">Selected: “{selectedText}”</span>
            <button className="button button--quiet" type="button" onClick={() => applyHighlight(selectedText)}>
              Highlight matches
            </button>
            <button className="button button--quiet" type="button" onClick={copySelection}>
              Copy
            </button>
          </div>
        )}
        <form className="greek-evidence__finder" onSubmit={(event) => {
          event.preventDefault();
          applyHighlight(fragmentInput);
        }}>
          <label htmlFor="greek-fragment">Highlight a fragment across the evidence</label>
          <div>
            <input
              id="greek-fragment"
              value={fragmentInput}
              onChange={(event) => setFragmentInput(event.target.value)}
              placeholder="Try cyr or merchant"
            />
            <button className="button button--quiet" type="submit" disabled={!fragmentInput.trim()}>Highlight</button>
          </div>
        </form>
        <p className="sr-only" role="status" aria-live="polite">{copyStatus}</p>
      </section>

      <section className="greek-workspace" aria-labelledby="greek-workspace-title">
        <div className="greek-workspace__heading">
          <div>
            <p className="kicker">Matching workspace</p>
            <h3 id="greek-workspace-title">Place each translation beside its phrase</h3>
          </div>
          <p className="greek-workspace__instructions" id="greek-match-instructions">
            Drag a lettered tile to a numbered row, or select a tile and then choose a row.
          </p>
        </div>

        <div className="greek-translation-tray" aria-label="English translation tiles">
          {translations.map(([id, translation]) => {
            const isSelected = selectedTranslation === id;
            const isAssigned = assignedTranslationIds.has(id);
            return (
              <button
                className={`greek-translation-tile${isSelected ? " is-selected" : ""}${isAssigned ? " is-assigned" : ""}`}
                type="button"
                key={id}
                draggable
                aria-pressed={isSelected}
                aria-describedby="greek-match-instructions"
                onClick={() => setSelectedTranslation(isSelected ? null : id)}
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", id);
                  event.dataTransfer.effectAllowed = "move";
                  setDraggedTranslation(id);
                }}
                onDragEnd={() => setDraggedTranslation(null)}
              >
                <span className="greek-translation-tile__id">{id}</span>
                <span>{translation}</span>
                {isAssigned && <span className="sr-only">Currently assigned</span>}
              </button>
            );
          })}
        </div>

        <ol className="greek-match-slots" aria-label="Ancient Greek matching rows">
          {phrases.map(([phraseId, phrase]) => {
            const translationId = pairs[phraseId];
            const translation = translationId ? translationById[translationId] : undefined;
            return (
              <li
                className={`greek-match-slot${draggedTranslation ? " is-drop-ready" : ""}`}
                key={phraseId}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  assignToPhrase(phraseId, event.dataTransfer.getData("text/plain") || draggedTranslation);
                }}
              >
                <button
                  className="greek-match-slot__target"
                  type="button"
                  onClick={() => assignToPhrase(phraseId, selectedTranslation)}
                  aria-label={selectedTranslation
                    ? `Assign translation ${selectedTranslation} to phrase ${phraseId}`
                    : `Phrase ${phraseId}${translationId ? ` is paired with translation ${translationId}` : " is unpaired"}. Select a translation tile first.`}
                  aria-describedby={`greek-phrase-${phraseId}`}
                >
                  <span className="greek-match-slot__phrase-id">{phraseId}</span>
                  <span id={`greek-phrase-${phraseId}`} lang="grc-Latn">{phrase}</span>
                  <span className="greek-match-slot__assignment">
                    {translationId && translation
                      ? <><b>{phraseId} → {translationId}</b><span>{translation}</span></>
                      : <span>Choose a translation</span>}
                  </span>
                </button>
                {translationId && (
                  <button
                    className="text-button greek-match-slot__remove"
                    type="button"
                    onClick={() => onRemove(phraseId)}
                    aria-label={`Remove translation ${translationId} from phrase ${phraseId}`}
                  >
                    Remove
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

export default GreekMatchBoard;
