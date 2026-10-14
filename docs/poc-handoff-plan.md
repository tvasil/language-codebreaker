# Crack the Language — POC Handoff Plan

This document is the starting point for the next implementation session. It records the decisions already made, the selected visual direction, the proof-of-concept scope, and an executable build sequence.

## Read these first

1. [IOL Format Notes and POC Plan](iol-format-and-poc-plan.md)
2. [Problem Types and Natural Interactions](problem-types-and-interactions.md)
3. [IOL Sample Problems, 2026 revision](../samples-revision2026.en.pdf)
4. [Selected visual reference](assets/crack-the-language-style-reference.png)

## Objective

Build a small browser-based proof of concept that tests whether restrained digital interaction can make three IOL-style problems more approachable and satisfying without flattening their open-ended reasoning.

The intended feeling is:

> “Wait—I think I figured out how this works.”

The POC is a non-commercial educational prototype, not a production game. Its public release uses the split-license and attribution approach documented in the repository while content permission requests remain pending.

## Decisions already made

### Product and interaction

- The source problem is the main object on screen.
- There is no universal evidence board.
- There is no hypothesis builder in the POC.
- The shell is shared; the central problem interaction varies by problem.
- Evidence remains visible while the player answers.
- Annotation is optional and reversible.
- Every problem ends in a concrete answer or productive task.
- Progressive hints direct attention to evidence.
- Post-solve explanations replay the decisive reasoning.
- Scoring, currencies, timers, and streaks are out of scope.

### POC rounds

1. Georgian Countries — script decipherment
2. Ancient Greek — unordered matching and phrase construction
3. Japanese Braille — spatial writing-system analysis and construction

### Visual direction

Use the [first generated mockup](assets/crack-the-language-style-reference.png) as the primary style reference.

The target is a **warm scholarly case file**:

- exploratory, intelligent, calm, and slightly mysterious;
- editorial rather than dashboard-like;
- warm and tactile without becoming nostalgic or ornamental;
- accessible to a broad audience without feeling childish;
- especially respectful of large, beautifully rendered non-Latin text.

Do not use the later bright laboratory or dark computational mockups as the baseline.

## Visual system to derive from the reference

These are starting tokens, not final brand standards.

### Colour roles

| Role | Direction |
|---|---|
| Page background | Warm near-white, approximately `#F6F2EA` |
| Primary surface | Soft white, approximately `#FFFEFB` |
| Primary ink | Very dark navy, approximately `#101B35` |
| Secondary ink | Desaturated blue-gray, approximately `#64728A` |
| Primary action | Muted terracotta, approximately `#C65F45` |
| Active evidence | Pale amber fill with darker amber focus ring |
| Rules and borders | Very light blue-gray |
| Correct state | Restrained forest or teal, not bright green |
| Incorrect state | Muted red used sparingly and never as the only cue |

Confirm actual values for WCAG contrast before treating them as final.

### Typography

- Use a refined editorial serif for the game title and problem titles.
- Use a highly readable sans serif for controls, metadata, and helper text.
- Use a Georgian-capable font with excellent glyph quality and generous sizing.
- Prefer open-source fonts and record their licences.
- Candidate families to evaluate: Source Serif 4, IBM Plex Sans or Inter, and Noto Serif Georgian or Noto Sans Georgian.
- Do not rely on synthetic italics or browser fallback for the puzzle scripts.

### Surfaces and spacing

- Use generous white space and a maximum-width desktop canvas.
- Use two primary surfaces: the problem card and answer card.
- Corners should be soft but not bubbly.
- Shadows should be subtle and broad, giving hierarchy rather than a floating-card dashboard effect.
- Keep fine dividers between evidence rows.
- Decorative props from the mockup are optional. If used, keep them outside the reading column and hide them on narrow screens.

### Motion

- Keep initial motion minimal: hover, focus, selection, and gentle panel transitions.
- Respect `prefers-reduced-motion` from the start.
- Hint animations and post-solve replays may initially use simple highlight sequences rather than bespoke motion design.

## Recommended technical baseline

