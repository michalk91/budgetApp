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
  handleUnmountElemWithBudgetID,
  budgetID,
  handleUnmountElemWithDecision,
  decision,
}: {
  elem: HTMLElement;
  keyFrames: Record<string, string | number | undefined>[];
  duration: number;
  handleUnmountElem?: (id: string) => void;
  handleUnmountElemWithType?: (id: string, type: "expense" | "income") => void;
  id?: string;
  type?: "expense" | "income";
  handleUnmountElemWithBudgetID?: (id: string, budgetID: string) => void;
  budgetID?: string;
  handleUnmountElemWithDecision?: (
    id: string,
    decision: "accept" | "decline"
  ) => void;
  decision?: "accept" | "decline";
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

    handleUnmountElemWithBudgetID &&
      id &&
      budgetID &&
      handleUnmountElemWithBudgetID(id, budgetID);

    handleUnmountElemWithDecision &&
      id &&
      decision &&
      handleUnmountElemWithDecision(id, decision);
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
      handleUnmountElemWithBudgetID,
      handleUnmountElemWithDecision,
      id,
      type,
      budgetID,
      decision,
    }: {
      id: string;
      handleUnmountElem?: ((id: string) => void) | undefined;
      handleUnmountElemWithType?: (
        id: string,
        type: "expense" | "income"
      ) => void;
      type?: "expense" | "income";
      handleUnmountElemWithBudgetID?: (id: string, budgetID: string) => void;
      budgetID?: string;
      handleUnmountElemWithDecision?: (
        id: string,
        decision: "accept" | "decline"
      ) => void;
      decision?: "accept" | "decline";
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
          } else if (handleUnmountElemWithBudgetID && budgetID) {
            Animate({
              elem,
              keyFrames,
              duration: 300,
              id,
              handleUnmountElemWithBudgetID,
              budgetID,
            });
          } else if (handleUnmountElemWithDecision && decision) {
            Animate({
              elem,
              keyFrames,
              duration: 300,
              id,
              handleUnmountElemWithDecision,
              decision,
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
