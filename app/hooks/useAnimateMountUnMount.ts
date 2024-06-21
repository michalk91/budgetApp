import { useCallback } from "react";

const Animate = (
  elem: HTMLElement,
  keyFrames: any[],
  duration: number,
  handleUnmountElem?: (elemID: string) => void,
  id?: string
) => {
  const animation = elem.animate(keyFrames, {
    easing: "ease-in",
    duration,
    fill: "forwards",
  });

  animation.pause();
  elem && animation.play();

  animation.onfinish = () => {
    handleUnmountElem && id && handleUnmountElem(id);
  };
};

export const useAnimateMountUnMount = () => {
  const startMountAnim = useCallback(
    ({ elementsArray }: { elementsArray: HTMLElement[] }) => {
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

      elementsArray.forEach(
        (elem, index) =>
          elementsArray.length - 1 === index && Animate(elem, keyFrames, 400)
      );
    },
    []
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

        elemID === id && Animate(elem, keyFrames, 300, handleUnmountElem, id);
      });
    },
    []
  );

  return { startMountAnim, startUnMountAnim };
};
