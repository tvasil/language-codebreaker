# Language Codebreaker

Language Codebreaker is a browser-based linguistic puzzle prototype. It explores how restrained, problem-specific interactions can make self-contained linguistics problems more approachable without removing the underlying deduction.

**Play the live prototype:** [language-codebreaker.pages.dev](https://language-codebreaker.pages.dev/) · [View the source on GitHub](https://github.com/tvasil/language-codebreaker)

This is an independent, non-commercial educational project. It is not affiliated with or endorsed by the International Linguistics Olympiad (IOL), the Brazilian Linguistics Olympiad (OBL), or the North American Computational Linguistics Open Competition (NACLO). The prototype has no advertising, paywall, sponsorship, or behavioural tracking.

## The three cases

| Case | Original problem | Author and origin | Official sources | Permission status |
|---|---|---|---|---|
| Georgian Countries | *Georgian Countries* | Bruno L’Astorina, Brazilian Linguistics Olympiad 2016 | [IOL sample problem](https://ioling.org/booklets/samples.en.pdf) | Author permission received; OBL permission pending |
| Ancient Greek | *A Donkey in Every House* | Todor Tchervenkov, NACLO 2007 | [Problem](https://naclo.org/resources/problems/2007/N2007-C.pdf) · [Solution](https://naclo.org/resources/problems/2007/N2007-CS.pdf) | Author permission received; NACLO permission pending |
| Japanese Braille | *Tenji Karaoke* | Patrick Littell, NACLO 2009 | [Problem](https://naclo.org/resources/problems/2009/N2009-A.pdf) · [NACLO archive](https://naclo.org/practice.php) | Author permission received; NACLO permission pending |

Each case includes visible attribution and a direct link to an official source. The adaptations add browser interactions, progressive hints, answer checking, and short explanatory reveals. These author-created cases are offered for free educational use; author permission does not grant commercial rights or permission to reuse the content independently. Permission from the relevant competition organisations is still pending.

## Run locally

```sh
npm install
npm run dev
```

Use the numbered case navigation to move between the three puzzles.

## Check the project

```sh
npm test
npm run build
```

The build output is written to `dist/`.

## Deploy to Cloudflare Pages

Connect the GitHub repository to Cloudflare Pages and use:

- Framework preset: **React (Vite)**
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: the repository root

Use a preview deployment to check the three complete cases and their source links before promoting the same commit to production. Client-side analytics and advertising are intentionally out of scope for this prototype.

## Licensing and third-party content

The original application code and original project documentation are licensed under the [MIT License](LICENSE), except where those files incorporate the third-party puzzle material described below.

The adapted puzzle statements, datasets, answer material, and puzzle-specific explanations are **not** covered by the MIT License. They remain copyrighted by their respective authors and organisations, and this repository grants no licence to reuse them. They are identified in [THIRD_PARTY_CONTENT.md](THIRD_PARTY_CONTENT.md) and included in this non-commercial educational prototype with attribution while reuse permission is being requested.

The public repository is therefore open source with respect to its original software, not with respect to the third-party puzzle content. Public availability, attribution, and non-commercial intent should not be interpreted as an open-content licence or as approval from the named organisations.

The current clearance work is recorded in the [puzzle-content rights ledger](docs/rights-ledger.md). If a rightsholder requests a change or removal, the affected adaptation will be reviewed promptly and can be disabled or replaced independently of the application code.

## Project notes

- [POC handoff plan](docs/poc-handoff-plan.md)
- [IOL format notes and POC research](docs/iol-format-and-poc-plan.md)
- [Problem types and natural interactions](docs/problem-types-and-interactions.md)
- [Selected visual reference](docs/assets/language-codebreaker-style-reference.png)
