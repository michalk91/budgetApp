import { describe, expect, it } from "vitest";
import { validateAmount } from "./validateAmount";

describe("validateAmount", () => {
  it.each(["1", "0.5", "1250.99"])("accepts a positive amount (%s)", (v) => {
    expect(validateAmount(v, "transaction")).toBeNull();
  });

  it.each(["", "   "])("rejects an empty amount (%j)", (v) => {
    expect(validateAmount(v, "budget")).toBe(
      "You need to enter the budget amount."
    );
  });

  it.each(["0", "-5", "abc", "Infinity"])(
    "rejects a non-positive or invalid amount (%s)",
    (v) => {
      expect(validateAmount(v, "transaction")).toBe(
        "The transaction amount must be greater than 0."
      );
    }
  );
});
