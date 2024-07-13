"use client";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { decideInvitation } from "../redux/invitationsSlice";
import useOnUnMountAnimation from "../hooks/useOnUnMountAnimation";
import { useCallback, useRef } from "react";

export default function Notifications() {
  const dispatch = useAppDispatch();

  const invitations = useAppSelector((state) => state.invitations.budgets);

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
      startGroupAnim: invitations,
    }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-stretch mt-14 max-md:mt-1"
    >
      {invitations.length > 0 ? (
        invitations.map((item) => (
          <div
            className="flex flex-wrap justify-between bg-white rounded-lg m-4 shadow-xl w-full p-2"
            key={item.invitationID}
            data-id={item.invitationID}
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
                  updateDeleteRowDimensions();

                  startUnMountAnim({
                    handleUnmountElemWithDecision: handleDecideInvitation,
                    id: item.invitationID,
                    decision: "accept",
                  });
                }}
                className="self-center bg-green-700 hover:bg-green-800 text-white font-bold py-2 my-2 mx-2 px-6 rounded-full max-md:px-6 max-md:py-4"
              >
                Accept
              </button>
              <button
                onClick={() => {
                  updateDeleteRowDimensions();

                  startUnMountAnim({
                    handleUnmountElemWithDecision: handleDecideInvitation,
                    id: item.invitationID,
                    decision: "decline",
                  });
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
