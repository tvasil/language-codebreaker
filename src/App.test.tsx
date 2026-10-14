// @vitest-environment jsdom

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("prototype interactions", () => {
  it("supports marking, pairing, and dot editing with native controls", async () => {
    const user = userEvent.setup();
    render(<App />);

    const matchingU = screen.getAllByRole("button", { name: /უ, character/ });
    expect(matchingU).toHaveLength(4);
    await user.click(matchingU[0]);
    matchingU.forEach((button) => expect(button.getAttribute("aria-pressed")).toBe("true"));

    await user.click(screen.getByRole("button", { name: /Open case 2/ }));
    await user.click(screen.getByRole("button", { name: /ho tōn hyiōn dulos/ }));
    await user.click(screen.getByRole("button", { name: /E.*the slave of the sons/ }));
    expect(screen.getByText(/Paired with E/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /Open case 3/ }));
    const firstSamuraiCell = screen.getByRole("group", { name: "samurai, cell 1" });
    const firstDot = within(firstSamuraiCell).getByRole("button", { name: "Dot 1, empty" });
    await user.click(firstDot);
    expect(within(firstSamuraiCell).getByRole("button", { name: "Dot 1, raised" }).getAttribute("aria-pressed")).toBe("true");
  });
});
