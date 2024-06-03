import Table from "./Table";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { useEffect, useState } from "react";
import { fetchInvitedUsers } from "../redux/invitationsSlice";
import AddNewUser from "./AddNewUser";
import Button from "./Button";
import type { SortState } from "../types";
import {
  deleteInvitation,
  deleteAllInvitations,
} from "../redux/invitationsSlice";
import useSearch from "../hooks/useSearch";

export default function InvitedUsers() {
  const dispatch = useAppDispatch();

  const invitedUsers = useAppSelector(
    (state) => state.invitations.invitedUsers
  );

  const [addNewUser, setAddNewUser] = useState(false);

  const [usersSort, setUsersSort] = useState<SortState>({
    sortBy: "timestamp",
    sortDirection: "ascending",
  });

  const { sortBy, sortDirection } = usersSort;

  useEffect(() => {
    if (sortDirection === "ascending")
      dispatch(fetchInvitedUsers({ sortBy, descending: false }));
    else if (sortDirection === "descending")
      dispatch(fetchInvitedUsers({ sortBy, descending: true }));
  }, [dispatch, sortBy, sortDirection]);

  const findByKeys = ["invitedUserEmail", " invitedUsername"];

  const { handleSearch, filteredArray, searchKeywords, notFound } = useSearch({
    data: invitedUsers,
    keys: findByKeys,
  });

  return (
    <div className="flex flex-col items-center w-full ">
      <Table
        title="Invited users"
        emptyTableTitle="You haven't invited any users yet"
        headerCells={[
          { name: "username", sortBy: "invitedUsername" },
          { name: "email", sortBy: "invitedUserEmail" },
          { name: "manage categories" },
          { name: "manage all transactions" },
          { name: "action" },
        ]}
        emptyTableCondition={invitedUsers?.length === 0 && !addNewUser}
        addNewRow={addNewUser && <AddNewUser setNewUser={setAddNewUser} />}
        setSort={setUsersSort}
        sortDirection={sortDirection}
        sortBy={sortBy}
        handleSearch={handleSearch}
        searchKeywords={searchKeywords}
        notFound={notFound}
      >
        {filteredArray.length > 0 &&
          filteredArray.map((user) => (
            <>
              <tr
                key={user.invitationID}
                className={"hover:bg-gray-100 bg-white border-b  "}
              >
                <td
                  data-cell="username"
                  className="font-bold px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_'] max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0"
                >
                  <p>{user.invitedUsername}</p>
                </td>
                <td
                  data-cell="email"
                  className="font-bold px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_'] max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0"
                >
                  <p>{user.invitedUserEmail}</p>
                </td>
                <td
                  data-cell="status"
                  colSpan={2}
                  className="font-bold px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_'] max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0"
                >
                  <p className="text-blue-600">
                    Waiting for the invitation to be accepted...
                  </p>
                </td>
                <td className="max-lg:block max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-lg:pb-4">
                  <Button
                    handleClick={() => {
                      dispatch(deleteInvitation(user.invitationID));
                    }}
                    additionalStyles={
                      !addNewUser
                        ? "bg-red-500 hover:bg-red-700"
                        : "bg-red-200 hover:cursor-not-allowed"
                    }
                  >
                    Delete invitation
                  </Button>
                </td>
              </tr>
            </>
          ))}
      </Table>
      <div className="text-center mt-6 max-md:-mt-2">
        {!addNewUser && (
          <>
            <Button
              handleClick={() => setAddNewUser(true)}
              additionalStyles="bg-blue-600 hover:bg-blue-900"
            >
              Invite user
            </Button>

            {invitedUsers?.length > 1 && (
              <Button
                handleClick={() => {
                  dispatch(deleteAllInvitations());
                }}
                additionalStyles="bg-red-600 hover:bg-red-800"
              >
                Delete All
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
