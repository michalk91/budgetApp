import { useCallback, useEffect } from "react";
import useGroupTransition from "./useGroupTransition";

const Animate = ({
  elem,
  keyFrames,
  duration,
  handleUnmountElem,
  id,
  secondArg,
}: {
  elem: HTMLElement;
  keyFrames: Record<string, string | number | undefined>[];
  duration: number;
  handleUnmountElem: (id: string, secondArg?: any) => void;
  id?: string;
  secondArg: any;
}) => {
  if (!elem) return;

  const animation = elem.animate(keyFrames, {
    easing: "ease-in",
    duration,
    fill: "forwards",
  });

  animation.onfinish = () => {
    if (!handleUnmountElem) return;

    if (id && secondArg) {
      handleUnmountElem(id, secondArg);
    } else if (id) {
      handleUnmountElem(id);
    }
  };
};

const useOnUnMountAnimation = ({
  containerElem,
  startGroupAnim,
}: {
  containerElem?: HTMLElement | null;
  startGroupAnim?: Record<string, any>[] | number;
}) => {
  const {
    updateTransitionDimensions,
    disableTransition,
    enableTransition,
    groupTransitionEnd,
  } = useGroupTransition({
    elemsArray: containerElem,
    startAnim: startGroupAnim ? startGroupAnim : undefined,
    duration: 600,
  });

  useEffect(() => {
    groupTransitionEnd && disableTransition();
  }, [groupTransitionEnd, disableTransition]);

  const startUnMountAnim = useCallback(
    ({
      containerElem,
      handleUnmountElem,
      id,
      secondArg,
      animDir = "fadeInRight",
    }: {
      containerElem: HTMLElement;
      id: string;
      handleUnmountElem: ((id: string, secondArg?: any) => void) | undefined;
      secondArg?: any;
      animDir?: "fadeInRight" | "fadeInLeft";
    }) => {
      if (containerElem === null) return;

      const list = containerElem;

      if (list === undefined) return;

      const children: HTMLElement[] = Array.prototype.slice.call(list.children);

      const keyFramesFadeInRight = [
        {
          transform: `translateX(0)`,
          opacity: 1,
        },

        {
          transform: `translateX(50px)`,
          offset: 0.3,
        },
        { opacity: 0, transform: `translateX(100px)` },
      ];

      const keyFramesFadeInLeft = [
        {
          transform: `translateX(0)`,
          opacity: 1,
        },

        {
          transform: `translateX(-50px)`,
          offset: 0.3,
        },
        { opacity: 0, transform: `translateX(-100px)` },
      ];

      children.forEach((elem) => {
        if (!elem) return;

        const elemID = elem.dataset.id!;

        if (elemID === id) {
          enableTransition();

          if (handleUnmountElem) {
            Animate({
              elem,
              keyFrames:
                animDir === "fadeInRight"
                  ? keyFramesFadeInRight
                  : keyFramesFadeInLeft,
              duration: 300,
              handleUnmountElem,
              id,
              secondArg,
            });
          }
        }
      });
    },
    [enableTransition]
  );

  return {
    startUnMountAnim,
    updateDeleteRowDimensions: updateTransitionDimensions,
  };
};

export default useOnUnMountAnimation;
