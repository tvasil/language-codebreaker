export type Dots = readonly [boolean, boolean, boolean, boolean, boolean, boolean];

const dots = (...raised: number[]): Dots =>
  ([1, 4, 2, 5, 3, 6].map((position) => raised.includes(position)) as unknown) as Dots;

export const tenji = {
  a: dots(1),
  i: dots(1, 2),
  u: dots(1, 4),
  e: dots(1, 2, 4),
  o: dots(2, 4),
  ka: dots(1, 6),
  ki: dots(1, 2, 6),
  ku: dots(1, 4, 6),
  ke: dots(1, 2, 4, 6),
  ko: dots(2, 4, 6),
  sa: dots(1, 5, 6),
  so: dots(2, 4, 5, 6),
  ta: dots(1, 3, 5),
  te: dots(1, 2, 3, 4, 5),
  na: dots(1, 3),
  ni: dots(1, 2, 3),
  no: dots(2, 3, 4),
  ha: dots(1, 3, 6),
  mi: dots(1, 2, 3, 5, 6),
  mu: dots(1, 3, 4, 5, 6),
  me: dots(1, 2, 3, 4, 5, 6),
  mo: dots(2, 3, 4, 5, 6),
  ra: dots(1, 5),
  ri: dots(1, 2, 5),
} as const;

export const brailleSequences = [
  { id: "a", cells: [tenji.ha, tenji.i, tenji.ku] },
  { id: "b", cells: [tenji.sa, tenji.ke] },
  { id: "c", cells: [tenji.ka, tenji.ta, tenji.na] },
  { id: "d", cells: [tenji.ki, tenji.mo, tenji.no] },
  { id: "e", cells: [tenji.ko, tenji.i] },
  { id: "f", cells: [tenji.a, tenji.ta, tenji.ri] },
] as const;

export const brailleMatchAnswers: Record<string, string> = {
  a: "haiku",
  b: "sake",
  c: "katana",
  d: "kimono",
  e: "koi",
  f: "atari",
};

export const brailleDecode = [
  { id: "g", cells: [tenji.ka, tenji.ra, tenji.te], answer: "karate" },
  { id: "h", cells: [tenji.a, tenji.ni, tenji.me], answer: "anime" },
] as const;

export const brailleWrite = [
  { id: "samurai", cells: [tenji.sa, tenji.mu, tenji.ra, tenji.i] },
  { id: "miso", cells: [tenji.mi, tenji.so] },
] as const;

export const greekPhrases = [
  ["1", "ho tōn hyiōn dulos"],
  ["2", "hoi tōn dulōn cyrioi"],
  ["3", "hoi tu emporu adelphoi"],
  ["4", "hoi tōn onōn emporoi"],
  ["5", "ho tu cyriu onos"],
  ["6", "ho tu oicu cyrios"],
  ["7", "ho tōn adelphōn oicos"],
  ["8", "hoi tōn cyriōn hyioi"],
] as const;

export const greekTranslations = [
  ["A", "the donkey of the master"],
  ["B", "the brothers of the merchant"],
  ["C", "the merchants of the donkeys"],
  ["D", "the sons of the masters"],
  ["E", "the slave of the sons"],
  ["F", "the masters of the slaves"],
  ["G", "the house of the brothers"],
  ["H", "the master of the house"],
] as const;

export const greekMatchAnswers: Record<string, string> = {
  "1": "E",
  "2": "F",
  "3": "B",
  "4": "C",
  "5": "A",
  "6": "H",
  "7": "G",
  "8": "D",
};
