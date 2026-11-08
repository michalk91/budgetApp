import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ConfirmProvider, useConfirm } from "./ConfirmProvider";

const setup = () => {
  const results: boolean[] = [];

  function Trigger() {
    const confirm = useConfirm();
    return (
      <button
        onClick={async () =>
          results.push(
            await confirm({ title: "Delete it?", confirmLabel: "Yes" })
          )
        }
      >
        open
      </button>
    );
  }

  render(
    <ConfirmProvider>
      <Trigger />
    </ConfirmProvider>
  );

  const open = () => fireEvent.click(screen.getByText("open"));
  const dialog = () => document.querySelector("dialog")!;

  return { results, open, dialog };
};

describe("ConfirmProvider", () => {
  it("resolves true when confirmed", async () => {
    const { results, open, dialog } = setup();

    open();
    expect(dialog().open).toBe(true);
    expect(screen.getByText("Delete it?")).toBeTruthy();

    await act(async () => fireEvent.click(screen.getByText("Yes")));

    expect(results).toEqual([true]);
    expect(dialog().open).toBe(false);
  });

  it("resolves false when cancelled", async () => {
    const { results, open } = setup();

    open();
    await act(async () => fireEvent.click(screen.getByText("Cancel")));

    expect(results).toEqual([false]);
  });

  it("resolves false when closed with Esc or a backdrop click", async () => {
    const { results, open, dialog } = setup();

    open();
    await act(async () => dialog().close()); // what Esc does natively
    open();
    await act(async () => fireEvent.click(dialog()));

    expect(results).toEqual([false, false]);
  });

  it("does not close when clicking inside the dialog content", async () => {
    const { results, open, dialog } = setup();

    open();
    await act(async () => fireEvent.click(screen.getByText("Delete it?")));

    expect(dialog().open).toBe(true);
    expect(results).toEqual([]);
  });
});
