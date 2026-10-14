import { useMemo, useState } from "react";
import {
  brailleDecode,
  brailleMatchAnswers,
  brailleSequences,
  brailleWrite,
  greekMatchAnswers,
  greekPhrases,
  greekTranslations,
  tenji,
  type Dots,
} from "./content/puzzles";
import {
  evaluateMapping,
  evaluateTextAnswers,
  sameDots,
  type CheckState,
} from "./engine/evaluators";
import { segmentGraphemes } from "./engine/unicode";

type Round = 0 | 1 | 2;

const rounds = [
  { eyebrow: "Deciphering · Easy", title: "Countries in Disguise" },
  { eyebrow: "Matching · Easy", title: "A Donkey in Every House" },
  { eyebrow: "Writing systems · Easy", title: "Tenji Karaoke" },
] as const;

const feedbackCopy: Record<CheckState, string> = {
  idle: "",
  incomplete: "There are still a few blanks to complete.",
  incorrect: "Not quite. Compare the repeated forms, or reveal another hint.",
  correct: "Case solved. Your deductions fit every piece of evidence.",
};

function Feedback({ state }: { state: CheckState }) {
  return (
    <p className={`feedback feedback--${state}`} role="status" aria-live="polite">
      {feedbackCopy[state]}
    </p>
  );
}

function HintControl({ hints }: { hints: readonly string[] }) {
  const [shown, setShown] = useState(0);
  return (
    <section className="hint-panel" aria-labelledby="hint-title">
      <div className="hint-heading">
        <div>
          <p className="kicker" id="hint-title">Field notes</p>
          <p className="hint-count">{shown} of {hints.length} observations revealed</p>
        </div>
        <button
          className="button button--quiet"
          type="button"
          onClick={() => setShown((count) => Math.min(count + 1, hints.length))}
          disabled={shown === hints.length}
        >
          {shown ? "Another nudge" : "Need a nudge?"}
        </button>
      </div>
      {shown > 0 && (
        <ol className="hint-list">
          {hints.slice(0, shown).map((hint) => <li key={hint}>{hint}</li>)}
        </ol>
      )}
    </section>
  );
}

function ScratchSpace() {
  return (
    <details className="scratch">
      <summary>Scratch space <span>Optional notes, never graded</span></summary>
      <label className="sr-only" htmlFor="scratch-notes">Private scratch notes</label>
      <textarea id="scratch-notes" rows={5} placeholder="Record a pattern, a possible meaning, or a question…" />
    </details>
  );
}