Use a lightweight static frontend:

- Vite
- React
- TypeScript
- Plain CSS or CSS Modules with custom properties
- Vitest and React Testing Library for focused logic/component tests
- No backend
- Browser storage only if round progress needs to survive refresh

Avoid adding a component library unless a concrete accessibility need justifies it. The interface is small enough to build from semantic HTML and a restrained internal component set.

## Proposed source structure

```text
src/
  app/
    App.tsx
    routes.ts
  content/
    puzzles/
      georgian-countries.ts
      ancient-greek.ts
      japanese-braille.ts
    sources.ts
  engine/
    puzzle-types.ts
    puzzle-state.ts
    evaluators.ts
    unicode.ts
  components/
    PuzzleShell/
    ProblemDocument/
    AnswerPanel/
    HintControl/
    CompletionReveal/
    AnnotationToolbar/
  interactions/
    CharacterMarker/
    PairMatcher/
    PhraseComposer/
    DotCellEditor/
  styles/
    tokens.css
    global.css
```

This is a proposed shape, not a requirement to create abstractions before they are needed.

## Content model

The content should be structured and JSON-compatible, but TypeScript definitions are acceptable for the POC.

Model a puzzle as a document containing display blocks and tasks rather than as a generic evidence board:

```ts
type PuzzleDefinition = {
  id: string;
  title: string;
  language: LanguageMetadata;
  difficulty: "easy" | "intermediate" | "hard";
  introduction: ContentBlock[];
  data: ContentBlock[];
  tasks: TaskDefinition[];
  hints: HintDefinition[];
  reveal: RevealDefinition;
  sources: SourceReference[];
};
```

Expected task kinds for the POC:

- `text-answer`
- `pair-matching`
- `phrase-construction`
- `dot-grid-answer`

Expected content blocks:

- prose
- aligned rows or table
- symbol sequence
- note or transcription key
- task group

Do not design a fully general puzzle-editor schema yet. Let the three real problems reveal the smallest useful abstractions.

## Shared round shell

Every round should provide:

1. Game title and round progress
2. Puzzle type and difficulty
3. Problem title and concise instructions
4. Stable problem-data area
5. Problem-specific interaction
6. Answer area
7. Progressive hint control
8. Optional collapsed notes area
9. Completion reveal and next-round action

Desktop should use the selected mockup's two-column composition. On narrow screens, the answer panel moves below the problem. Do not hide the evidence in a modal or separate route.

## Round 1 implementation spec: Georgian Countries

### Source and status

- Supplied sample: Problem 1
- Credited to Bruno L'Astorina, Brazilian Linguistics Olympiad 2016
- Public prototype status: permission request pending; see [`THIRD_PARTY_CONTENT.md`](../THIRD_PARTY_CONTENT.md)

### Required content

- `ბრაზილია` — Brazil
- `პერუ` — Peru
- `ურუგვაი` — Uruguay
- `არგენტინა` — unanswered
- `კოლუმბია` — unanswered

Answers: Argentina and Colombia. Consider whether `Columbia` should be accepted only because the sample solution mentions it, or rejected because the modern country name is Colombia; document the decision.

### Interaction

- Render each Georgian word as a sequence of selectable grapheme clusters.
- Selecting a character highlights every identical character across all rows.
- Provide at least three highlight colours or one active comparison colour.
- Allow clearing marks without clearing answers.
- Character marking is optional.
- Provide two text inputs and a single check action.

Use `Intl.Segmenter` when available, with a safe fallback. Do not split Unicode text with simple string indexing.

### Hint sequence

1. Draw attention to Peru and Uruguay.
2. Ask the player to compare character counts.
3. Highlight the repeated `u` positions in Uruguay and the corresponding Georgian character.
4. Establish left-to-right direction.
5. Transfer enough correspondences to constrain the two unknown names.

### Completion reveal

Replay the observations in sequence and show how the partial patterns resolve to Argentina and Colombia. Keep the explanation short.

### Acceptance criteria

