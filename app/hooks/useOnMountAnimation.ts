import { useLayoutEffect } from "react";

const Animate = ({
  elem,
  keyFrames,
  duration,

  onAnimationEnd,
}: {
  elem: HTMLElement;
  keyFrames: Record<string, string | number | undefined>[];
  duration: number;
  onAnimationEnd?: () => void;
}) => {
  if (!elem) return;

  const animation = elem.animate(keyFrames, {
    easing: "ease-in",
    duration,
    fill: "forwards",
  });

  animation.onfinish = () => {
    onAnimationEnd && onAnimationEnd();
  };
};

const useOnMountAnimation = ({
  containerElem,
  animateElemIndex,
  allowOnMountAnimation,
  onOnMountAnimEnd,
}: {
  containerElem: HTMLElement | null;
  animateElemIndex?: number;
  allowOnMountAnimation: boolean;
  onOnMountAnimEnd?: () => void;
}) => {
  useLayoutEffect(() => {
    if (containerElem === null || !allowOnMountAnimation) return;

    const list = containerElem;

    if (list === undefined) return;

    const children: HTMLElement[] = Array.prototype.slice.call(list.children);

    const keyFrames = [
      { opacity: 0, transform: `translateX(-100px)` },
      {
        transform: `translateX(-50px)`,
        offset: 0.3,
      },

      {
        transform: `translateX(0)`,
        opacity: 1,
      },
    ];

    children.forEach((child, index) => {
      if (index === children.length - 1) {
        Animate({
          elem: child,
          keyFrames,
          duration: 300,
          onAnimationEnd: onOnMountAnimEnd ? onOnMountAnimEnd : undefined,
        });
      }
    });
  }, [containerElem, animateElemIndex, onOnMountAnimEnd]); //allowOnMountAnimattion is not added because the onMount animation is supposed to run only once after adding a new row
};

export default useOnMountAnimation;
