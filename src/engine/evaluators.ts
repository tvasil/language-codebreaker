export type CheckState = "idle" | "incomplete" | "incorrect" | "correct";

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
