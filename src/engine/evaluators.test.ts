import { describe, expect, it } from "vitest";
import {
  comparePhrases,
  evaluateMapping,
  evaluateTextAnswers,
  firstDifferingWordPosition,
  graphemeEditDistance,
  matchesAnswer,
  normalizeAnswer,
  sameDots,
  tokenizeNormalizedText,
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

  it("tokenizes normalized text on spaces", () => {
    expect(tokenizeNormalizedText("  ho   emporos  ")).toEqual(["ho", "emporos"]);
    expect(tokenizeNormalizedText("   ")).toEqual([]);
  });

  it("calculates edit distance over normalized grapheme clusters", () => {
    expect(graphemeEditDistance("o\u0304", "ō")).toBe(0);
    expect(graphemeEditDistance("oikos", "oikois")).toBe(1);
    expect(graphemeEditDistance("oikos", "oikosu")).toBe(1);
    expect(graphemeEditDistance("oikos", "oiko")).toBe(1);
  });

  it("reports the first differing word using a 1-based position", () => {
    expect(firstDifferingWordPosition("ho emporos en oikō", "ho emporos eis oikō")).toBe(3);
    expect(firstDifferingWordPosition("ho emporos", "ho emporos en oikō")).toBe(3);
    expect(firstDifferingWordPosition("ho  emporos", "ho emporos")).toBeNull();
  });

  it("identifies a phrase that is exactly one grapheme edit away", () => {
    expect(comparePhrases("ho emporos en oiko", "ho emporos en oikō")).toEqual({
      distance: 1,
      isVeryClose: true,
      firstDifferingWord: 4,
    });
    expect(comparePhrases("ho emporos en oikō", "ho emporos en oikō")).toEqual({
      distance: 0,
      isVeryClose: false,
      firstDifferingWord: null,
    });
  });
});

describe("Unicode segmentation", () => {
  it("keeps grapheme clusters intact", () => {
    expect(segmentGraphemes("o\u0304")).toEqual(["o\u0304"]);
    expect(segmentGraphemes("პერუ")).toEqual(["პ", "ე", "რ", "უ"]);
  });
});
