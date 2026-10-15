import { useRef, useState, type ReactNode } from "react";

type PhraseTuple = readonly [id: string, text: string];

export type GreekMatchBoardProps = {
  phrases: readonly PhraseTuple[];
  translations: readonly PhraseTuple[];
  pairs: Record<string, string>;
  onMove: (phraseId: string, translationId: string) => void;
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
    parts.push(<mark className="greek-board__highlight" key={`${match}-${cursor}`}>{text.slice(match, match + term.length)}</mark>);
    cursor = match + term.length;
    match = source.indexOf(query, cursor);
  }
  if (cursor === 0) return text;
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

export function GreekMatchBoard({ phrases, translations, pairs, onMove }: GreekMatchBoardProps) {
  const boardRef = useRef<HTMLOListElement>(null);
  const [fragment, setFragment] = useState("");
  const [highlight, setHighlight] = useState("");
  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null);
  const [draggedTranslation, setDraggedTranslation] = useState<string | null>(null);
  const translationsById = Object.fromEntries(translations);

  function move(phraseId: string, translationId: string | null) {
    if (!translationId) return;
    onMove(phraseId, translationId);
    setSelectedTranslation(null);
    setDraggedTranslation(null);
  }

  function useSelectedText() {
    const selection = window.getSelection();
    const range = selection && selection.rangeCount ? selection.getRangeAt(0) : null;
    if (!selection || selection.isCollapsed || !range || !boardRef.current?.contains(range.commonAncestorContainer)) return;
    const text = selection.toString().trim();
    if (text) {
      setFragment(text);
      setHighlight(text);
    }
  }

  return (
    <section className="greek-board" aria-labelledby="greek-board-title">
      <div className="greek-board__header">
        <div>
          <p className="kicker">Matching board</p>
          <h3 id="greek-board-title">Match the rows</h3>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); setHighlight(fragment.trim()); }}>
          <label htmlFor="greek-fragment">Highlight a fragment</label>
          <div>
            <input id="greek-fragment" value={fragment} onChange={(event) => setFragment(event.target.value)} placeholder="Try cyr or merchant" />
            <button className="button button--quiet" type="submit" disabled={!fragment.trim()}>Highlight</button>
            {highlight && <button className="text-button" type="button" onClick={() => { setHighlight(""); setFragment(""); }}>Clear</button>}
          </div>
        </form>
      </div>
      <p className="greek-board__instructions" id="greek-move-help">Drag a tile by its handle and drop it on another row. For keyboard use, select a handle, then choose a row number. Moving a tile swaps the two translations.</p>
      <div className="greek-board__column-headings" aria-hidden="true"><span>Ancient Greek</span><span>English translation</span></div>
      <ol ref={boardRef} className="greek-board__rows" onMouseUp={useSelectedText} onTouchEnd={useSelectedText}>
        {phrases.map(([phraseId, phrase]) => {
          const translationId = pairs[phraseId];
          const translation = translationsById[translationId];
          const selected = selectedTranslation === translationId;
          return (
            <li
              className={draggedTranslation ? "is-drop-ready" : ""}
              key={phraseId}
              onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }}
              onDrop={(event) => { event.preventDefault(); move(phraseId, event.dataTransfer.getData("text/plain") || draggedTranslation); }}
            >
              <button
                className="greek-board__row-number"
                type="button"
                disabled={!selectedTranslation}
                onClick={() => move(phraseId, selectedTranslation)}
                aria-label={selectedTranslation ? `Move translation ${selectedTranslation} to row ${phraseId}` : `Row ${phraseId}`}
              >{phraseId}</button>
              <span className="greek-board__phrase" lang="grc-Latn">{highlightedText(phrase, highlight)}</span>
              <div className={`greek-board__tile${selected ? " is-selected" : ""}`}>
                <button
                  className="greek-board__handle"
                  type="button"
                  draggable
                  aria-pressed={selected}
                  aria-describedby="greek-move-help"
                  aria-label={`Move translation ${translationId}`}
                  onClick={() => setSelectedTranslation(selected ? null : translationId)}
                  onDragStart={(event) => { event.dataTransfer.setData("text/plain", translationId); event.dataTransfer.effectAllowed = "move"; setDraggedTranslation(translationId); }}
                  onDragEnd={() => setDraggedTranslation(null)}
                >⠿</button>
                <span className="greek-board__translation-id">{translationId}</span>
                <span>{highlightedText(translation, highlight)}</span>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="greek-board__selection-note">Tip: select text directly in either column to highlight every matching fragment.</p>
    </section>
  );
}
