import JoinedUsers from "./JoinedUsers";
import InvitedUsers from "./InvitedUsers";

export default function ShareBudget() {
  return (
    <div className="flex flex-col items-center w-full mt-10">
      <div>
        <InvitedUsers />
      </div>

      <div className="my-10">
        <JoinedUsers />
      </div>
    </div>
  );
}
