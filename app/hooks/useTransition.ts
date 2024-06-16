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
}

interface Delta {
  translateX: number;
  translateY: number;
}

const getDelta = (first: DOMRect, second: DOMRect): Delta => ({
  translateY: first.top + first.height / 2 - (second.top + second.height / 2),
  translateX: first.left + first.width / 2 - (second.left + second.width / 2),
});

const invertAndPlay = (
  delta: Delta,
  elem: HTMLElement,
  easing: string,
  duration: number,
  onTransitionStart?: (elem: HTMLElement) => void,
  onTransitionEnd?: (elem: HTMLElement) => void
) => {
  const { translateX, translateY } = delta;

  const animation = elem.animate(
    [
      {
        transform: ` translate(${translateX}px, ${translateY}px) scale(1, 1)`,
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
const openAnimation = (
  firstDim: DOMRect,
  secondDim: DOMRect,
  secondElem: HTMLElement,
  easing: string,
  duration: number,
  onTransitionStart?: (elem: HTMLElement) => void,
  onTransitionEnd?: (elem: HTMLElement) => void
) => {
  if (!firstDim) return;

  const delta = getDelta(firstDim as DOMRect, secondDim);

  if (delta.translateX === 0 && delta.translateY === 0) return;

  invertAndPlay(
    delta,
    secondElem,
    easing,
    duration,
    onTransitionStart,
    onTransitionEnd
  );
};

const useTransition = ({
  onTransitionStart,
  onTransitionEnd,
  animateToElemPos,
  duration = 300,
  easing = "ease-in",
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
      openAnimation(
        firstDim as DOMRect,
        secondDim as DOMRect,
        elemToAnimate,
        easing,
        duration,
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
  ]);

  return animateElemCallback;
};

export default useTransition;
