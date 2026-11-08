import { useCallback, useEffect } from "react";
import useGroupTransition from "./useGroupTransition";

// Resolves to false when removing the element failed and it should be restored.
type HandleUnmountElem = (id: string, secondArg?: any) => Promise<boolean>;

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
  handleUnmountElem: HandleUnmountElem;
  id?: string;
  secondArg: any;
}) => {
  if (!elem) return;

  const animation = elem.animate(keyFrames, {
    easing: "ease-in",
    duration,
    fill: "forwards",
  });

  animation.onfinish = async () => {
    if (!handleUnmountElem || !id) return;

    const removed = await (secondArg
      ? handleUnmountElem(id, secondArg)
      : handleUnmountElem(id));

    if (removed) return;

    // Play the exit animation backwards to bring the element back. Detach the
    // handler first, otherwise finishing the reversed animation deletes again.
    animation.onfinish = null;
    animation.reverse();
  };
};

const useOnUnMountAnimation = ({
  containerElem,
  startGroupAnim,
}: {
  containerElem?: HTMLElement | null;
  startGroupAnim?: Record<string, any>[] | number | string;
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
      handleUnmountElem: HandleUnmountElem | undefined;
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
      enableTransition();
    },
    [enableTransition]
  );

  return {
    startUnMountAnim,
    updateDeleteRowDimensions: updateTransitionDimensions,
  };
};

export default useOnUnMountAnimation;
