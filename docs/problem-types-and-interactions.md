# Problem Types and Natural Interactions

This is a living catalog for **Crack the Language**. It describes recurring linguistic-puzzle structures, the reasoning they demand, and browser interactions that support that reasoning without turning every problem into the same “evidence board.”

Each entry includes a self-contained description of relevant problems from the [2026 IOL sample booklet](../samples-revision2026.en.pdf), so the catalog remains useful without remembering a title or reopening the PDF.

## Shared interaction principles

### Preserve the original representation

If spatial layout, ordering, or adjacency carries information, preserve it. A family tree should stay a tree; a six-dot cell should stay a six-dot cell; a map should remain spatial.

### Add tools, not compulsory intermediate answers

Highlighting, note-taking, grouping, and token arrangement should help the player think. They should not force one particular reasoning path or require the player to describe a rule before using it.

### Keep evidence visible

Players should be able to inspect the full relevant data while answering. Avoid modal questions that hide the table or diagram they depend on.

### Prefer reversible actions

Matching, ordering, dot selection, and map placement should be easy to revise. Early experimentation is part of solving, not an error state.

### Validate the task at the right level

Some tasks have one exact answer; others accept unordered sets, multiple spellings, multiple justified answers, or a diagram state. Evaluators should match the linguistic task instead of reducing every answer to an exact string.

## Reusable interaction primitives

These are building blocks rather than complete problem templates.

| Primitive | Player action | Useful for |
|---|---|---|
| Repetition highlighting | Select a character, substring, word, or visual feature and highlight its other occurrences | Scripts, morphology, sound correspondences, repeated roots |
| Pair matching | Select or drag an item from each of two sets | Unordered translations, symbols and sounds, related forms |
| Blank completion | Type or choose missing material within an existing table | Paradigms, sound changes, agreement, formulas |
| Token construction | Arrange known pieces into a new expression | Morphology, syntax, compounds, numerals |
| Structured text entry | Enter an answer with language-aware normalization | Translation, decipherment, naming |
| Feature grouping | Sort items into player-created or provided groups | Noun classes, polarity, sound classes |
| Grid or cell editor | Toggle positions in a spatial symbol | Braille-like systems, numerals, writing systems |
| Diagram labelling | Place names or relations into fixed nodes | Kinship, taxonomies, derivations |
| Spatial placement | Place or move items on a map or scene | Absolute directions, relative location, classifiers tied to shape |
| Image-to-data matching | Connect a sentence or form with an illustration | Number, size, event roles, classifiers |
| Free annotation | Add highlights or short notes without grading | Any dense problem where scratch work is useful |

## Type 1: Orthographic decipherment from familiar names

### What the player sees

Several familiar proper names or loanwords are written in an unfamiliar script. Some have translations or transliterations and some do not.

### What the player must infer

- writing direction;
- character-to-sound or character-to-letter correspondences;
- whether one visible unit represents a letter, syllable, or something else;
- how known correspondences constrain an unknown name.

### Natural interactions

- Click a character to highlight identical characters across all rows.
- Optionally assign a tentative Latin value or colour to a character.
- Type the unknown name.
- Show inferred correspondences only after submission or as late-stage hints.

Avoid requiring the player to construct a complete alphabet table when only a handful of correspondences are needed.

### Sample: Georgian Countries, Problem 1

The player receives Georgian spellings for Brazil, Peru, and Uruguay plus two untranslated spellings. Familiar country names, matching lengths, and repeated letters allow the player to infer direction and enough correspondences to identify Argentina and Colombia.

## Type 2: Unordered translation matching plus grammar induction

### What the player sees

A set of unfamiliar phrases and an equally sized set of translations in a different order. Repeated roots and grammatical forms overlap across the data.

### What the player must infer

- vocabulary correspondences;
- word order;
- number, case, possession, or agreement marking;
- which parts of a phrase vary together;
- how to construct a phrase not already shown.

### Natural interactions

- Pair items by selecting one from each column; avoid tangled connector lines on small screens.
- Highlight roots or endings shared by two selected phrases.
- Keep tentative matches visibly distinct from checked matches.
- Use text input or optional tokens for the productive translation task.
- Accept equivalent spacing or transcription variants when linguistically appropriate.