function Reveal({ children, onNext, final = false }: { children: React.ReactNode; onNext: () => void; final?: boolean }) {
  return (
    <section className="reveal">
      <p className="kicker">The decisive pattern</p>
      {children}
      <button className="button button--primary" type="button" onClick={onNext}>
        {final ? "Return to case one" : "Open the next case"} <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

function PuzzleShell({ round, onRoundChange, problem, answer }: {
  round: Round;
  onRoundChange: (round: Round) => void;
  problem: React.ReactNode;
  answer: React.ReactNode;
}) {
  const meta = rounds[round];
  return (
    <>
      <header className="topbar">
        <button className="wordmark" type="button" onClick={() => onRoundChange(0)}>Crack the Language</button>
        <nav aria-label="Case navigation" className="case-nav">
          {rounds.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={round === index ? "is-current" : ""}
              aria-current={round === index ? "step" : undefined}
              onClick={() => onRoundChange(index as Round)}
              aria-label={`Open case ${index + 1}: ${item.title}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </nav>
        <span className="prototype-tag">Non-commercial prototype</span>
      </header>
      <main className="page-shell">
        <header className="case-intro">
          <p className="eyebrow">Case {String(round + 1).padStart(2, "0")} · {meta.eyebrow}</p>
          <h1>{meta.title}</h1>
        </header>
        <div className="case-grid">
          <article className="paper problem-card">{problem}</article>
          <aside className="paper answer-card" aria-label="Your deduction">{answer}</aside>
        </div>
        <footer className="source-note">
          <strong>Independent educational prototype:</strong> Not affiliated with or endorsed by IOL, OBL, or NACLO. A puzzle reuse permission request is pending.
        </footer>
      </main>
    </>
  );
}

const georgianRows = [
  ["ბრაზილია", "Brazil"],
  ["პერუ", "Peru"],
  ["ურუგვაი", "Uruguay"],
  ["არგენტინა", null],
  ["კოლუმბია", null],
] as const;

function useGeorgianRound({ onNext }: { onNext: () => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [answers, setAnswers] = useState(["", ""]);
  const [state, setState] = useState<CheckState>("idle");

  function check() {
    setState(evaluateTextAnswers(answers, [["Argentina"], ["Colombia"]], true));
  }

  return {
    problem: (
      <>
        <p className="lede">These South American country names are written in Georgian. Work out the two missing English names.</p>
        <div className="evidence-table georgian-evidence" aria-label="Georgian country name evidence">
          {georgianRows.map(([word, translation]) => (
            <div className="evidence-row" key={word}>
              <div className="script-word" lang="ka" aria-label={word}>
                {segmentGraphemes(word).map((grapheme, index) => (
                  <button
                    type="button"
                    className={active === grapheme ? "character is-marked" : "character"}
                    key={`${grapheme}-${index}`}
                    onClick={() => setActive(active === grapheme ? null : grapheme)}
                    aria-pressed={active === grapheme}
                    aria-label={`${grapheme}, character ${index + 1} of ${word.length}`}
                  >{grapheme}</button>
                ))}
              </div>
              <span className={translation ? "translation" : "translation translation--unknown"}>
                {translation ?? "Unknown"}
              </span>
            </div>
          ))}
        </div>
        <div className="annotation-help">
          <span>Choose a Georgian character to mark every match.</span>
          <button className="text-button" type="button" onClick={() => setActive(null)} disabled={!active}>Clear marks</button>
        </div>
        <HintControl hints={[
          "Begin with Peru and Uruguay: their lengths give you a useful foothold.",
          "Uruguay repeats the u sound. Which Georgian character appears in the matching positions?",
          "The repeated უ shows that the words run from left to right.",
          "Transfer the letters you now know into the two unknown rows and look for country-name shapes.",
        ]} />
        <ScratchSpace />
        <p className="attribution">
          Adapted from <cite>Georgian Countries</cite> by Bruno L’Astorina, Brazilian Linguistics Olympiad 2016; republished in IOL Sample Problems. © respective rights holders. Non-commercial educational prototype; permission request pending.{" "}
          <a href="https://ioling.org/booklets/samples.en.pdf">Official source</a>.
        </p>
      </>
    ),
    answer: (
      <>
        <h2>Your deduction</h2>
        <div className="answer-fields">
          {["არგენტინა", "კოლუმბია"].map((word, index) => (
            <label key={word}>
              <span className="answer-prompt"><b lang="ka">{word}</b> means…</span>
              <input
                value={answers[index]}
                onChange={(event) => { const next = [...answers]; next[index] = event.target.value; setAnswers(next); setState("idle"); }}
                autoComplete="off"
                spellCheck={false}
                placeholder="Country name in English"
              />
            </label>
          ))}
        </div>
        <button className="button button--primary button--wide" type="button" onClick={check}>Check answers <span aria-hidden="true">→</span></button>
        <Feedback state={state} />
        {state === "correct" && (
          <Reveal onNext={onNext}>
            <p><b>Peru</b> and <b>Uruguay</b> establish direction and the repeating <span lang="ka">უ</span> sound. Those correspondences turn <span lang="ka">არგენტინა</span> into <b>Argentina</b> and <span lang="ka">კოლუმბია</span> into <b>Colombia</b>.</p>
          </Reveal>
        )}
      </>
    ),
  };
}

function useGreekRound({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState(["", ""]);
  const [state, setState] = useState<CheckState>("idle");

  const pairedTranslationIds = new Set(Object.values(pairs));
  const translationText = Object.fromEntries(greekTranslations);

  function assign(translationId: string) {
    if (!selected) return;
    setPairs((current) => {
      const next = Object.fromEntries(Object.entries(current).filter(([, value]) => value !== translationId));
      next[selected] = translationId;
      return next;
    });
    setSelected(null);
    setState("idle");
  }

  function check() {
    const pairState = evaluateMapping(pairs, greekMatchAnswers);
    const textState = evaluateTextAnswers(
      answers,
      [["hoi tōn emporōn oicoi"], ["hoi tu dulu onoi"]],
      true,
    );
    setState(pairState === "incomplete" || textState === "incomplete" ? "incomplete" : pairState === "correct" && textState === "correct" ? "correct" : "incorrect");
  }

  return {
    problem: (
      <>
        <p className="lede">Match the Ancient Greek phrases to their unordered translations. Then use the pattern to construct two new phrases.</p>
        <div className="matching-grid" aria-label="Phrase matching activity">
          <section>
            <h3>Ancient Greek</h3>
            <div className="match-list">
              {greekPhrases.map(([id, phrase]) => (
                <button
                  type="button"
                  className={`match-item ${selected === id ? "is-selected" : ""} ${pairs[id] ? "is-paired" : ""}`}
                  key={id}
                  aria-pressed={selected === id}
                  onClick={() => setSelected(selected === id ? null : id)}
                >
                  <span className="match-id">{id}</span>
                  <span lang="grc-Latn">{phrase}</span>
                  {pairs[id] && <small>Paired with {pairs[id]} · {translationText[pairs[id]]}</small>}
                </button>
              ))}
            </div>
          </section>
          <section>
            <h3>English</h3>
            <div className="match-list">
              {greekTranslations.map(([id, translation]) => (
                <button
                  type="button"
                  className={`match-item ${pairedTranslationIds.has(id) ? "is-paired" : ""}`}
                  key={id}
                  disabled={!selected}
                  onClick={() => assign(id)}
                >
                  <span className="match-id">{id}</span>
                  <span>{translation}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
        <p className="interaction-note">Select a Greek phrase, then its English partner. Reassigning either item replaces the tentative pair.</p>
        <HintControl hints={[
          "Find the four phrases containing a word beginning cyr-. Four English choices contain master or masters.",
          "Compare ho with hoi, and singular English nouns with plural ones.",
          "The forms tu and tōn introduce singular and plural possessors.",
          "The owner comes between the first article and the owned noun.",
          "To build a new phrase, choose the plural article, the possessor form, then the plural owned noun.",
        ]} />
        <ScratchSpace />
        <p className="attribution">
          Adapted from <cite>A Donkey in Every House</cite> by Todor Tchervenkov, NACLO 2007; republished in IOL Sample Problems. © respective rights holders. Non-commercial educational prototype; permission request pending.{" "}
          <a href="https://naclo.org/resources/problems/2007/N2007-C.pdf">Official source</a>.
        </p>
      </>
    ),
    answer: (
      <>
        <h2>Your construction</h2>
        <p className="progress-line"><b>{Object.keys(pairs).length} of 8</b> tentative pairs made</p>
        <div className="answer-fields compact">
          <label>
            <span className="answer-prompt">The houses of the merchants</span>
            <input value={answers[0]} onChange={(event) => { setAnswers([event.target.value, answers[1]]); setState("idle"); }} placeholder="Ancient Greek transcription" spellCheck={false} />
          </label>
          <label>
            <span className="answer-prompt">The donkeys of the slave</span>
            <input value={answers[1]} onChange={(event) => { setAnswers([answers[0], event.target.value]); setState("idle"); }} placeholder="Ancient Greek transcription" spellCheck={false} />
          </label>
        </div>
        <p className="form-note">Use <b>ō</b> for long o. Macrons are normalized, but not discarded.</p>
        <button className="button button--primary button--wide" type="button" onClick={check}>Check the full case <span aria-hidden="true">→</span></button>
        <Feedback state={state} />
        {state === "correct" && (
          <Reveal onNext={onNext}>
            <p><b>ho / hoi</b> mark singular and plural owned nouns; <b>tu / tōn</b> introduce singular and plural owners. The order is article + owner + owned noun.</p>
            <p className="key-line"><span>houses of merchants</span><b>hoi tōn emporōn oicoi</b></p>
            <p className="key-line"><span>donkeys of slave</span><b>hoi tu dulu onoi</b></p>
          </Reveal>
        )}
      </>
    ),
  };
}

function TenjiCell({ pattern, label, editable = false, onChange }: {
  pattern: Dots;
  label: string;
  editable?: boolean;
  onChange?: (pattern: Dots) => void;
}) {
  const standardPositions = [1, 4, 2, 5, 3, 6];
  return (
    <div className={`tenji-cell ${editable ? "tenji-cell--editable" : ""}`} role={editable ? "group" : "img"} aria-label={label}>
      {pattern.map((raised, index) => editable ? (
        <button
          type="button"
          key={index}
          className={raised ? "dot is-raised" : "dot"}
          aria-label={`Dot ${standardPositions[index]}, ${raised ? "raised" : "empty"}`}
          aria-pressed={raised}
          onClick={() => {
            const next = [...pattern] as boolean[];
            next[index] = !raised;
            onChange?.(next as unknown as Dots);
          }}
        />
      ) : <span className={raised ? "dot is-raised" : "dot"} key={index} aria-hidden="true" />)}
    </div>
  );
}

function TenjiWord({ cells, label }: { cells: readonly Dots[]; label: string }) {
  return <div className="tenji-word" aria-label={label}>{cells.map((cell, index) => <TenjiCell key={index} pattern={cell} label={`Cell ${index + 1}`} />)}</div>;
}

const blank: Dots = [false, false, false, false, false, false];

function useBrailleRound({ onNext }: { onNext: () => void }) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [decoded, setDecoded] = useState(["", ""]);
  const [written, setWritten] = useState<Record<string, Dots[]>>({
    samurai: Array.from({ length: 4 }, () => [...blank] as Dots),
    miso: Array.from({ length: 2 }, () => [...blank] as Dots),
  });
  const [state, setState] = useState<CheckState>("idle");

  const choices = useMemo(() => ["atari", "haiku", "katana", "kimono", "koi", "sake"], []);

  function check() {
    const mapping = evaluateMapping(matches, brailleMatchAnswers);
    const text = evaluateTextAnswers(decoded, [["karate"], ["anime"]], true);
    const hasBlankCell = Object.values(written).flat().some((cell) => cell.every((dot) => !dot));
    const dotsCorrect = brailleWrite.every((word) => word.cells.every((expected, index) => sameDots(written[word.id][index], expected)));
    setState(mapping === "incomplete" || text === "incomplete" || hasBlankCell ? "incomplete" : mapping === "correct" && text === "correct" && dotsCorrect ? "correct" : "incorrect");
  }

  function updateCell(wordId: string, index: number, pattern: Dots) {
    setWritten((current) => ({ ...current, [wordId]: current[wordId].map((cell, cellIndex) => cellIndex === index ? pattern : cell) }));
    setState("idle");
  }

  return {
    problem: (
      <>
        <p className="lede">Japanese tenji combines information inside each six-dot cell. Identify the six words, then decode and construct new ones.</p>
        <section className="labelled-example" aria-labelledby="karaoke-title">
          <div>
            <p className="kicker">Labelled example</p>
            <h3 id="karaoke-title">karaoke</h3>
          </div>
          <TenjiWord cells={[tenji.ka, tenji.ra, tenji.o, tenji.ke]} label="Tenji spelling of karaoke" />
        </section>
        <section aria-labelledby="identify-title">
          <div className="section-heading">
            <div><p className="kicker">Part one</p><h3 id="identify-title">Identify the six sequences</h3></div>
            <p>atari · haiku · katana · kimono · koi · sake</p>
          </div>
          <div className="sequence-grid">
            {brailleSequences.map((sequence) => (
              <label className="sequence-card" key={sequence.id}>
                <span className="sequence-id">{sequence.id}</span>
                <TenjiWord cells={sequence.cells} label={`Sequence ${sequence.id}`} />
                <select value={matches[sequence.id] ?? ""} onChange={(event) => { setMatches({ ...matches, [sequence.id]: event.target.value }); setState("idle"); }} aria-label={`Match sequence ${sequence.id}`}>
                  <option value="">Choose word</option>
                  {choices.map((choice) => <option key={choice} value={choice}>{choice}</option>)}
                </select>
              </label>
            ))}
          </div>
        </section>
        <HintControl hints={[
          "Compare koi with kimono: the shared first syllable keeps the same consonant component.",
          "Compare the a syllables in atari, katana, and karaoke.",
          "The upper-left triangle of dots 1, 2, and 4 encodes the vowel; lower and right-side additions encode the consonant row.",
          "Mentally overlay ka and a. The extra lower-right dot is the k component.",
          "Build a syllable by combining its vowel pattern with its consonant-row pattern.",
        ]} />
        <ScratchSpace />
        <p className="attribution">
          Adapted from <cite>Tenji Karaoke</cite> by Patrick Littell, NACLO 2009; republished in IOL Sample Problems. © NACLO and the problem author. Non-commercial educational prototype; permission request pending.{" "}
          <a href="https://naclo.org/resources/problems/2009/N2009-A.pdf">Official source</a>.
        </p>
      </>
    ),
    answer: (
      <>
        <h2>Read and write</h2>
        <section className="decode-section" aria-labelledby="decode-title">
          <p className="kicker" id="decode-title">Part two · Decode</p>
          {brailleDecode.map((word, index) => (
            <label className="decode-row" key={word.id}>
              <span className="sequence-id">{word.id}</span>
              <TenjiWord cells={word.cells} label={`Sequence ${word.id}`} />
              <input value={decoded[index]} onChange={(event) => { const next = [...decoded]; next[index] = event.target.value; setDecoded(next); setState("idle"); }} placeholder="Roman letters" spellCheck={false} />
            </label>
          ))}
        </section>
        <section className="write-section" aria-labelledby="write-title">
          <p className="kicker" id="write-title">Part three · Construct</p>
          {brailleWrite.map((word) => (
            <fieldset className="editor-row" key={word.id}>
              <legend>{word.id}</legend>
              <div className="tenji-word">
                {written[word.id].map((cell, index) => (
                  <TenjiCell key={index} pattern={cell} label={`${word.id}, cell ${index + 1}`} editable onChange={(pattern) => updateCell(word.id, index, pattern)} />
                ))}
              </div>
            </fieldset>
          ))}
          <p className="form-note">Toggle each position. Raised dots are larger, filled, and outlined.</p>
        </section>
        <button className="button button--primary button--wide" type="button" onClick={check}>Check the full case <span aria-hidden="true">→</span></button>
        <Feedback state={state} />
        {state === "correct" && (
          <Reveal onNext={onNext} final>
            <p>The cell is compositional: a vowel pattern forms the base, then a consonant-row pattern is added. For example, <b>ka</b> combines the <b>a</b> pattern with one lower-right <b>k</b> dot.</p>
            <div className="cell-equation"><TenjiCell pattern={tenji.a} label="a" /><span>+</span><span className="component-dot">k</span><span>=</span><TenjiCell pattern={tenji.ka} label="ka" /></div>
          </Reveal>
        )}
      </>
    ),
  };
}

export function App() {
  const [round, setRound] = useState<Round>(0);
  const georgian = useGeorgianRound({ onNext: () => setRound(1) });
  const greek = useGreekRound({ onNext: () => setRound(2) });
  const braille = useBrailleRound({ onNext: () => setRound(0) });
  const content = [georgian, greek, braille][round];

  return <PuzzleShell round={round} onRoundChange={setRound} problem={content.problem} answer={content.answer} />;
}
