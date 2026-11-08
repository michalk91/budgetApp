import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useOnUnMountAnimation from "./useOnUnMountAnimation";

const setup = () => {
  const container = document.createElement("tbody");
  const row = document.createElement("tr");
  row.dataset.id = "row-1";
  container.appendChild(row);

  // jsdom has no Web Animations API; capture the animation the hook starts.
  const animation = {
    onfinish: null as null | (() => Promise<void>),
    reverse: vi.fn(),
  };
  row.animate = vi.fn(() => animation) as unknown as typeof row.animate;

  const { result } = renderHook(() =>
    useOnUnMountAnimation({ containerElem: container })
  );

  return {
    container,
    animation,
    startUnMountAnim: result.current.startUnMountAnim,
  };
};

describe("useOnUnMountAnimation", () => {
  it("removes the row and keeps it hidden when deletion succeeds", async () => {
    const { container, animation, startUnMountAnim } = setup();
    const handleUnmountElem = vi.fn().mockResolvedValue(true);

    startUnMountAnim({
      containerElem: container,
      id: "row-1",
      handleUnmountElem,
    });
    await animation.onfinish?.();

    expect(handleUnmountElem).toHaveBeenCalledWith("row-1");
    expect(animation.reverse).not.toHaveBeenCalled();
  });

  it("plays the animation back once when deletion fails", async () => {
    const { container, animation, startUnMountAnim } = setup();
    const handleUnmountElem = vi.fn().mockResolvedValue(false);

    startUnMountAnim({
      containerElem: container,
      id: "row-1",
      handleUnmountElem,
    });
    const onfinish = animation.onfinish;
    await onfinish?.();

    expect(animation.reverse).toHaveBeenCalledTimes(1);
    // Finishing the reversed animation must not trigger another deletion.
    expect(animation.onfinish).toBeNull();
  });

  it("passes the second argument to the handler", async () => {
    const { container, animation, startUnMountAnim } = setup();
    const handleUnmountElem = vi.fn().mockResolvedValue(true);

    startUnMountAnim({
      containerElem: container,
      id: "row-1",
      secondArg: "expense",
      handleUnmountElem,
    });
    await animation.onfinish?.();

    expect(handleUnmountElem).toHaveBeenCalledWith("row-1", "expense");
  });
});
