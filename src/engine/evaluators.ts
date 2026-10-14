import { segmentGraphemes } from "./unicode";

export type CheckState = "idle" | "incomplete" | "incorrect" | "correct";

export type PhraseComparison = Readonly<{
  distance: number;
  isVeryClose: boolean;
  firstDifferingWord: number | null;
}>;

export function normalizeAnswer(value: string, caseFold = false): string {
  const normalized = value.normalize("NFC").trim().replace(/\s+/gu, " ");
  return caseFold ? normalized.toLocaleLowerCase("en") : normalized;
}

export function matchesAnswer(
  value: string,
  accepted: readonly string[],
  caseFold = false,
): boolean {
  const candidate = normalizeAnswer(value, caseFold);
  return accepted.some((answer) => normalizeAnswer(answer, caseFold) === candidate);
}

export function tokenizeNormalizedText(value: string, caseFold = false): string[] {
  const normalized = normalizeAnswer(value, caseFold);
  return normalized === "" ? [] : normalized.split(" ");
}

export function graphemeEditDistance(
  left: string,
  right: string,
  caseFold = false,
): number {
  const leftGraphemes = segmentGraphemes(normalizeAnswer(left, caseFold));
  const rightGraphemes = segmentGraphemes(normalizeAnswer(right, caseFold));

  let previousRow = Array.from({ length: rightGraphemes.length + 1 }, (_, index) => index);

  leftGraphemes.forEach((leftGrapheme, leftIndex) => {
    const currentRow = [leftIndex + 1];

    rightGraphemes.forEach((rightGrapheme, rightIndex) => {
      const insertion = currentRow[rightIndex] + 1;
      const deletion = previousRow[rightIndex + 1] + 1;
      const substitution = previousRow[rightIndex] + (leftGrapheme === rightGrapheme ? 0 : 1);
      currentRow.push(Math.min(insertion, deletion, substitution));
    });

    previousRow = currentRow;
  });

  return previousRow[rightGraphemes.length];
}

export function firstDifferingWordPosition(
  left: string,
  right: string,
  caseFold = false,
): number | null {
  const leftWords = tokenizeNormalizedText(left, caseFold);
  const rightWords = tokenizeNormalizedText(right, caseFold);
  const sharedLength = Math.min(leftWords.length, rightWords.length);

  for (let index = 0; index < sharedLength; index += 1) {
    if (leftWords[index] !== rightWords[index]) return index + 1;
  }

  return leftWords.length === rightWords.length ? null : sharedLength + 1;
}

export function comparePhrases(
  candidate: string,
  expected: string,
  caseFold = false,
): PhraseComparison {
  const distance = graphemeEditDistance(candidate, expected, caseFold);

  return {
    distance,
    isVeryClose: distance === 1,
    firstDifferingWord: firstDifferingWordPosition(candidate, expected, caseFold),
  };
}

export function evaluateTextAnswers(
  answers: readonly string[],
  accepted: readonly (readonly string[])[],
  caseFold = false,
): CheckState {
  if (answers.some((answer) => normalizeAnswer(answer) === "")) return "incomplete";
  return answers.every((answer, index) => matchesAnswer(answer, accepted[index], caseFold))
    ? "correct"
    : "incorrect";
}

export function evaluateMapping(
  answers: Readonly<Record<string, string>>,
  expected: Readonly<Record<string, string>>,
): CheckState {
  if (Object.keys(expected).some((key) => !answers[key])) return "incomplete";
  return Object.entries(expected).every(([key, value]) => answers[key] === value)
    ? "correct"
    : "incorrect";
}

export function sameDots(a: readonly boolean[], b: readonly boolean[]): boolean {
  return a.length === b.length && a.every((dot, index) => dot === b[index]);
}
