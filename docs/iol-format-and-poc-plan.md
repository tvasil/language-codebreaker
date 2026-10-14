# IOL Format Notes and POC Plan

This is a living design document for **Crack the Language**. It records what we learn from International Linguistics Olympiad (IOL) problems and turns those observations into an initial proof-of-concept plan.

The official abbreviation is **IOL**, rather than ILO. The organisation chose a language-neutral abbreviation.

## Working sources

- [IOL Sample Problems, 2026 revision](../samples-revision2026.en.pdf)
- [Official IOL sample problem archive](https://ioling.org/problems/samples/)
- [Official IOL problems by year](https://ioling.org/problems/by_year)
- [Official regulations](https://ioling.org/regulations/online/)
- [Contestant guidelines](https://ioling.org/guidelines/en/)
- [IOL FAQ](https://ioling.org/faq/)
- [Official solution-presentation archive](https://ioling.org/problems/slides/)

## What the formal competition looks like

The international individual contest consists of five independent problems. Contestants may solve them in any order and have six hours for the complete set. The team contest consists of one longer problem, normally with three or four hours available.

The competition is deliberately low-tech: contestants receive the problems on paper, work without outside references or calculators, and submit written solutions. A solution is expected to include relevant patterns or rules, not only final answers.

These contest constraints should inform the game, but do not need to be reproduced literally. A browser session should be shorter and may provide optional hints, immediate validation, and an interactive explanation after a solve.

## The core IOL problem contract

An IOL-style problem is **self-contained**. The player is not expected to know the language or linguistic terminology in advance. The problem supplies a finite set of data and asks the solver to infer a system from it.

The recurring contract is:

1. Introduce an unfamiliar language, script, notation, or classification system.
2. Supply enough paired or structured data to make the hidden rule recoverable.
3. Ask one or more concrete questions whose answers depend on that rule.
4. Frequently end with a productive task: translate a new expression, construct a new form, place an unseen item, or explain the pattern.
5. Provide only the phonetic, orthographic, cultural, or diagram-reading notes that are necessary to interpret the data.

The strongest problems create a moment where initially opaque material becomes systematic. The pleasure comes from discovering that the evidence was sufficient all along.

## Common anatomy of a problem

Not every problem uses every element, and the order can vary.

### 1. Minimal orientation

A short paragraph identifies the language or system and supplies relevant context. Context should motivate the problem or prevent misunderstanding; it should not teach the solution.

### 2. The data set

The evidence may appear as:

- paired words or sentences and translations;
- translations supplied out of order;
- incomplete paradigms or tables;
- names written in an unfamiliar script;
- diagrams, maps, family trees, or illustrations;
- mathematical operations written with an unfamiliar numeral system;
- related forms from two languages;
- statements that collectively encode a hidden classification.

The evidence normally stays visible while the solver answers the questions. It is not a tutorial sequence that reveals one fact at a time.

### 3. Tasks with increasing commitment

Tasks often progress through some combination of:

- identify or match known items;
- fill missing forms;
- translate in the easier direction;
- translate or construct in the harder direction;
- apply the inferred system to a new example;
- explain the rule or justify an ambiguity.

This escalation is useful for the browser game. It allows early sub-questions to confirm partial understanding while preserving a final generative challenge.

### 4. Necessary notes

Notes define unfamiliar transcription symbols, pronunciation conventions, proper-name gender, or relevant cultural facts. They are part of the problem specification rather than optional educational content.

### 5. An explanatory solution

The official sample solutions reconstruct the system: alphabet correspondences, morphemes, word order, number construction, spatial frames of reference, or another rule. This explanatory layer is a natural basis for the game's post-solve reveal.

## What makes the problems feel good

### Information is dense but fair

Almost every example serves more than one purpose. Repetition establishes correspondences; contrasts isolate a rule; apparent exceptions expose a second rule. Extra data should support confirmation or disambiguation rather than act as decoration.

### The player performs induction and then production

Recognising a pattern is rarely the endpoint. The player must use it to generate, decode, translate, locate, or classify something not already answered in the evidence.

### Surface familiarity provides a foothold

The Georgian Countries problem uses familiar country names. Japanese Braille uses familiar loanwords. Numeral problems use arithmetic. Kinship problems use family structure. These footholds let the player enter an unfamiliar system without prior linguistic knowledge.

### The representation is part of the reasoning

Tables, diagrams, dot cells, maps, and images are not illustrations added after the fact. They encode constraints. A web adaptation should preserve or strengthen the useful representation instead of flattening every problem into paragraphs and text fields.

### Ambiguity can be intentional

Some questions accept more than one answer when the supplied data supports more than one interpretation. The Persian problem, for example, asks the solver to notice two spatial relations that English can both describe as “under.” The game engine must be able to accept multiple justified answers rather than force every task into exact-string grading.

## Implications for Crack the Language

### Preserve the problem as the main object

The data and tasks should remain together on a stable problem canvas. We should not move all evidence into a separate universal “evidence board.” Doing so would weaken diagrams, spatial layouts, and carefully arranged tables.

### Standardise the shell, not the reasoning surface

Each round can share:

- title, difficulty, and progress;
- problem statement and source attribution;
- a place for tasks and answers;
- optional scratch space;
- a progressive hint control;
- answer checking;
- a post-solve explanation and language reveal.

The central interaction should be selected for the problem: matching, marking, filling, arranging, drawing dot cells, placing labels on a map, or another suitable mechanism.

### Avoid the hypothesis builder in the POC

The POC will not require players to formalise a hypothesis in a special interface. The player's answer is already a test of the hypothesis. We can revisit explicit rule-building only if playtests show that it adds something the problems and explanations do not provide.

### Treat annotation as an optional tool

Highlighting repeated symbols, colouring endings, or making notes can help the player think. These tools should not disclose the intended analysis or become mandatory steps.

### Use hints to direct attention, not replace deduction

Hints should be tied to the actual evidence. A useful progression is:

1. indicate which examples are worth comparing;
2. ask what changes or repeats;
3. mark the relevant location or contrast;
4. state one part of the rule;
5. demonstrate the rule only as a final rescue.

Animated highlighting can be added later. The first POC only needs the content and state model for progressive hints.

### Make the solution an interactive replay

After a solve, the game can replay the decisive observations in order. For Georgian Countries, this might show matching character counts, the repeated character in Uruguay, inferred writing direction, and transferred letter correspondences. This is more educational without interrupting discovery.

## Chosen visual direction

The selected visual baseline is the first Georgian Countries mockup: [warm scholarly case-file reference](assets/crack-the-language-style-reference.png).

The implementation should preserve its strongest qualities:

- warm off-white background and restrained paper-like surfaces;
- dark ink typography with a refined editorial serif for prominent headings;
- muted terracotta for the primary action;
- amber character highlights and cool blue-gray dividers;
- generous whitespace and a calm two-column problem/answer hierarchy;
- a slightly mysterious, collected-document atmosphere.

It should adapt rather than literally reproduce the decorative scene. Maps, leaves, pens, and notebook edges are optional mood cues, not required UI. The working product should feel like a contemporary scholarly case file, not a travel diary, cookbook, antique archive, or school worksheet.

The source problem remains the visual focus. Decoration must never compete with non-Latin text or make the layout harder to adapt to other problem types.

## Authoring checklist for future original puzzles

Use this checklist when adapting a documented linguistic phenomenon into an original problem.

### The hidden system

- What exact rule or set of rules should the player discover?
- Can the rule be stated unambiguously by an expert?
- Does the final task require applying the rule rather than recalling trivia?

### The data

- What is the smallest data set that makes the answer recoverable?
- Which examples establish each correspondence or contrast?
- Are there enough examples to rule out plausible but incorrect analyses?
- Are any examples redundant without providing useful confirmation?
- Does ordering or visual grouping accidentally reveal too much?

### The tasks

- Is there an accessible first task?
- Does a later task combine more than one discovered rule?
- Is there a productive or predictive final task?
- If multiple answers are possible, can the player justify them?

### Fairness

- Is every required fact contained in the problem?
- Could prior knowledge create an unintended shortcut?
- Does the player's working language introduce clues or difficulties?
- Have Unicode, directionality, grapheme boundaries, and font rendering been checked?

### Accuracy and respect

- Is every linguistic form traceable to a reliable source?
- Have dialect, orthography, and transcription choices been recorded?
- Has the problem been reviewed by a qualified speaker, teacher, or linguist where practical?
- Does the cultural context avoid presenting a living community as an exotic curiosity?

### Interaction

- What action best mirrors the reasoning the player would do on paper?
- Can the problem remain usable without that action?
- How will partial answers, alternative answers, and explanations be evaluated?
- What evidence should each progressive hint draw attention to?

## POC question

Can three IOL-style problems become more approachable and satisfying in a browser through restrained, problem-specific interaction, without losing the open-ended deduction that makes the paper problems appealing?

## POC scope

The proof of concept adapts three problems from the IOL sample booklet. It is being prepared for an attributed, non-commercial public release while reuse permission requests remain pending; see the licensing status below.

### Round 1: Georgian Countries — deciphering

**Source:** Sample Problem 1, credited in the booklet to Bruno L'Astorina and the 2016 Brazilian Linguistics Olympiad.

**Player sees:** Three South American country names written in Georgian beside their English names, followed by two untranslated Georgian names.

**Core reasoning:** Infer character correspondences and writing direction from familiar proper names, then identify the two unknown countries.

**POC interaction:**

- Keep all five names together.
- Let the player select a Georgian character and softly highlight identical characters in every row.
- Provide two plain text-answer fields.
- Keep character marking optional; direct answering must remain possible.

**Possible hints:** Compare the character counts for Peru and Uruguay; look for a repeated sound and repeated character in Uruguay; determine the writing direction; transfer known correspondences to the unknown names.

**Post-solve replay:** Animate the minimum chain of correspondences that reveals Argentina and Colombia.

### Round 2: Ancient Greek — matching and construction

**Source:** Sample Problem 2, credited to Todor Tchervenkov and the 2007 North American Computational Linguistics Olympiad.

**Player sees:** Eight Ancient Greek phrases in Roman transcription and eight English translations in a different order. The phrases combine articles, nouns, number, and possession.

**Core reasoning:** Use repeated roots and grammatical endings to recover vocabulary, singular/plural marking, possessive structure, and word order.

**POC interaction:**

- Pair each Greek phrase with an English translation by selecting one item in each column.
- Allow pairs to be changed freely before checking.
- For the productive task, use either typed responses or an optional token tray containing forms already seen in the evidence.
- Keep the entire matched data set visible while constructing the new phrases.

**Possible hints:** Start with phrases sharing a repeated noun; compare singular and plural articles; isolate the possessor; identify the order of possessor and possessed noun.

**Post-solve replay:** Build one phrase in layers—articles, owner, owned noun, and number endings—then show how the same rule generates the requested new forms.

### Round 3: Japanese Braille — spatial writing system

**Source:** Sample Problem 4, credited to Patrick Littell and the 2009 North American Computational Linguistics Olympiad.

**Player sees:** Japanese loanwords and corresponding six-dot tenji cells, including a labelled example, six forms to identify, two forms to decode, and two words to write.

**Core reasoning:** Discover how different regions of each six-dot cell combine consonant and vowel information, then read and construct new cells.

**POC interaction:**

- Render tenji cells as accessible interactive dot grids rather than images.
- Match the six candidate words to the six sequences.
- Enter decoded words for the reading task.
- Construct new characters by toggling dots in empty cells.
- Preserve a keyboard-accessible alternative for every dot control.

**Possible hints:** Compare words that share a vowel; compare words that share an initial consonant; split the cell into its two information regions; overlay two examples to isolate one component.

**Post-solve replay:** Separate the cell into consonant and vowel patterns, recombine them, and animate the construction of one requested word.

## Prototype shortcuts

The POC intentionally omits:

- a hypothesis builder;
- accounts or cloud progress;
- scoring, streaks, currencies, or timers;
- a general puzzle-authoring interface;
- animated hints beyond simple highlighting;
- a complete mobile interaction pass;
- an “Olympiad mode” with five long problems and no assistance;
- commercial hosting, monetisation, or representing the project as endorsed by the source organisations.

These are prototype shortcuts, not final product decisions.

## POC success signals

Test with a small group who have not previously seen the three problems.

- Players understand how to begin without a separate tutorial.
- The problem data remains the visual focus.
- Added interactions help comparison or construction without exposing the solution.
- Players can complete Round 1 in roughly three to five minutes.
- Players can explain the discovered rule after the post-solve replay.
- At least one later round produces a clear “I figured it out” reaction.
- Players do not describe the experience primarily as a worksheet or quiz.
- The three rounds feel like one product even though their working surfaces differ.

## Licensing status

The focused licensing review found **no explicit reuse or adaptation licence** on the official IOL site, sample-problem page, sample PDF, regulations, or FAQ. Official pages carry a copyright footer, and the sample page invites visitors to download and solve the problems without granting permission to reproduce or transform them.

Public availability therefore does not by itself establish permission to republish or adapt the problems. An interactive browser version with altered layout, hints, answer checking, and animated explanations should be treated as an adaptation requiring clearance.

The sample booklet names both authors and originating competitions, but does not say whether the authors assigned copyright to those organisations. The likely clearance parties for the POC are:

| Problem | Credited parties to ask |
|---|---|
| Georgian Countries | Bruno L'Astorina; Brazilian Linguistics Olympiad (OBL); IOL for the sample compilation |
| Ancient Greek | Todor Tchervenkov; North American Computational Linguistics Olympiad (NACLO); IOL for the sample compilation |
| Japanese Braille | Patrick Littell; NACLO; IOL for the sample compilation |

NACLO's official 2009 problem booklet is especially relevant: it identifies NACLO and the authors as copyright holders and says the material should not be copied or distributed without permission. The [NACLO practice archive](https://www.naclo.org/practice.php) identifies the source problems as **A donkey in every house** by Todor Tchervenkov and **Tenji karaoke** by Patrick Littell. The [2009 booklet](https://naclo.org/resources/problems/2009/naclo09prob_r1.pdf) contains the copyright and permission notice.

The Brazilian Linguistics Olympiad also displays a general copyright notice without a public adaptation licence. Its [organisation page](https://obling.org/quem-somos) lists `organiza@obling.org` as a contact address.

### Recommended clearance route

1. Ask IOL through its [official contact form](https://ioling.org/contact/) whether it can authorise interactive adaptations of these three sample problems or only the sample compilation.
2. Contact OBL at `organiza@obling.org` about Georgian Countries.
3. Contact NACLO at `nacloinquiries@googlegroups.com` about Ancient Greek and Japanese Braille.
4. Ask each organisation whether it can authorise the named author's contribution; if not, request an introduction to the author.
5. Request permission that explicitly covers reproduction of the data and wording, interactive adaptation, altered layout, hints, answer checking, explanations, public web distribution, commercial or noncommercial use, attribution, and source-code distribution.
6. Keep a rights ledger beside the puzzle content recording the material, claimed rightsholder, contact, request date, response, permitted uses, required attribution, and expiry or revocation terms.

The project owner has chosen a risk-managed public prototype release while permission requests are pending. The release must retain complete attribution, source links, a clear split between the MIT-licensed code and excluded puzzle content, a non-affiliation statement, and a prompt removal path. This publication approach does not establish that permission is unnecessary or that fair use/fair dealing is guaranteed. If permission is declined or removal is requested, the affected sample should be replaced with an original problem based on independently sourced linguistic facts, with new data selection, wording, tasks, and explanations.

This is a practical product recommendation rather than legal advice. A commercial release may warrant formal legal review even after permissions are received.

## Open design questions

- Should one problem be called a “round,” “case,” or “problem” in the product?
- Should answer checking happen per sub-question or only after the full problem?
- How much annotation should be saved when a player leaves and returns?
- Should the player see the language name before solving every problem?
- How should explanations handle a correct answer reached through a different valid analysis?
- What is the minimum useful mobile layout for wide tables and spatial writing systems?

