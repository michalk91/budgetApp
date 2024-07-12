import { useLayoutEffect } from "react";

const Animate = ({
  elem,
  keyFrames,
  duration,
}: {
  elem: HTMLElement;
  keyFrames: Record<string, string | number | undefined>[];
  duration: number;
}) => {
  if (!elem) return;

  elem.animate(keyFrames, {
    easing: "ease-in",
    duration,
    fill: "forwards",
  });
};

const useOnMountAnimation = ({
  containerElem,
  addedElemID,
  pageChanged,

  onOnMountAnimEnd,
}: {
  containerElem: HTMLElement | null;
  addedElemID: string;
  pageChanged?: number;

  onOnMountAnimEnd?: () => void;
}) => {
  useLayoutEffect(() => {
    if (containerElem === null) return;

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

    for (const child of children) {
      const id = child.dataset.id!;

      if (id === addedElemID) {
        Animate({
          elem: child,
          keyFrames,
          duration: 300,
        });
      }
    }
  }, [containerElem, onOnMountAnimEnd, addedElemID, pageChanged]);
};

export default useOnMountAnimation;
