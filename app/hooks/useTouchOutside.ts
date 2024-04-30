import { useCallback, useEffect, useState } from "react";

const useTouchOutside = (ref: React.MutableRefObject<HTMLElement>) => {
  const [touchedOutside, setTouchedOutside] = useState(false);

  const detectTouchOutside = useCallback(
    (e: TouchEvent) => {
      if (!ref || !ref.current) return;

      if (!ref.current.contains(e.target as HTMLElement)) {
        setTouchedOutside(true);
      } else setTouchedOutside(false);
    },
    [ref]
  );

  useEffect(() => {
    document.addEventListener("touchstart", detectTouchOutside);

    return () => {
      document.removeEventListener("touchstart", detectTouchOutside);
    };
  }, [detectTouchOutside]);

  return touchedOutside;
};

export default useTouchOutside;
