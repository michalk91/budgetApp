import { useRef, useLayoutEffect, useCallback, useState } from "react";
import { getDelta, invertAndPlay } from "./useTransition";
import { usePosition } from "./usePosition";

const useGroupTransition = ({
  elemsArray,
  startAnim,
}: {
  elemsArray?: HTMLElement | null;
  startAnim?: Record<string, any>[];
}) => {
  const initialPositions = useRef<{ [key: string]: DOMRect }>({});
  const disableTransitionRef = useRef(false);

  const [groupTransitionEnd, setGroupTransitionEnd] = useState(false);

  const onGroupTransitionStart = useCallback(() => {
    setGroupTransitionEnd(false);
  }, []);

  const onGroupTransitionEnd = useCallback(() => {
    setGroupTransitionEnd(true);
  }, []);

  const disableTransition = useCallback(() => {
    disableTransitionRef.current = true;
  }, []);

  const enableTransition = useCallback(() => {
    disableTransitionRef.current = false;
  }, []);

  const getElemPosition = usePosition();

  const updateTransitionDimensions = useCallback(() => {
    if (elemsArray === null) return;

    const list = elemsArray;

    if (list === undefined) return;

    const children: HTMLElement[] = Array.prototype.slice.call(list.children);

    for (const child of children) {
      const id = child.dataset.id!;
      const next = getElemPosition(child);
      initialPositions.current[id] = next as DOMRect;
    }
  }, [elemsArray, getElemPosition]);

  useLayoutEffect(() => {
    if (elemsArray === null || disableTransitionRef.current) return;

    const list = elemsArray;

    if (list === undefined) return;

    const children: HTMLElement[] = Array.prototype.slice.call(list.children);

    for (const child of children) {
      const id = child.dataset.id!;
      const next = getElemPosition(child);

      if (id in initialPositions.current) {
        const previous = initialPositions.current[id];

        const delta = getDelta(previous, next as DOMRect);

        delta.translateY !== 0 &&
          invertAndPlay({
            delta,
            elem: child,
            easing: "cubic-bezier(.25,.75,.5,1.25)",
            duration: 700,
            onlyYAxis: true,
            onTransitionStart: onGroupTransitionStart,
            onTransitionEnd: onGroupTransitionEnd,
          });
      }
    }
  }, [
    elemsArray,
    getElemPosition,
    startAnim,
    onGroupTransitionEnd,
    onGroupTransitionStart,
  ]);

  return {
    updateTransitionDimensions,
    disableTransition,
    enableTransition,
    groupTransitionEnd,
  };
};

export default useGroupTransition;
