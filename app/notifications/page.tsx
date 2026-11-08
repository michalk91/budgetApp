"use client";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { decideInvitation } from "../redux/invitationsSlice";
import useOnUnMountAnimation from "../hooks/useOnUnMountAnimation";
import { useCallback, useEffect, useRef, useState } from "react";
import Warning from "../components/Warning";
import Button from "../components/Button";
import { reportThunkResult } from "../utils/reportThunkResult";

export default function Notifications() {
  const dispatch = useAppDispatch();

  const invitations = useAppSelector((state) => state.invitations.budgets);

  const [elemsCount, setElemsCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDecideInvitation = useCallback(
    async (id: string, decision: "accept" | "decline") => {
      const result = await dispatch(
        decideInvitation({ invitationID: id, decision })
      );

      return reportThunkResult(result, {
        success:
          decision === "accept"
            ? "The budget has been added to your dashboard."
            : "The invitation has been declined.",
        error: "Something went wrong. Please try again.",
      });
    },
    [dispatch]
  );

  const { startUnMountAnim, updateDeleteRowDimensions } = useOnUnMountAnimation(
    {
      containerElem: containerRef.current,
      startGroupAnim: elemsCount,
    }
  );

  useEffect(() => {
    setElemsCount(invitations.length);
  }, [invitations]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-stretch mt-14 max-md:mt-1"
    >
      {invitations.length > 0 ? (
        invitations.map((item) => (
          <div
            key={item.invitationID}
            data-id={item.invitationID}
            className="flex flex-wrap justify-between bg-surface rounded-lg m-4 shadow-xl w-full p-2"
          >
            <div className="p-8 self-center">
              <p>
                {`You are invited to `} <b>{`${item.budgetName}`}</b>
                {` budget by`} <b>{`${item.ownerUsername}`}</b>
                {` (${item.ownerEmail}).`}
              </p>
              <p>
                {`Budget value is `}
                <b>{`${item.budgetValue} ${item.currencyType}.`}</b>
              </p>
            </div>
            <div className="flex flex-wrap justify-center item-center p-8">
              <Button
                handleClick={() => {
                  if (!containerRef.current) return;

                  updateDeleteRowDimensions();

                  startUnMountAnim({
                    containerElem: containerRef.current,
                    handleUnmountElem: handleDecideInvitation,
                    id: item.invitationID,
                    secondArg: "accept",
                  });
                }}
                additionalStyles="self-center max-md:my-2 bg-green-700 hover:bg-green-800"
              >
                Accept
              </Button>
              <Button
                handleClick={() => {
                  if (!containerRef.current) return;

                  updateDeleteRowDimensions();

                  startUnMountAnim({
                    containerElem: containerRef.current,
                    handleUnmountElem: handleDecideInvitation,
                    id: item.invitationID,
                    secondArg: "decline",
                    animDir: "fadeInLeft",
                  });
                }}
                additionalStyles="self-center max-md:my-2 bg-red-700 hover:bg-red-800"
              >
                Decline
              </Button>
            </div>
          </div>
        ))
      ) : (
        <Warning
          text="You don't have any notifications."
          additionalStyles="text-center w-full mt-4"
        />
      )}
    </div>
  );
}