- A player can solve without using the marker.
- Matching characters highlight correctly in every row.
- Keyboard users can select characters and reach both inputs.
- Georgian glyphs remain intact and visually prominent.
- Correct answers accept harmless whitespace and case differences.
- Incorrect feedback does not reveal the answer immediately.

## Round 2 implementation spec: Ancient Greek

### Source and status

- Supplied sample: Problem 2
- Credited to Todor Tchervenkov, NACLO 2007
- Public prototype status: permission request pending; see [`THIRD_PARTY_CONTENT.md`](../THIRD_PARTY_CONTENT.md)

### Interaction

- Show the eight Greek phrases and eight English translations in two stable columns.
- Pair items by click/tap selection rather than relying on drag lines.
- Make tentative pairs easy to revise.
- Keep matched content visible and readable.
- Check the matching set without reordering the source data unless the player asks for a paired view.
- For the two productive translations, start with text entry.
- Add a token composer only if typing proves frustrating or obscures the intended reasoning.

### Hint sequence

1. Point to two phrases that share a noun root.
2. Compare singular and plural articles.
3. Identify the possessor forms.
4. Mark the phrase order.
5. Demonstrate how one requested phrase is assembled.

### Completion reveal

Show a compact vocabulary and morphology key, then construct one answer layer by layer.

### Acceptance criteria

- All eight matches can be completed and revised using mouse, touch, or keyboard.
- Matching state remains understandable without colour alone.
- The player can consult all evidence while producing the final phrases.
- Answer checking supports normalized macrons and transcription decisions documented in the content.

## Round 3 implementation spec: Japanese Braille

### Source and status

- Supplied sample: Problem 4
- Credited to Patrick Littell, NACLO 2009
- Public prototype status: permission request pending; see [`THIRD_PARTY_CONTENT.md`](../THIRD_PARTY_CONTENT.md)

### Interaction

- Recreate tenji cells as HTML/CSS or SVG controls, not cropped PDF images.
- Represent every cell as six explicit positions with raised and empty states.
- Provide accessible labels describing each position and state.
- Support matching candidate words to six symbol sequences.
- Support two decoded text answers.
- Support constructing the requested words by toggling dots in blank cells.
- Keep the labelled example and candidate data visible.

### Hint sequence

1. Compare two words that share a vowel.
2. Compare two words that share a consonant.
3. Direct attention to different regions of the six-dot cell.
4. Overlay two cells to isolate a component.
5. Show how consonant and vowel patterns combine.

### Completion reveal

Animate a cell separating into its two functional patterns and recombining into a new syllable.

### Acceptance criteria

- Dot grids work with mouse, touch, and keyboard.
- Raised and empty states are distinguishable without colour alone.
- Screen readers receive a meaningful label for every cell and sequence.
- The solution data is stored as explicit dot patterns and tested independently of layout.

## Evaluation and feedback rules

- Normalise text with Unicode NFC.
- Trim harmless surrounding whitespace.
- Apply case folding only to English answers where appropriate.
- Do not strip diacritics from target-language answers unless the puzzle explicitly permits it.
- Pair matching should evaluate the complete mapping.
- Dot patterns should evaluate structured arrays or bit sets, never screenshots.
- Feedback should distinguish incomplete, incorrect, and correct states.
- An incorrect attempt should suggest where to look or offer a hint, not immediately expose the solution.

## Accessibility and international text requirements

- Use semantic headings, tables, field labels, buttons, and status messages.
- All core actions must be keyboard-operable.
- Provide visible focus states that fit the visual system.
- Announce answer results through an `aria-live` region.
- Maintain at least WCAG AA contrast for text and controls.
- Honour `prefers-reduced-motion`.
- Preserve source-language direction metadata even though the first three rounds are left-to-right.
- Design components so future right-to-left content does not require a rewrite.
- Test at 200% zoom and with long translated UI strings.

## Licensing and publication status

The research found no public adaptation licence on IOL's site. NACLO's 2009 booklet explicitly reserves rights to NACLO and the authors and asks readers not to copy or distribute without permission.

