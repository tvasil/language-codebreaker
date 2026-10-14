export function segmentGraphemes(value: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const Segmenter = Intl.Segmenter;
    return Array.from(new Segmenter("ka", { granularity: "grapheme" }).segment(value), ({ segment }) => segment);
  }

  return Array.from(value.normalize("NFC"));
}
