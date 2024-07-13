"use client";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { decideInvitation } from "../redux/invitationsSlice";
import useOnUnMountAnimation from "../hooks/useOnUnMountAnimation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

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
    () => toast.info("The invitation has been deleted"),
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
            className="flex flex-wrap justify-between bg-white rounded-lg m-4 shadow-xl w-full p-2"
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
              <button
                onClick={() => {
                  if (!containerRef.current) return;

                  updateDeleteRowDimensions();

                  startUnMountAnim({
                    containerElem: containerRef.current,
                    handleUnmountElemWithDecision: handleDecideInvitation,
                    id: item.invitationID,
                    decision: "accept",
                  });
                  notifyJoinedBudget();
                }}
                className="self-center bg-green-700 hover:bg-green-800 text-white font-bold py-2 my-2 mx-2 px-6 rounded-full max-md:px-6 max-md:py-4"
              >
                Accept
              </button>
              <button
                onClick={() => {
                  if (!containerRef.current) return;

                  updateDeleteRowDimensions();

                  startUnMountAnim({
                    containerElem: containerRef.current,
                    handleUnmountElemWithDecision: handleDecideInvitation,
                    id: item.invitationID,
                    decision: "decline",
                  });
                  notifyRejectedInvitation();
                }}
                className="self-center bg-red-700 hover:bg-red-800 text-white font-bold py-2 my-2 mx-2 px-6 rounded-full max-md:px-6 max-md:py-4"
              >
                Decline
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-10 w-full text-center bg-white mt-4 rounded-lg shadow-xl">
          <span className="text-2xl">
            {`You don't have any notifications.`}
          </span>
        </div>
      )}
    </div>
  );
}