### Sample: Ancient Greek, Problem 2

Eight phrases describe combinations such as masters, slaves, sons, brothers, houses, merchants, and donkeys in singular or plural possessive constructions. The player first matches all translations, then produces two new phrases. Solving requires recovering roots, article and noun number, possessor forms, and phrase order.

### Sample: Kazakh, Problem 8

Number phrases joined by the word “and” are paired with unordered translations, and several words are missing. The player must recover number words, the construction of two-digit numbers, and sound-conditioned variants of the conjunction before translating four new phrases.

## Type 3: Paradigm completion and form transformation

### What the player sees

A table contains base forms, transformed forms, and meanings. Several transformed forms are blank.

### What the player must infer

- which ending or affix corresponds to the transformation;
- whether the form depends on the final sound or another class;
- whether spelling changes occur at the boundary;
- which apparent rule is actually a set of conditioned rules.

### Natural interactions

- Type directly into table blanks.
- Allow the player to mark or colour final letters and endings.
- Offer an optional row-comparison mode that aligns two forms.
- Check a row without necessarily revealing every other row.
- In the explanation, animate the boundary change rather than only displaying the completed table.

### Sample: Aragonese plurals, Problem 3

The table gives Aragonese singular nouns, plural forms, and English meanings. Some plurals are missing. Different singular endings select different plural spellings: words ending in vowels, `l`, `t`, and `x` do not all pluralise identically. The task is to complete five missing plurals.

### Sample: Guaraní verbs, Problem 16

Verb forms combine person, lexical root, tense, and negation. Nasal harmony and neighbouring sounds alter some affixes. The player translates five new forms into English and produces four Guaraní forms, so a useful interface must support multi-part morphology and several interacting conditions.

## Type 4: Spatial writing-system decomposition and construction

### What the player sees

Words are encoded as sequences of spatial symbols. Examples are sufficient to infer how different positions within a symbol contribute information.

### What the player must infer

- how a symbol is divided into functional regions;
- which position patterns encode vowels, consonants, syllables, or other features;
- how component patterns recombine;
- how to read and construct unseen symbols.

### Natural interactions

- Render symbols as semantic, keyboard-accessible grids rather than flat images.
- Allow cell overlays or side-by-side comparison.
- Match complete sequences to candidate words.
- Toggle dots or strokes to construct new symbols.
- Animate decomposition only in hints or the final explanation.

### Sample: Japanese Braille, Problem 4

The player sees Japanese loanwords written with six-dot tenji cells. After identifying six candidate words, the player decodes two additional sequences and writes two new words. The hidden system combines vowel and consonant patterns in different regions of each cell.

## Type 5: Unknown numeral notation inferred through arithmetic

### What the player sees

Equations use familiar arithmetic operators but unfamiliar number symbols. Known equations constrain the values and place system.

### What the player must infer

- symbol values;
- place value and numerical base;
- how multi-position numerals are composed;
- how to calculate and write new results.

### Natural interactions

- Provide an equation canvas with reusable unfamiliar symbols.
- Let players annotate a tentative value beside a symbol.
- Supply a symbol keypad for answers rather than requiring a special keyboard.
- Allow column alignment or place-value guides as optional scratch tools.
- Validate numeric equivalence separately from exact drawing order.

### Sample: Inuktitut Numbers, Problem 11

The problem presents arithmetic equations written with Kaktovik-style numeral symbols. From those equations, the player infers digit values and a base-20 positional system, solves a second set of operations, and writes the current date using the unfamiliar numerals.

## Type 6: Compositional numeral words

### What the player sees

Arithmetic facts are written using number words in an unfamiliar language. Some results or factors are blank, followed by conversion tasks in both directions.

### What the player must infer

- basic number vocabulary;
- additive and multiplicative construction;
- linking sounds or morphemes;
- boundaries where the construction changes.

### Natural interactions

- Align equations so repeated number words are easy to compare.
- Let the player attach tentative numeric values to words.
- Use token construction for new number words, with typing still available.
- Visualise the inferred arithmetic decomposition after solving.

### Sample: Basque Numbers, Problem 12

