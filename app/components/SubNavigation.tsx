import type { SubNavigationProps } from "../types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSelectedOption } from "../redux/budgetsSlice";
import { useEffect, useCallback, useState, useRef } from "react";
import useTransition from "../hooks/useTransition";
import { usePosition } from "../hooks/usePosition";

export default function SubNavigation({ activeOption }: SubNavigationProps) {
  const dispatch = useAppDispatch();

  const budgetOwnerID = useAppSelector((state) => state.budgets.ownerID);
  const userID = useAppSelector((state) => state.user.userID);
  const selectedOption = useAppSelector(
    (state) => state.budgets.selectedOption
  );

  const menuItems = [
    "Expenses",
    "Manage categories",
    "Data visualization",
    "Share budget",
  ];

  const getElemPosition = usePosition();

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    height: 0,
    width: 0,
  });

  const ref = useRef<HTMLElement>();

  const animateElemCallback = useTransition({
    animateToElemPos: position,
  });

  const handleRefs = useCallback(
    (node: null | HTMLElement) => {
      if (!node) return;

      ref.current = node;
      animateElemCallback(node);
    },
    [animateElemCallback]
  );

  useEffect(() => {
    if (selectedOption !== "Share budget") return;

    budgetOwnerID !== userID && dispatch(setSelectedOption("Expenses"));
  }, [budgetOwnerID, dispatch, selectedOption, userID]);

  return (
    <div className="flex justify-center flex-wrap text-xl mt-10">
      {menuItems.map((item) =>
        item !== "Share budget" ? (
          <div className="relative" key={item}>
            <p
              onClick={() => {
                const position = ref.current && getElemPosition(ref.current);
                position && setPosition(position);
                dispatch(setSelectedOption(item));
              }}
              className={`p-4 hover:cursor-pointer hover:text-slate-600`}
            >
              {`${item}`}
            </p>
            {activeOption === item && (
              <div className="absolute z-20 left-1/2 -translate-x-2/4 w-[150px]">
                <span
                  ref={handleRefs}
                  className="block -mt-3 h-[5px] bg-slate-700 rounded-full"
                ></span>
              </div>
            )}
          </div>
        ) : (
          budgetOwnerID === userID && (
            <div className="relative" key={item}>
              <p
                onClick={() => {
                  const position = ref.current && getElemPosition(ref.current);
                  position && setPosition(position);
                  dispatch(setSelectedOption(item));
                }}
                className={`p-4 hover:cursor-pointer hover:text-slate-600`}
              >
                {`${item}`}
              </p>
              {activeOption === item && (
                <div className="absolute z-20 left-1/2 -translate-x-2/4 w-[150px]">
                  <span
                    ref={handleRefs}
                    className="block -mt-3 h-[5px] bg-slate-700 rounded-full"
                  ></span>
                </div>
              )}
            </div>
          )
        )
      )}
    </div>
  );
}
