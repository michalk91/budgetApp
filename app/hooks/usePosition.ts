import { useCallback } from "react";

export const usePosition = () => {
  const getElemPosition = useCallback((elem: HTMLElement) => {
    const { top, left, width, height } = elem.getBoundingClientRect();

    return { top, left, width, height };
  }, []);

  return getElemPosition;
};