Several multiplication facts are written out in Basque. They expose basic number words and a vigesimal pattern for larger numbers. The player fills two gaps, converts two Basque forms into figures, and writes three figures in Basque.

## Type 7: Morphology and syntax recovered from translated sentences

### What the player sees

Several complete sentences are paired with translations. Roots and affixes recur, but meanings are distributed across word order and word-internal structure.

### What the player must infer

- vocabulary;
- word order;
- tense, aspect, possession, agreement, or derivation;
- how adjectives, verbs, or adverbs are related;
- how multiple rules combine in a new sentence.

### Natural interactions

- Select recurring substrings across sentences.
- Add optional visual morpheme boundaries.
- Translate using text entry, optionally supported by a root/affix tray.
- Compare a draft against the evidence without naming the rule.
- In explanations, layer glosses beneath forms only after the solve.

### Sample: Lalana Chinantec, Problem 5

Six sentences describe corn and pineapples becoming tall, yellow, beautiful, ripe, or good, with possession and aspect distinctions. The player identifies two word meanings, translates two new English sentences into Lalana Chinantec, and translates two forms into English.

## Type 8: Latent categories inferred from logical relations

### What the player sees

Statements connect unfamiliar labels through familiar constructions such as “and,” “but,” negation, or concession. The labels themselves may be invented or semantically opaque.

### What the player must infer

- an unseen binary or multi-way classification;
- which relations mean “same category” and which mean “different category”;
- how a small anchor fact propagates through a network of constraints.

### Natural interactions

- Highlight every occurrence of a label.
- Let players group labels or assign temporary colours.
- Visualise same/different constraints as an optional graph.
- Ask for classification or compatibility judgments.
- Do not reveal category names until the final explanation if their discovery is part of the puzzle.

### Sample: Molistic, Problem 6

Invented adjectives are linked by English sentence frames. Constructions such as “and” imply shared positive or negative polarity, while “but” and similar contrasts imply opposing polarity. One sentence provides an anchor for desirability. The player chooses which new sentence is plausible and which quality would be desirable.

## Type 9: Semantic distinction hidden by one translation word

### What the player sees

Several phrases have similar English translations, but the unfamiliar language uses different words depending on a physical or semantic distinction.

### What the player must infer

- the semantic dimension controlling the choice;
- which examples isolate that dimension;
- whether a new scene permits one answer or several;
- how to explain an ambiguity rather than eliminate it.

### Natural interactions

- Pair phrases with small scene diagrams when useful.
- Let the player compare examples using the competing terms.
- Accept multiple answers with a short justification or scene choice.
- Use animation in the explanation to change the spatial relation while preserving the English label.

### Sample: Persian spatial relations, Problem 7

Persian phrases use two expressions that English may translate with “under.” The distinction depends on whether the upper object fully covers the lower object. The player translates two phrases and fills gaps for a stone relative to water and a box relative to a tree, recognising that context can permit more than one answer.

## Type 10: Lexical decomposition and systematic compounds

### What the player sees

Many complex words or names are paired with meanings, categories, or transformations. Repeated pieces contribute stable meanings.

### What the player must infer

- component vocabulary;
- modifier–head order;
- productive compound templates;
- systematic transformations applied to one component;
- how to analyse or create unseen compounds.

### Natural interactions

- Highlight recurring substrings across many words.
- Let players split forms visually without altering the underlying text.
- Pair components with tentative meanings.
- Use token construction for new compounds.
- Provide filters for repeated components when the data set is large.

### Sample: Taikyoku Shōgi, Problem 9

A large table lists Japanese names of chess pieces, their English meanings, and the pieces they promote into. Repeated components encode animals, weapons, directions, materials, and ranks. Promotion changes components according to several semantic templates. The player fills more than thirty missing Japanese or English entries.

### Sample: Toki Pona compounds, Problem 18

Compound expressions built from a very small vocabulary are paired with unordered English meanings. The player matches all compounds, recovers the meanings of the simple words, and gives a literal interpretation of the language's name.

## Type 11: Historical sound correspondence plus compound interpretation

### What the player sees

Related words from two languages are aligned with meanings. Missing forms require regular sound correspondences; a second task uses word components inside place names.

### What the player must infer

