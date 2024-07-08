import { useCallback, useLayoutEffect, useState } from "react";
import { usePosition } from "./usePosition";

interface Props {
  onTransitionStart?(e: HTMLElement): void;
  onTransitionEnd?(e: HTMLElement): void;
  readonly animateToElemPos: {
    top: number;
    left: number;
    height: number;
    width: number;
  };
  readonly duration?: number;
  readonly easing?: string;
  readonly allowTransition?: boolean;
  readonly onlyYAxis?: boolean;
}

interface Delta {
  translateX: number;
  translateY: number;
}

export const getDelta = (first: DOMRect, second: DOMRect): Delta => ({
  translateY: first.top + first.height / 2 - (second.top + second.height / 2),
  translateX: first.left + first.width / 2 - (second.left + second.width / 2),
});

export const invertAndPlay = ({
  delta,
  elem,
  easing,
  duration,
  onlyYAxis,
  onTransitionStart,
  onTransitionEnd,
}: {
  delta: Delta;
  elem: HTMLElement;
  easing: string;
  duration: number;
  onlyYAxis: boolean;
  onTransitionStart?: (elem: HTMLElement) => void;
  onTransitionEnd?: (elem: HTMLElement) => void;
}) => {
  const { translateX, translateY } = delta;

  const animation = elem.animate(
    [
      {
        transform: onlyYAxis
          ? ` translateY(${translateY}px) scale(1, 1)`
          : ` translate(${translateX}px, ${translateY}px) scale(1, 1)`,
      },

      {
        transform: `none`,
      },
    ],
    {
      easing,
      duration,
    }
  );

  animation.ready.then(() => {
    onTransitionStart && onTransitionStart(elem);
  });
  animation.onfinish = () => {
    onTransitionEnd && onTransitionEnd(elem);
  };
};
const handleAnimation = (
  firstDim: DOMRect,
  secondDim: DOMRect,
  secondElem: HTMLElement,
  easing: string,
  duration: number,
  onlyYAxis: boolean,
  onTransitionStart?: (elem: HTMLElement) => void,
  onTransitionEnd?: (elem: HTMLElement) => void
) => {
  if (!firstDim) return;

  const delta = getDelta(firstDim as DOMRect, secondDim);

  invertAndPlay({
    delta,
    elem: secondElem,
    easing,
    duration,
    onlyYAxis,
    onTransitionStart,
    onTransitionEnd,
  });
};

const useTransition = ({
  onTransitionStart,
  onTransitionEnd,
  animateToElemPos,
  duration = 300,
  easing = "ease-in",
  onlyYAxis = false,
  allowTransition = true,
}: Props) => {
  const [elemToAnimate, setElemToAnimate] = useState<null | HTMLElement>(null);

  const animateElemCallback = useCallback((node: null | HTMLElement) => {
    if (!node) return;

    setElemToAnimate(node);
  }, []);

  const getElemPosition = usePosition();

  useLayoutEffect(() => {
    const firstDim = animateToElemPos;
    const secondDim = elemToAnimate && getElemPosition(elemToAnimate);

    if (allowTransition && elemToAnimate) {
      handleAnimation(
        firstDim as DOMRect,
        secondDim as DOMRect,
        elemToAnimate,
        easing,
        duration,
        onlyYAxis,
        onTransitionStart,
        onTransitionEnd
      );
    }
  }, [
    animateToElemPos,
    duration,
    easing,
    onTransitionEnd,
    onTransitionStart,
    elemToAnimate,
    allowTransition,
    getElemPosition,
    onlyYAxis,
  ]);

  return animateElemCallback;
};

export default useTransition;
