"use client";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { decideInvitation } from "../redux/invitationsSlice";

export default function Notifications() {
  const dispatch = useAppDispatch();

  const invitations = useAppSelector((state) => state.invitations.budgets);

  return (
    <div className="flex flex-col items-center justify-stretch mt-14">
      {invitations.length > 0 ? (
        invitations.map((item) => (
          <div
            className="flex flex-wrap justify-between bg-white rounded-lg m-4 shadow-xl w-full p-2"
            key={item.budgetID}
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
                onClick={() =>
                  dispatch(
                    decideInvitation({
                      invitationID: item.invitationID,
                      decision: "accept",
                    })
                  )
                }
                className="self-center bg-green-700 hover:bg-green-800 text-white font-bold py-2 my-2 mx-2 px-6 rounded-full max-md:px-6 max-md:py-4"
              >
                Accept
              </button>
              <button
                onClick={() =>
                  dispatch(
                    decideInvitation({
                      invitationID: item.invitationID,
                      decision: "decline",
                    })
                  )
                }
                className="self-center bg-red-700 hover:bg-red-800 text-white font-bold py-2 my-2 mx-2 px-6 rounded-full max-md:px-6 max-md:py-4"
              >
                Decline
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-10 w-full text-center bg-white mt-10 rounded-lg shadow-xl">
          <span className="text-2xl">
            {`You don't have any notifications.`}
          </span>
        </div>
      )}
    </div>
  );
}
