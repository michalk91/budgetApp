import { useCallback, useState } from "react";

const Animate = (
  elem: HTMLElement,
  keyFrames: any[],
  duration: number,
  handleUnmountElem?: (id: string) => void,
  handleUnmountElemWithType?: (id: string, type: "expense" | "income") => void,
  id?: string,
  type?: "expense" | "income"
) => {
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

export const useAnimateMountUnMount = () => {
  const [allowAnimateOnMount, setAllowAnimateOnMount] = useState(false);

  const enableOnMountAnimation = useCallback(() => {
    setAllowAnimateOnMount(true);
  }, []);

  const disableOnMountAnimation = useCallback(() => {
    setAllowAnimateOnMount(false);
  }, []);

  const startMountAnim = useCallback(
    ({ element }: { element: HTMLElement }) => {
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

      allowAnimateOnMount && Animate(element, keyFrames, 300);
    },
    [allowAnimateOnMount]
  );

  const startUnMountAnim = useCallback(
    ({
      elementsArray,
      handleUnmountElem,
      handleUnmountElemWithType,
      id,
      dataId,
      type,
    }: {
      id: string;
      elementsArray: HTMLElement[] | null;
      dataId: string;
      handleUnmountElem?: ((id: string) => void) | undefined;
      handleUnmountElemWithType?: (
        id: string,
        type: "expense" | "income"
      ) => void;
      type?: "expense" | "income";
    }) => {
      if (!elementsArray || !id) return;

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

      elementsArray.forEach((elem) => {
        if (!elem) return;

        const element = elem.closest(dataId) as HTMLElement;
        const elemID = element.dataset.id;

        if (elemID === id) {
          if (handleUnmountElem) {
            Animate(elem, keyFrames, 300, handleUnmountElem, undefined, id);
          } else if (handleUnmountElemWithType && type) {
            Animate(
              elem,
              keyFrames,
              300,
              undefined,
              handleUnmountElemWithType,
              id,
              type
            );
          }
        }
      });
    },
    []
  );

  return {
    startMountAnim,
    startUnMountAnim,
    enableOnMountAnimation,
    disableOnMountAnimation,
  };
};
