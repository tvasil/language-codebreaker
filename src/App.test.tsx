// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";

afterEach(cleanup);

async function renderGame(user: ReturnType<typeof userEvent.setup>) {
  const rendered = render(<App />);
  await user.click(screen.getByRole("button", { name: "Start playing" }));
  return rendered;
}

describe("prototype interactions", () => {
  it("shows a dismissible and refindable game introduction over case one", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "Countries in Disguise" })).toBeTruthy();
    expect(screen.getByRole("dialog", { name: "Discover how languages work, one pattern at a time." })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Discover how languages work, one pattern at a time." })).toBeTruthy();
    expect(screen.getByText(/International Linguistics Olympiad/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "sample problems booklet" }).getAttribute("href")).toBe("https://ioling.org/booklets/samples.en.pdf");

    await user.click(screen.getByRole("button", { name: "Start playing" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("heading", { name: "Countries in Disguise" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "About this game" }));
    expect(screen.getByRole("dialog", { name: "Discover how languages work, one pattern at a time." })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Close game introduction" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("supports marking, pairing, and dot editing with native controls", async () => {
    const user = userEvent.setup();
    await renderGame(user);

    const matchingU = screen.getAllByRole("button", { name: /უ, character/ });
    expect(matchingU).toHaveLength(4);
    await user.click(matchingU[0]);
    matchingU.forEach((button) => expect(button.getAttribute("aria-pressed")).toBe("true"));

    await user.click(screen.getByRole("button", { name: /Open case 2/ }));
    await user.click(screen.getByRole("button", { name: /E.*the slave of the sons/ }));
    await user.click(screen.getByRole("button", { name: "Assign translation E to phrase 1" }));
    expect(screen.getByRole("button", { name: /Phrase 1 is paired with translation E/ })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /Open case 3/ }));
    const firstSamuraiCell = screen.getByRole("group", { name: "samurai, cell 1" });
    const firstDot = within(firstSamuraiCell).getByRole("button", { name: "Dot 1, empty" });
    await user.click(firstDot);
    expect(within(firstSamuraiCell).getByRole("button", { name: "Dot 1, raised" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("keeps revealed hints isolated between cases", async () => {
    const user = userEvent.setup();
    await renderGame(user);

    await user.click(screen.getByRole("button", { name: "Need a hint?" }));
    expect(screen.getByText("1 of 4 hints revealed")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /Open case 2/ }));
    expect(screen.getByText("0 of 5 hints revealed")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Need a hint?" }).getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText(/Begin with Peru and Uruguay/)).toBeNull();

    await user.click(screen.getByRole("button", { name: /Open case 1/ }));
    expect(screen.getByText("1 of 4 hints revealed")).toBeTruthy();
    expect(screen.getByText(/Begin with Peru and Uruguay/)).toBeTruthy();
  });

  it("inserts a selected Georgian character into scratch notes", async () => {
    const user = userEvent.setup();
    await renderGame(user);

    await user.click(screen.getAllByRole("button", { name: /უ, character/ })[0]);
    await user.click(screen.getByRole("button", { name: "Insert into scratch" }));

    const notes = screen.getByRole("textbox", { name: "Private scratch notes" }) as HTMLTextAreaElement;
    expect(notes.value).toBe("უ");
    expect(screen.getByText("უ added to scratch notes.")).toBeTruthy();
  });

  it("offers keyboard highlighting and keeps translation assignments unique", async () => {
    const user = userEvent.setup();
    const { container } = await renderGame(user);

    await user.click(screen.getByRole("button", { name: /Open case 2/ }));
    await user.type(screen.getByRole("textbox", { name: "Highlight a fragment across the evidence" }), "cyr");
    await user.click(screen.getByRole("button", { name: "Highlight" }));
    expect(container.querySelectorAll("mark")).toHaveLength(4);

    const translationE = screen.getByRole("button", { name: /E.*the slave of the sons/ });
    await user.click(translationE);
    await user.click(screen.getByRole("button", { name: "Assign translation E to phrase 1" }));
    await user.click(translationE);
    await user.click(screen.getByRole("button", { name: "Assign translation E to phrase 2" }));

    expect(screen.getByRole("button", { name: /Phrase 1 is unpaired/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Phrase 2 is paired with translation E/ })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Remove translation E from phrase 2" }));
    expect(screen.getByRole("button", { name: /Phrase 2 is unpaired/ })).toBeTruthy();
  });

  it("checks the three Tenji sections independently", async () => {
    const user = userEvent.setup();
    await renderGame(user);

    await user.click(screen.getByRole("button", { name: /Open case 3/ }));
    expect(screen.getByRole("button", { name: /Check identifications/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Check decoded words/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Check constructed words/ })).toBeTruthy();

    const matches = {
      a: "haiku",
      b: "sake",
      c: "katana",
      d: "kimono",
      e: "koi",
      f: "atari",
    } as const;
    for (const [sequence, word] of Object.entries(matches)) {
      await user.selectOptions(screen.getByRole("combobox", { name: `Match sequence ${sequence}` }), word);
    }
    await user.click(screen.getByRole("button", { name: /Check identifications/ }));

    expect(screen.getByText("Part one complete. All six sequences are identified.")).toBeTruthy();
    expect(screen.queryByText("Part two complete. Both sequences are decoded.")).toBeNull();
    expect(screen.queryByText("Part three complete. Both words use the right dot patterns.")).toBeNull();
    expect(screen.queryByText("The decisive pattern")).toBeNull();
  });

  it("inserts a Greek special character into the active construction input", async () => {
    const user = userEvent.setup();
    await renderGame(user);

    await user.click(screen.getByRole("button", { name: /Open case 2/ }));
    const housesInput = screen.getByRole("textbox", { name: "The houses of the merchants" }) as HTMLInputElement;
    const donkeysInput = screen.getByRole("textbox", { name: "The donkeys of the slave" }) as HTMLInputElement;

    await user.type(donkeysInput, "hoi t");
    await user.click(screen.getByRole("button", { name: "Insert ō" }));

    expect(donkeysInput.value).toBe("hoi tō");
    expect(housesInput.value).toBe("");
  });

  it("offers solve assistance for a field after three failed attempts and all hints", async () => {
    const user = userEvent.setup();
    await renderGame(user);

    await user.click(screen.getByRole("button", { name: /Open case 2/ }));
    const housesInput = screen.getByRole("textbox", { name: "The houses of the merchants" });
    await user.type(housesInput, "wrong answer");

    await user.click(screen.getByRole("button", { name: /Check construction/ }));
    await user.click(screen.getByRole("button", { name: /Check construction/ }));
    expect(screen.queryByRole("button", { name: "Complete this answer for me" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Need a hint?" }));
    for (let hint = 1; hint < 5; hint += 1) {
      await user.click(screen.getByRole("button", { name: "Another hint" }));
    }
    expect(screen.getByText("5 of 5 hints revealed")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Complete this answer for me" })).toBeNull();

    await user.click(screen.getByRole("button", { name: /Check construction/ }));
    const field = housesInput.closest<HTMLElement>(".answer-field");
    if (!field) throw new Error("Expected the construction input to have a field container");
    expect(within(field).getByRole("button", { name: "Complete this answer for me" })).toBeTruthy();
  });

  it("points to the differing word when a construction is one character away", async () => {
    const user = userEvent.setup();
    await renderGame(user);

    await user.click(screen.getByRole("button", { name: /Open case 2/ }));
    const housesInput = screen.getByRole("textbox", { name: "The houses of the merchants" });
    await user.type(housesInput, "hoi tōn emporōn oico");

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await user.click(screen.getByRole("button", { name: /Check construction/ }));
    }

    expect(screen.getByText("You’re one character away. Focus on word 4.")).toBeTruthy();
  });
});
