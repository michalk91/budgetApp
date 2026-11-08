import { describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import { isFulfilledWithPayload, reportThunkResult } from "./reportThunkResult";

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const fulfilled = (payload?: unknown) => ({
  meta: { requestStatus: "fulfilled" as const },
  payload,
});
const rejected = { meta: { requestStatus: "rejected" as const } };

describe("isFulfilledWithPayload", () => {
  it("accepts a fulfilled result with a payload", () => {
    expect(isFulfilledWithPayload(fulfilled({ id: "1" }))).toBe(true);
  });

  it("rejects a fulfilled result without a payload", () => {
    expect(isFulfilledWithPayload(fulfilled(undefined))).toBe(false);
  });

  it("rejects a rejected result", () => {
    expect(isFulfilledWithPayload(rejected)).toBe(false);
  });
});

describe("reportThunkResult", () => {
  const messages = { success: "Deleted", error: "Failed" };

  it("shows the success toast and returns true on success", () => {
    expect(reportThunkResult(fulfilled("id"), messages)).toBe(true);
    expect(toast.success).toHaveBeenCalledWith("Deleted");
  });

  it("shows the error toast and returns false on failure", () => {
    expect(reportThunkResult(rejected, messages)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Failed");
  });
});
