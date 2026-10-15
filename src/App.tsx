import { useMemo, useRef, useState } from "react";
import { GreekMatchBoard } from "./components/GreekMatchBoard";
import { HintControl } from "./components/HintControl";
import { CheckAction, TaskStepper, type TaskStep } from "./components/TaskFlow";
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
  comparePhrases,
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

function ScratchSpace({ value, onChange, textareaRef, detailsRef, id }: {
  value: string;
  onChange: (value: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  detailsRef?: React.RefObject<HTMLDetailsElement | null>;
  id: string;
}) {
  return (
    <details className="scratch" ref={detailsRef}>
      <summary>Scratch space <span>Optional notes, never graded</span></summary>
      <label className="sr-only" htmlFor={id}>Private scratch notes</label>
      <textarea
        ref={textareaRef}
        id={id}
        rows={5}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Record a pattern, a possible meaning, or a question…"
      />
    </details>
  );
}

function Reveal({ children, onNext, nextLabel }: { children: React.ReactNode; onNext: () => void; nextLabel: string }) {
  return (
    <section className="reveal">
      <p className="kicker">The decisive pattern</p>
      {children}
      <button className="button button--next" type="button" onClick={onNext}>
        {nextLabel} <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

function GameInfoPanel({ onDismiss }: { onDismiss: () => void }) {
  return (
    <aside className="paper info-panel" role="dialog" aria-modal="false" aria-labelledby="game-info-title" id="game-info-panel">
      <button className="info-panel__close" type="button" onClick={onDismiss} aria-label="Close game introduction">×</button>
      <p className="eyebrow">A linguistic puzzle game</p>
      <h2 id="game-info-title">Discover how languages work, one pattern at a time.</h2>
      <p className="info-panel__lede">
        <i>Crack the Language</i> is inspired by problems from the International Linguistics Olympiad. They challenge young people to uncover how languages are constructed through logic rather than memorisation, from familiar and lesser-known languages to invented ones.
      </p>
      <p className="info-panel__lede">
        This proof of concept adapts three problems from the IOL’s{" "}
        <a href="https://ioling.org/booklets/samples.en.pdf">sample problems booklet</a>, adding interactive tools and progressive support to help you build solving intuition.
      </p>
      <div className="info-panel__guide">
        <p className="kicker">How it works · No prior knowledge required</p>
        <ol className="info-steps">
          <li><b>Study the evidence.</b> Compare unfamiliar forms with what you already know.</li>
          <li><b>Mark what repeats.</b> Highlight patterns, move matches, toggle dots, and take notes.</li>
          <li><b>Test your theory.</b> Check each section and reveal hints only when you want them.</li>
        </ol>
      </div>
      <button className="button button--primary info-panel__cta" type="button" onClick={onDismiss}>
        Start playing <span aria-hidden="true">→</span>
      </button>
    </aside>
  );
}

function PuzzleShell({ round, onRoundChange, infoOpen, onInfoOpen, onInfoClose, problem, answer, steps, activeStep, completedSteps, onStepChange, completedRounds }: {
  round: Round;
  onRoundChange: (round: Round) => void;
  infoOpen: boolean;
  onInfoOpen: () => void;
  onInfoClose: () => void;
  problem: React.ReactNode;
  answer: React.ReactNode;
  steps: readonly TaskStep[];
  activeStep: number;
  completedSteps: readonly boolean[];
  onStepChange: (step: number) => void;
  completedRounds: readonly boolean[];
}) {
  const meta = rounds[round];
  return (
    <>
      <header className="topbar">
        <button className="wordmark" type="button" onClick={() => onRoundChange(0)} aria-label="Open case one">Crack the Language</button>
        <nav aria-label="Case navigation" className="case-nav">
          {rounds.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={`${round === index ? "is-current" : ""}${completedRounds[index] ? " is-complete" : ""}`}
              aria-current={round === index ? "step" : undefined}
              onClick={() => onRoundChange(index as Round)}
              aria-label={`Open case ${index + 1}: ${item.title}`}
            >
              {completedRounds[index] ? "✓" : String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </nav>
        <div className="topbar-actions">
          <button className="about-button" type="button" onClick={onInfoOpen} aria-expanded={infoOpen} aria-controls={infoOpen ? "game-info-panel" : undefined}>About this game</button>
          <span className="prototype-tag">Non-commercial prototype</span>
        </div>
      </header>
      <main className="page-shell">
        <header className="case-intro">
          <p className="eyebrow">Case {String(round + 1).padStart(2, "0")} · {meta.eyebrow}</p>
          <h1>{meta.title}</h1>
        </header>
        <TaskStepper steps={steps} current={activeStep} completed={completedSteps} onSelect={onStepChange} />
        <div className="case-grid">
          <article className="paper problem-card">{problem}</article>
          <aside className="paper answer-card" aria-label="Your deduction">{answer}</aside>
        </div>
        <footer className="source-note">
          <strong>Independent educational prototype:</strong> Not affiliated with or endorsed by IOL, OBL, or NACLO. A puzzle reuse permission request is pending.
        </footer>
      </main>
      {infoOpen && <GameInfoPanel onDismiss={onInfoClose} />}
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

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const fallback = document.createElement("textarea");
  fallback.value = value;
  fallback.setAttribute("readonly", "");
  fallback.style.position = "fixed";
  fallback.style.opacity = "0";
  document.body.appendChild(fallback);
  try {
    fallback.select();
    if (!document.execCommand("copy")) throw new Error("Copy command failed");
  } finally {
    fallback.remove();
  }
}

function useGeorgianRound({ onNext }: { onNext: () => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [answers, setAnswers] = useState(["", ""]);
  const [state, setState] = useState<CheckState>("idle");
  const [hintsShown, setHintsShown] = useState(0);
  const [scratch, setScratch] = useState("");
  const [characterStatus, setCharacterStatus] = useState("");
  const scratchRef = useRef<HTMLTextAreaElement>(null);
  const scratchDetailsRef = useRef<HTMLDetailsElement>(null);

  function check() {
    setState(evaluateTextAnswers(answers, [["Argentina"], ["Colombia"]], true));
  }

  function insertInScratch() {
    if (!active) return;
    const textarea = scratchRef.current;
    const start = textarea?.selectionStart ?? scratch.length;
    const end = textarea?.selectionEnd ?? scratch.length;
    const next = `${scratch.slice(0, start)}${active}${scratch.slice(end)}`;
    setScratch(next);
    setCharacterStatus(`${active} added to scratch notes.`);
    if (scratchDetailsRef.current) scratchDetailsRef.current.open = true;
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(start + active.length, start + active.length);
    });
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
        {active && (
          <div className="character-actions" role="group" aria-label={`Actions for ${active}`}>
            <span className="character-actions__glyph" lang="ka">{active}</span>
            <button className="button button--quiet" type="button" onClick={async () => {
              try {
                await copyText(active);
                setCharacterStatus(`${active} copied.`);
              } catch {
                setCharacterStatus("Copy failed. Try inserting the character into your scratch notes.");
              }
            }}>Copy character</button>
            <button className="button button--quiet" type="button" onClick={insertInScratch}>Insert into scratch</button>
          </div>
        )}
        {characterStatus && <p className="character-status" role="status" aria-live="polite">{characterStatus}</p>}
        <HintControl hints={[
          "Begin with Peru and Uruguay: their lengths give you a useful foothold.",
          "Uruguay repeats the u sound. Which Georgian character appears in the matching positions?",
          "The repeated უ shows that the words run from left to right.",
          "Transfer the letters you now know into the two unknown rows and look for country-name shapes.",
        ]} shown={hintsShown} onReveal={() => setHintsShown((count) => Math.min(count + 1, 4))} idPrefix="georgian" />
        <ScratchSpace id="georgian-scratch" value={scratch} onChange={setScratch} textareaRef={scratchRef} detailsRef={scratchDetailsRef} />
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
        <CheckAction state={state} onCheck={check} checkLabel="Check answers" successLabel="Case solved" />
        {state === "correct" && (
          <Reveal onNext={onNext} nextLabel="Continue to case 2">
            <p><b>Peru</b> and <b>Uruguay</b> establish direction and the repeating <span lang="ka">უ</span> sound. Those correspondences turn <span lang="ka">არგენტინა</span> into <b>Argentina</b> and <span lang="ka">კოლუმბია</span> into <b>Colombia</b>.</p>
          </Reveal>
        )}
      </>
    ),
    steps: [{ id: "solve", label: "Solve the countries" }],
    activeStep: 0,
    completedSteps: [state === "correct"],
    onStepChange: () => undefined,
    complete: state === "correct",
  };
}

function useGreekRound({ onNext }: { onNext: () => void }) {
  const [pairs, setPairs] = useState<Record<string, string>>(() => Object.fromEntries(
    greekPhrases.map(([phraseId], index) => [phraseId, greekTranslations[index][0]]),
  ));
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState(["", ""]);
  const [pairState, setPairState] = useState<CheckState>("idle");
  const [constructionState, setConstructionState] = useState<CheckState>("idle");
  const [fieldStates, setFieldStates] = useState<[CheckState, CheckState]>(["idle", "idle"]);
  const [attempts, setAttempts] = useState<[number, number]>([0, 0]);
  const [assisted, setAssisted] = useState<[boolean, boolean]>([false, false]);
  const [hintsShown, setHintsShown] = useState(0);
  const [scratch, setScratch] = useState("");
  const [activeAnswer, setActiveAnswer] = useState(0);
  const answerRefs = useRef<(HTMLInputElement | null)[]>([]);
  const expectedAnswers = ["hoi tōn emporōn oicoi", "hoi tu dulu onoi"] as const;

  function moveTranslation(phraseId: string, translationId: string) {
    setPairs((current) => {
      const sourcePhrase = Object.entries(current).find(([, value]) => value === translationId)?.[0];
      const displaced = current[phraseId];
      const next = { ...current };
      next[phraseId] = translationId;
      if (sourcePhrase && sourcePhrase !== phraseId) next[sourcePhrase] = displaced;
      return next;
    });
    setPairState("idle");
    setActiveStep(0);
  }

  function checkConstruction() {
    const nextStates = answers.map((answer, index) => (
      evaluateTextAnswers([answer], [[expectedAnswers[index]]], true)
    )) as [CheckState, CheckState];
    setFieldStates(nextStates);
    setAttempts((current) => current.map((count, index) => (
      nextStates[index] === "incorrect" ? count + 1 : count
    )) as [number, number]);
    setConstructionState(
      nextStates.some((item) => item === "incomplete")
        ? "incomplete"
        : nextStates.every((item) => item === "correct") ? "correct" : "incorrect",
    );
  }

  function updateAnswer(index: number, value: string) {
    setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? value : answer));
    setFieldStates((current) => current.map((item, answerIndex) => answerIndex === index ? "idle" : item) as [CheckState, CheckState]);
    setConstructionState("idle");
  }

  function insertCharacter(character: string) {
    const input = answerRefs.current[activeAnswer];
    const current = answers[activeAnswer];
    const start = input?.selectionStart ?? current.length;
    const end = input?.selectionEnd ?? current.length;
    updateAnswer(activeAnswer, `${current.slice(0, start)}${character}${current.slice(end)}`);
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + character.length, start + character.length);
    });
  }

  function completeAnswer(index: number) {
    const nextAnswers = answers.map((answer, answerIndex) => answerIndex === index ? expectedAnswers[index] : answer);
    const nextStates = fieldStates.map((item, answerIndex) => answerIndex === index ? "correct" : item) as [CheckState, CheckState];
    setAnswers(nextAnswers);
    setFieldStates(nextStates);
    setAssisted((current) => current.map((item, answerIndex) => answerIndex === index ? true : item) as [boolean, boolean]);
    setConstructionState(nextStates.every((item) => item === "correct") ? "correct" : "idle");
  }

  function fieldMessage(index: number): string {
    const state = fieldStates[index];
    if (state === "correct") return assisted[index] ? "Completed with help." : "This phrase is correct.";
    if (state === "incomplete") return "Enter a phrase before checking.";
    if (state !== "incorrect") return "";

    const comparison = comparePhrases(answers[index], expectedAnswers[index], true);
    if (attempts[index] >= 3 && comparison.isVeryClose) {
      return `You’re one character away. Focus on word ${comparison.firstDifferingWord ?? "that differs"}.`;
    }
    if (attempts[index] >= 2 && comparison.firstDifferingWord) {
      return `Look closely at word ${comparison.firstDifferingWord}.`;
    }
    return "Not quite. Compare the articles, owners, and noun endings in the evidence.";
  }

  return {
    problem: (
      <>
        <p className="lede">Match the Ancient Greek phrases to their unordered translations. Then use the pattern to construct two new phrases.</p>
        <GreekMatchBoard
          phrases={greekPhrases}
          translations={greekTranslations}
          pairs={pairs}
          onMove={moveTranslation}
        />
        <HintControl hints={[
          "Find the four phrases containing a word beginning cyr-. Four English choices contain master or masters.",
          "Compare ho with hoi, and singular English nouns with plural ones.",
          "The forms tu and tōn introduce singular and plural possessors.",
          "The owner comes between the first article and the owned noun.",
          "To build a new phrase, choose the plural article, the possessor form, then the plural owned noun.",
        ]} shown={hintsShown} onReveal={() => setHintsShown((count) => Math.min(count + 1, 5))} idPrefix="greek" />
        <ScratchSpace id="greek-scratch" value={scratch} onChange={setScratch} />
        <p className="attribution">
          Adapted from <cite>A Donkey in Every House</cite> by Todor Tchervenkov, NACLO 2007; republished in IOL Sample Problems. © respective rights holders. Non-commercial educational prototype; permission request pending.{" "}
          <a href="https://naclo.org/resources/problems/2007/N2007-C.pdf">Official source</a>.
        </p>
      </>
    ),
    answer: (
      <>
        {activeStep === 0 ? (
          <>
            <p className="kicker">Step 1 of 2</p>
            <h2>Match the phrases</h2>
            <p className="answer-guidance">Reorder the English tiles until every row expresses the same meaning, then check the whole set.</p>
            <CheckAction
              state={pairState}
              onCheck={() => setPairState(evaluateMapping(pairs, greekMatchAnswers))}
              checkLabel="Check matching"
              successLabel="All eight matches are correct"
            />
            {pairState === "correct" && (
              <button className="button button--next button--wide" type="button" onClick={() => setActiveStep(1)}>
                Continue to construction <span aria-hidden="true">→</span>
              </button>
            )}
          </>
        ) : (
          <>
        <p className="kicker">Step 2 of 2</p>
        <h2>Your construction</h2>
        <div className="answer-fields compact">
          <div className={fieldStates[0] === "correct" ? "answer-field is-correct" : "answer-field"}>
            <label className="answer-prompt" htmlFor="greek-answer-0">The houses of the merchants</label>
            <input id="greek-answer-0" ref={(node) => { answerRefs.current[0] = node; }} value={answers[0]} onFocus={() => setActiveAnswer(0)} onChange={(event) => updateAnswer(0, event.target.value)} placeholder="Ancient Greek transcription" spellCheck={false} aria-describedby="greek-answer-0-feedback" aria-invalid={fieldStates[0] === "incorrect"} />
            <span id="greek-answer-0-feedback" className={`field-feedback feedback--${fieldStates[0]}`} role="status">{fieldMessage(0)}</span>
            {attempts[0] >= 3 && hintsShown === 5 && fieldStates[0] === "incorrect" && (
              <button className="text-button assist-action" type="button" onClick={() => completeAnswer(0)}>Complete this answer for me</button>
            )}
          </div>
          <div className={fieldStates[1] === "correct" ? "answer-field is-correct" : "answer-field"}>
            <label className="answer-prompt" htmlFor="greek-answer-1">The donkeys of the slave</label>
            <input id="greek-answer-1" ref={(node) => { answerRefs.current[1] = node; }} value={answers[1]} onFocus={() => setActiveAnswer(1)} onChange={(event) => updateAnswer(1, event.target.value)} placeholder="Ancient Greek transcription" spellCheck={false} aria-describedby="greek-answer-1-feedback" aria-invalid={fieldStates[1] === "incorrect"} />
            <span id="greek-answer-1-feedback" className={`field-feedback feedback--${fieldStates[1]}`} role="status">{fieldMessage(1)}</span>
            {attempts[1] >= 3 && hintsShown === 5 && fieldStates[1] === "incorrect" && (
              <button className="text-button assist-action" type="button" onClick={() => completeAnswer(1)}>Complete this answer for me</button>
            )}
          </div>
        </div>
        <div className="character-tray" aria-label="Special character keyboard">
          <span>Insert special character:</span>
          <button type="button" onClick={() => insertCharacter("ō")} aria-label="Insert ō">ō</button>
        </div>
        <p className="form-note">Select an input, then use the character button for long <b>ō</b>. Macrons are normalized, but not discarded.</p>
        <CheckAction state={constructionState} onCheck={checkConstruction} checkLabel="Check construction" successLabel="Both constructions are correct" />
        {pairState === "correct" && constructionState === "correct" && (
          <Reveal onNext={onNext} nextLabel="Continue to case 3">
            <p><b>ho / hoi</b> mark singular and plural owned nouns; <b>tu / tōn</b> introduce singular and plural owners. The order is article + owner + owned noun.</p>
            <p className="key-line"><span>houses of merchants</span><b>hoi tōn emporōn oicoi</b></p>
            <p className="key-line"><span>donkeys of slave</span><b>hoi tu dulu onoi</b></p>
          </Reveal>
        )}
          </>
        )}
      </>
    ),
    steps: [
      { id: "match", label: "Match phrases" },
      { id: "construct", label: "Construct phrases" },
    ],
    activeStep,
    completedSteps: [pairState === "correct", constructionState === "correct"],
    onStepChange: setActiveStep,
    complete: pairState === "correct" && constructionState === "correct",
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
  const [activeStep, setActiveStep] = useState(0);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [decoded, setDecoded] = useState(["", ""]);
  const [written, setWritten] = useState<Record<string, Dots[]>>({
    samurai: Array.from({ length: 4 }, () => [...blank] as Dots),
    miso: Array.from({ length: 2 }, () => [...blank] as Dots),
  });
  const [matchState, setMatchState] = useState<CheckState>("idle");
  const [decodeState, setDecodeState] = useState<CheckState>("idle");
  const [writeState, setWriteState] = useState<CheckState>("idle");
  const [hintsShown, setHintsShown] = useState(0);
  const [scratch, setScratch] = useState("");

  const choices = useMemo(() => ["atari", "haiku", "katana", "kimono", "koi", "sake"], []);

  function checkWritten() {
    const hasBlankCell = Object.values(written).flat().some((cell) => cell.every((dot) => !dot));
    const dotsCorrect = brailleWrite.every((word) => word.cells.every((expected, index) => sameDots(written[word.id][index], expected)));
    setWriteState(hasBlankCell ? "incomplete" : dotsCorrect ? "correct" : "incorrect");
  }

  function updateCell(wordId: string, index: number, pattern: Dots) {
    setWritten((current) => ({ ...current, [wordId]: current[wordId].map((cell, cellIndex) => cellIndex === index ? pattern : cell) }));
    setWriteState("idle");
  }

  const caseComplete = matchState === "correct" && decodeState === "correct" && writeState === "correct";

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
        {activeStep === 0 && <section aria-labelledby="identify-title">
          <div className="section-heading">
            <div><p className="kicker">Part one</p><h3 id="identify-title">Identify the six sequences</h3></div>
            <p>atari · haiku · katana · kimono · koi · sake</p>
          </div>
          <div className="sequence-grid">
            {brailleSequences.map((sequence) => (
              <label className="sequence-card" key={sequence.id}>
                <span className="sequence-id">{sequence.id}</span>
                <TenjiWord cells={sequence.cells} label={`Sequence ${sequence.id}`} />
                <select value={matches[sequence.id] ?? ""} onChange={(event) => { setMatches({ ...matches, [sequence.id]: event.target.value }); setMatchState("idle"); }} aria-label={`Match sequence ${sequence.id}`}>
                  <option value="">Choose word</option>
                  {choices.map((choice) => <option key={choice} value={choice}>{choice}</option>)}
                </select>
              </label>
            ))}
          </div>
        </section>}
        {activeStep === 1 && (
          <section className="stage-reference" aria-labelledby="decode-reference-title">
            <p className="kicker">Step 2</p>
            <h3 id="decode-reference-title">Decode two new sequences</h3>
            <p>Use the same vowel and consonant patterns you found in step one.</p>
            {brailleDecode.map((word) => (
              <div className="stage-reference__row" key={word.id}>
                <span className="sequence-id">{word.id}</span>
                <TenjiWord cells={word.cells} label={`Sequence ${word.id}`} />
              </div>
            ))}
          </section>
        )}
        {activeStep === 2 && (
          <section className="stage-reference" aria-labelledby="write-reference-title">
            <p className="kicker">Step 3</p>
            <h3 id="write-reference-title">Construct two words</h3>
            <p>Build each syllable by combining its vowel pattern with the consonant component.</p>
            <p className="candidate-words"><b>samurai</b> has four cells, <b>miso</b> has two.</p>
          </section>
        )}
        <HintControl hints={[
          "Compare koi with kimono: the shared first syllable keeps the same consonant component.",
          "Compare the a syllables in atari, katana, and karaoke.",
          "The triangular region shown below encodes the vowel; lower and right-side additions encode the consonant row.",
          "Mentally overlay ka and a. The extra lower-right dot is the k component.",
          "Build a syllable by combining its vowel pattern with its consonant-row pattern.",
        ]} shown={hintsShown} onReveal={() => setHintsShown((count) => Math.min(count + 1, 5))} idPrefix="tenji" />
        {hintsShown >= 3 && (
          <div className="hint-visual" aria-label="The vowel region is the triangle formed by the top-left, middle-left, and top-right positions">
            <TenjiCell pattern={tenji.e} label="Highlighted triangular vowel region" />
            <span>The vowel triangle</span>
          </div>
        )}
        <ScratchSpace id="tenji-scratch" value={scratch} onChange={setScratch} />
        <p className="attribution">
          Adapted from <cite>Tenji Karaoke</cite> by Patrick Littell, NACLO 2009; republished in IOL Sample Problems. © NACLO and the problem author. Non-commercial educational prototype; permission request pending.{" "}
          <a href="https://naclo.org/resources/problems/2009/N2009-A.pdf">Official source</a>.
        </p>
      </>
    ),
    answer: (
      <>
        <p className="kicker">Step {activeStep + 1} of 3</p>
        {activeStep === 0 && (
          <section aria-labelledby="identify-answer-title">
            <h2 id="identify-answer-title">Identify the words</h2>
            <p className="answer-guidance"><b>{Object.keys(matches).length} of 6</b> sequences have a tentative answer.</p>
            <CheckAction state={matchState} onCheck={() => setMatchState(evaluateMapping(matches, brailleMatchAnswers))} checkLabel="Check identifications" successLabel="All six words are identified" />
            {matchState === "correct" && <button className="button button--next button--wide" type="button" onClick={() => setActiveStep(1)}>Continue to decoding <span aria-hidden="true">→</span></button>}
          </section>
        )}
        {activeStep === 1 && (
          <section aria-labelledby="decode-title">
            <h2 id="decode-title">Decode the words</h2>
            {brailleDecode.map((word, index) => (
              <label className="decode-row" key={word.id}>
                <span className="sequence-id">{word.id}</span>
                <TenjiWord cells={word.cells} label={`Sequence ${word.id}`} />
                <input value={decoded[index]} onChange={(event) => { const next = [...decoded]; next[index] = event.target.value; setDecoded(next); setDecodeState("idle"); }} placeholder="Roman letters" spellCheck={false} aria-label={`Decode sequence ${word.id}`} />
              </label>
            ))}
            <CheckAction state={decodeState} onCheck={() => setDecodeState(evaluateTextAnswers(decoded, [["karate"], ["anime"]], true))} checkLabel="Check decoded words" successLabel="Both words are decoded" />
            {decodeState === "correct" && <button className="button button--next button--wide" type="button" onClick={() => setActiveStep(2)}>Continue to construction <span aria-hidden="true">→</span></button>}
          </section>
        )}
        {activeStep === 2 && (
          <section aria-labelledby="write-title">
            <h2 id="write-title">Construct the words</h2>
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
            <CheckAction state={writeState} onCheck={checkWritten} checkLabel="Check constructed words" successLabel="Both dot patterns are correct" />
          </section>
        )}
        {caseComplete && activeStep === 2 && (
          <Reveal onNext={onNext} nextLabel="Return to case 1">
            <p>The cell is compositional: a vowel pattern forms the base, then a consonant-row pattern is added. For example, <b>ka</b> combines the <b>a</b> pattern with one lower-right <b>k</b> dot.</p>
            <div className="cell-equation"><TenjiCell pattern={tenji.a} label="a" /><span>+</span><span className="component-dot">k</span><span>=</span><TenjiCell pattern={tenji.ka} label="ka" /></div>
          </Reveal>
        )}
      </>
    ),
    steps: [
      { id: "identify", label: "Identify" },
      { id: "decode", label: "Decode" },
      { id: "construct", label: "Construct" },
    ],
    activeStep,
    completedSteps: [matchState === "correct", decodeState === "correct", writeState === "correct"],
    onStepChange: setActiveStep,
    complete: caseComplete,
  };
}

export function App() {
  const [infoOpen, setInfoOpen] = useState(true);
  const [round, setRound] = useState<Round>(0);
  const georgian = useGeorgianRound({ onNext: () => setRound(1) });
  const greek = useGreekRound({ onNext: () => setRound(2) });
  const braille = useBrailleRound({ onNext: () => setRound(0) });
  const content = [georgian, greek, braille][round];
  const completedRounds = [georgian.complete, greek.complete, braille.complete];

  return (
    <PuzzleShell
      round={round}
      onRoundChange={setRound}
      infoOpen={infoOpen}
      onInfoOpen={() => setInfoOpen(true)}
      onInfoClose={() => setInfoOpen(false)}
      problem={content.problem}
      answer={content.answer}
      steps={content.steps}
      activeStep={content.activeStep}
      completedSteps={content.completedSteps}
      onStepChange={content.onStepChange}
      completedRounds={completedRounds}
    />
  );
}
