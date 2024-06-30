"use client";
import ShowSelectedBudget from "../../components/ShowSelectedBudget";
import Button from "../../components/Button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setSecondElemPos,
  setAllowTransition,
} from "@/app/redux/transitionSlice";
import Link from "next/link";
import { usePosition } from "@/app/hooks/usePosition";

import useTransition from "@/app/hooks/useTransition";
import { useCallback, useEffect, useState } from "react";

export default function SelectedBudget() {
  const dispatch = useAppDispatch();

  const firstElemPos = useAppSelector((state) => state.transition.firstElemPos);

  const [animate, setAnimate] = useState(false);

  const onTransitionStart = useCallback(() => {
    setAnimate(true);
  }, []);

  const onTransitionEnd = useCallback(() => {
    setAnimate(false);
  }, []);

  const animateElemCallback = useTransition({
    animateToElemPos: firstElemPos,
    onlyYAxis: true,
    onTransitionStart,
    onTransitionEnd,
  });

  const getElemPosition = usePosition();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center w-full mt-6 relative max-md:mt-2">
      <div
        ref={animateElemCallback}
        className={`bg-white min-w-full ${
          animate ? "" : "animate-decreaseWidth"
        } relative text-center`}
      >
        <Link href="/">
          <Button
            handleClick={(e) => {
              const position = getElemPosition(e.currentTarget as HTMLElement);

              dispatch(setSecondElemPos(position));
              dispatch(setAllowTransition(true));
            }}
            additionalStyles="bg-red-500 hover:hover:bg-red-700 max-md:!m-2"
          >
            Back to budgets
          </Button>
        </Link>
      </div>
      <ShowSelectedBudget />
    </div>
  );
}
