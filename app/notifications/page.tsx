"use client";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { decideInvitation } from "../redux/invitationsSlice";
import useOnUnMountAnimation from "../hooks/useOnUnMountAnimation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Warning from "../components/Warning";
import Button from "../components/Button";

export default function Notifications() {
  const dispatch = useAppDispatch();

  const invitations = useAppSelector((state) => state.invitations.budgets);

  const [elemsCount, setElemsCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDecideInvitation = useCallback(
    (id: string, decision: "accept" | "decline") => {
      dispatch(
        decideInvitation({
          invitationID: id,
          decision,
        })
      );
    },
    [dispatch]
  );

  const { startUnMountAnim, updateDeleteRowDimensions } = useOnUnMountAnimation(
    {
      containerElem: containerRef.current,
      startGroupAnim: elemsCount,
    }
  );

  const notifyJoinedBudget = useCallback(
    () => toast.success("The budget has been added to your dashboard"),
    []
  );

  const notifyRejectedInvitation = useCallback(
    () => toast.error("The invitation has been deleted"),
    []
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
                  notifyJoinedBudget();
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
                  notifyRejectedInvitation();
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
