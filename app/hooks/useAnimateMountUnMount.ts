import { useCallback, useState } from "react";

const Animate = (
  elem: HTMLElement,
  keyFrames: any[],
  duration: number,
  handleUnmountElem?: (elemID: string) => void,
  id?: string
) => {
  if (!elem) return;

  const animation = elem.animate(keyFrames, {
    easing: "ease-in",
    duration,
    fill: "forwards",
  });

  animation.onfinish = () => {
    handleUnmountElem && id && handleUnmountElem(id);
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
      id,
      dataId,
    }: {
      id: string;
      elementsArray: HTMLElement[] | null;
      dataId: string;
      handleUnmountElem: ((id: string) => void) | undefined;
    }) => {
      if (!elementsArray || !handleUnmountElem || !id) return;

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
          Animate(elem, keyFrames, 300, handleUnmountElem, id);
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
