"use client";
import ShowSelectedBudget from "../../components/ShowSelectedBudget";
import Button from "../../components/Button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setSecondElemPos,
  setAllowTransition,
  resetFirstElemPos,
} from "@/app/redux/transitionSlice";
import Link from "next/link";
import { usePosition } from "@/app/hooks/usePosition";

import useTransition from "@/app/hooks/useTransition";
import { useCallback, useEffect, useState } from "react";

export default function SelectedBudget() {
  const dispatch = useAppDispatch();

  const firstElemPos = useAppSelector((state) => state.transition.firstElemPos);

  // Two phases: first slide the header from the clicked "Show details" button,
  // then shrink it. Without a start position (direct URL, refresh, browser
  // back/forward) only shrink. The position is consumed once on mount.
  const [startPosition] = useState(firstElemPos);
  const hasStartPosition = startPosition.width > 0;
  const [phase, setPhase] = useState<"move" | "shrink">(
    hasStartPosition ? "move" : "shrink"
  );

  const startShrinking = useCallback(() => setPhase("shrink"), []);

  const animateElemCallback = useTransition({
    animateToElemPos: startPosition,
    allowTransition: hasStartPosition,
    onlyYAxis: true,
    onTransitionEnd: startShrinking,
    easing: "cubic-bezier(.25,.75,.5,1.25)",
    duration: 450,
  });

  const getElemPosition = usePosition();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(resetFirstElemPos());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center w-full mt-6 relative max-md:mt-2">
      <div
        ref={animateElemCallback}
        className={`bg-surface min-w-full ${
          phase === "shrink" ? "animate-decreaseWidth" : ""
        } relative text-center`}
      >
        <Link href="/">
          <Button
            handleClick={(e) => {
              const position = getElemPosition(e.currentTarget as HTMLElement);

              dispatch(setSecondElemPos(position));
              dispatch(setAllowTransition(true));
            }}
            additionalStyles="bg-red-500 hover:bg-red-700 max-md:!m-2"
          >
            Back to budgets
          </Button>
        </Link>
      </div>
      <ShowSelectedBudget />
    </div>
  );
}