- recurring sound substitutions, deletions, or shifts;
- the direction of change relevant to the blanks;
- lexical roots inside longer names;
- how sound correspondence and compound meaning interact.

### Natural interactions

- Align corresponding words character by character without assuming equal length.
- Colour proposed sound correspondences.
- Fill missing cognates in the table.
- Split place names into recovered components.
- Match complete place names to meanings only after component analysis.

### Sample: Tupinambá and Guaraní Mbya, Problem 10

The first table pairs words in the two related languages and leaves several forms or translations missing. The second task gives Brazilian place names of Tupí origin and unordered meanings. Solving requires regular sound correspondences, word-final changes, and the reuse of roots such as rock, water, colour, animal, and place terms.

## Type 12: Kinship terminology as a graph constraint problem

### What the player sees

A family tree with missing labels, or a list of people whose names encode ancestry. Statements in the target language describe family relationships.

### What the player must infer

- kinship vocabulary;
- gender-specific terms;
- possession or genitive marking;
- relationship symmetry and direction;
- a globally consistent assignment of people to nodes.

### Natural interactions

- Drag names into fixed tree nodes.
- Click a person to highlight relatives implied by a statement.
- Permit tentative placements and flag contradictions only on request.
- Use relation selectors or text entry for missing kinship terms.
- Preserve an accessible list representation of the tree.

### Sample: Basque Kinship, Problem 13

A family tree contains four unnamed people. Basque sentences state sibling, spouse, child, and parent relationships, with distinct terms depending on gender. The player places the four names, determines one person's gender, and completes six new relationship statements.

### Sample: Icelandic Kinship and Names, Problem 14

A guest list from a large family celebration encodes parents and grandparents through Icelandic patronymic and matronymic naming. Some people also carry inherited family surnames. The player reconstructs several generations to answer questions about descent, children, inherited names, and possible names for future or previously unnamed family members.

## Type 13: Spatial frame-of-reference inference

### What the player sees

A map or scene and sentences describing the location of landmarks using unfamiliar directional terms. Some locations are known and others must be recovered.

### What the player must infer

- meanings of direction words;
- whether directions are relative, cardinal, landmark-based, or geocentric;
- how combined directions work;
- how the frame changes across the map.

### Natural interactions

- Drag labels onto map positions.
- Draw or toggle directional rays from a selected landmark.
- Keep every sentence visible beside the map.
- Let players test placements and see which statements remain consistent.
- Animate the recovered frame of reference only in the explanation.

### Sample: Manam, Problem 15

Eight houses surround a volcano. Manam sentences locate pairs of houses using inland/seaward and clockwise/counter-clockwise directions, including combined directions. Three houses are pre-labelled. The player locates the remaining five and describes a new house relative to its nearest neighbours.

## Type 14: Illustration-to-description matching with a hidden anomaly

### What the player sees

Illustrations show quantities or categories of objects. Sentences in the target language describe them, but the pairing is unknown and one statement may be false.

### What the player must infer

- number words;
- size, class, or object vocabulary;
- sentence structure for one versus multiple categories;
- which pairing leaves a contradiction;
- how to describe a new illustration.

### Natural interactions

- Match each sentence to an illustration.
- Allow one item to be marked as the anomaly or liar.
- Highlight visual quantities while comparing sentences.
- Construct the final description with text or tokens.
- Explain the contradiction after the player commits to a complete assignment.

### Sample: Aymara fishermen, Problem 17

Seven fishermen display catches containing different counts and sizes of fish. Seven Aymara sentences describe the catches, but one fisherman is lying. The player matches every description, identifies the liar, and writes an Aymara description of a new illustrated catch.

## Choosing an interaction for a new problem

Start with the reasoning action a solver would naturally perform on paper:

1. What would they underline, circle, align, count, split, or draw?
2. Which of those actions contains information the computer can preserve or respond to?
3. Which final answer demonstrates understanding?
4. Can the digital tool remain optional until the player chooses to use it?
5. Does the interaction still work for keyboard, touch, screen-reader, and non-Latin-script users?

If no specialised interaction materially improves the problem, keep the original data visible and use a well-designed answer field. A plain input is better than decorative interactivity that narrows the reasoning.