The project is proceeding as an attributed, non-commercial public prototype while permission requests are pending. This is a risk-managed publication decision, not a conclusion that permission is unnecessary or that fair use/fair dealing is guaranteed.

Clearance contacts and requested rights are documented in [IOL Format Notes and POC Plan](iol-format-and-poc-plan.md#licensing-status) and the [rights ledger](rights-ledger.md).

If permission is declined or removal is requested, preserve the interaction designs and replace the affected content with an original, independently sourced puzzle.

## Build sequence

### Phase 0 — Confirm the handoff

- Read the two research documents and supplied PDF.
- Inspect the selected visual reference.
- Check the working tree before editing; existing files are user-owned.
- Keep the exact-problem licensing restriction visible in project notes.

### Phase 1 — Scaffold the POC

- Create the Vite React TypeScript application.
- Add global tokens and the warm scholarly visual shell.
- Add three local routes or a simple round-state router.
- Add source and rights metadata to puzzle definitions from the beginning.

### Phase 2 — Build Georgian Countries vertically

- Implement the complete shared shell and Round 1.
- Include answer checking, character marking, one progressive hint flow, and completion reveal.
- Use this round to test typography, spacing, responsive stacking, Unicode segmentation, and feedback tone.
- Conduct a quick playtest before generalising components.

### Phase 3 — Extract only proven shared components

- Separate the shell, answer panel, hint control, and completion reveal after Round 1 works.
- Keep the character marker specific to script-decipherment interactions.
- Avoid inventing abstractions for future puzzle types.

### Phase 4 — Add Ancient Greek

- Implement click-to-pair matching.
- Add text construction answers.
- Extend the content model only where this problem requires it.

### Phase 5 — Add Japanese Braille

- Implement accessible dot-cell rendering and editing.
- Add matching, decoding, and construction tasks.
- Verify that the shell still works with a highly visual problem.

### Phase 6 — Focused validation

- Unit-test evaluators, Unicode handling, and dot-pattern logic.
- Component-test keyboard interactions for character marking, pairing, and dot toggling.
- Manually inspect one desktop and one narrow viewport.
- Run a small playtest with people who have not seen the source problems.
- Record confusion, solve time, hint use, and whether players can explain the rule afterward.

## POC completion criteria

The POC is complete when:

- all three rounds are playable from start to finish;
- the selected warm scholarly style is consistently implemented;
- each round uses an interaction natural to its problem;
- no round depends on a hypothesis builder or universal evidence board;
- hints are progressive and data-driven;
- every round has a concise post-solve explanation;
- keyboard navigation works for every core task;
- Unicode content is represented as text or structured symbols, not baked into screenshots;
- focused automated tests cover the evaluators and interaction state;
- every public case includes full attribution, an official source link, and a pending-permission notice;
- a short playtest summary identifies what to keep, change, or remove before production work.

## Explicitly out of scope

- authentication and accounts;
- backend services;
- cloud progress;
- daily puzzles;
- scores, leaderboards, streaks, hint currency, or achievements;
- puzzle packs and maps;
- a community puzzle editor;
- a production-ready generic puzzle schema;
- exhaustive animation;
- commercial hosting or monetisation;
- production hardening, analytics, observability, and deployment infrastructure.

## Open decisions for the next session

Do not block scaffolding on these, but record the choice when it becomes necessary:

- Product term: “round,” “case,” or “problem”
- Check answers per sub-task or per complete round
- Exact open-source font families
- Whether notes are included in the first vertical slice
- Whether source-language names are revealed before or after solving
- Whether the answer panel becomes sticky on desktop
- How much state survives a page refresh

## Suggested kickoff instruction for the next session

> Read `docs/poc-handoff-plan.md`, `docs/iol-format-and-poc-plan.md`, `docs/problem-types-and-interactions.md`, and `THIRD_PARTY_CONTENT.md`. Inspect `docs/assets/crack-the-language-style-reference.png` and the official IOL sample PDF. Treat the selected mockup as the visual baseline, keep the problem data central, and preserve the public attribution and licensing notices. Validate the evaluator, Unicode character marking, and keyboard access before handing back the result.

