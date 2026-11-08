import { describe, expect, it } from "vitest";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import AmountInput from "./AmountInput";

const setup = () => {
  render(<AmountInput aria-label="amount" defaultValue="" />);
  return screen.getByLabelText("amount") as HTMLInputElement;
};

const paste = (input: HTMLInputElement, text: string) => {
  const event = createEvent.paste(input);
  Object.defineProperty(event, "clipboardData", {
    value: { getData: () => text },
  });
  fireEvent(input, event);
  return event.defaultPrevented;
};

describe("AmountInput", () => {
  it("renders a number input that does not go below 0", () => {
    const input = setup();
    expect(input.type).toBe("number");
    expect(input.min).toBe("0");
  });

  it.each(["-", "+", "e", "E"])("blocks typing %s", (key) => {
    // fireEvent returns false when the handler called preventDefault.
    expect(fireEvent.keyDown(setup(), { key })).toBe(false);
  });

  it.each(["5", ".", "Backspace", "ArrowUp"])("allows %s", (key) => {
    expect(fireEvent.keyDown(setup(), { key })).toBe(true);
  });

  it("blocks pasting a negative value", () => {
    expect(paste(setup(), "-10")).toBe(true);
  });

  it("allows pasting a positive value", () => {
    expect(paste(setup(), "10.5")).toBe(false);
  });
});
