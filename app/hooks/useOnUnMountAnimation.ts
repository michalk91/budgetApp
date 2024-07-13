import { useCallback } from "react";
import useGroupTransition from "./useGroupTransition";

const Animate = ({
  elem,
  keyFrames,
  duration,
  handleUnmountElem,
  handleUnmountElemWithType,
  id,
  type,
}: {
  elem: HTMLElement;
  keyFrames: Record<string, string | number | undefined>[];
  duration: number;
  handleUnmountElem?: (id: string) => void;
  handleUnmountElemWithType?: (id: string, type: "expense" | "income") => void;
  id?: string;
  type?: "expense" | "income";
}) => {
  if (!elem) return;

  const animation = elem.animate(keyFrames, {
    easing: "ease-in",
    duration,
    fill: "forwards",
  });

  animation.onfinish = () => {
    handleUnmountElem && id && handleUnmountElem(id);
    handleUnmountElemWithType &&
      id &&
      type &&
      handleUnmountElemWithType(id, type);
  };
};

const useOnUnMountAnimation = ({
  containerElem,
  startGroupAnim,
}: {
  containerElem: HTMLElement | null;
  startGroupAnim?: Record<string, any>[];
}) => {
  const { updateTransitionDimensions } = useGroupTransition({
    elemsArray: containerElem,
    startAnim: startGroupAnim ? startGroupAnim : undefined,
    duration: 600,
  });

  const startUnMountAnim = useCallback(
    ({
      handleUnmountElem,
      handleUnmountElemWithType,
      id,
      type,
    }: {
      id: string;
      handleUnmountElem?: ((id: string) => void) | undefined;
      handleUnmountElemWithType?: (
        id: string,
        type: "expense" | "income"
      ) => void;
      type?: "expense" | "income";
    }) => {
      if (containerElem === null) return;

      const list = containerElem;

      if (list === undefined) return;

      const children: HTMLElement[] = Array.prototype.slice.call(list.children);

      const keyFrames = [
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

      children.forEach((elem) => {
        if (!elem) return;

        const elemID = elem.dataset.id!;

        if (elemID === id) {
          if (handleUnmountElem) {
            Animate({ elem, keyFrames, duration: 300, handleUnmountElem, id });
          } else if (handleUnmountElemWithType && type) {
            Animate({
              elem,
              keyFrames,
              duration: 300,
              handleUnmountElemWithType,
              id,
              type,
            });
          }
        }
      });
    },
    [containerElem]
  );

  return {
    startUnMountAnim,
    updateDeleteRowDimensions: updateTransitionDimensions,
  };
};

export default useOnUnMountAnimation;
