import { describe, expect, it } from "vitest";
import {
  evaluateMapping,
  evaluateTextAnswers,
  matchesAnswer,
  normalizeAnswer,
  sameDots,
} from "./evaluators";
import { segmentGraphemes } from "./unicode";

describe("answer evaluation", () => {
  it("normalizes NFC, harmless whitespace, and optional English case", () => {
    expect(normalizeAnswer("  The   House  ", true)).toBe("the house");
    expect(matchesAnswer(" COLOMBIA ", ["Colombia"], true)).toBe(true);
    expect(matchesAnswer("o\u0304", ["ō"])).toBe(true);
  });

  it("distinguishes incomplete, incorrect, and correct text answers", () => {
    const accepted = [["Argentina"], ["Colombia"]] as const;
    expect(evaluateTextAnswers(["", "Colombia"], accepted, true)).toBe("incomplete");
    expect(evaluateTextAnswers(["Chile", "Colombia"], accepted, true)).toBe("incorrect");
    expect(evaluateTextAnswers(["argentina", "COLOMBIA"], accepted, true)).toBe("correct");
  });

  it("checks complete mappings", () => {
    expect(evaluateMapping({ a: "x" }, { a: "x", b: "y" })).toBe("incomplete");
    expect(evaluateMapping({ a: "x", b: "z" }, { a: "x", b: "y" })).toBe("incorrect");
    expect(evaluateMapping({ a: "x", b: "y" }, { a: "x", b: "y" })).toBe("correct");
  });

  it("compares structured dot arrays", () => {
    expect(sameDots([true, false, true], [true, false, true])).toBe(true);
    expect(sameDots([true, false], [true, true])).toBe(false);
  });
});

describe("Unicode segmentation", () => {
  it("keeps grapheme clusters intact", () => {
    expect(segmentGraphemes("o\u0304")).toEqual(["o\u0304"]);
    expect(segmentGraphemes("პერუ")).toEqual(["პ", "ე", "რ", "უ"]);
  });
});
