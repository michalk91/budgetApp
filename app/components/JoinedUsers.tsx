import Table from "./Table";
import Button from "./Button";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useState, useEffect } from "react";
import type { SortOptions } from "../types";
import {
  fetchJoinedUsers,
  editJoinedUserPermissions,
  deleteUser,
  deleteAllUsers,
} from "../redux/invitationsSlice";
import { ImCross, ImCheckmark } from "react-icons/im";
import useSearch from "../hooks/useSearch";
import usePagination from "../hooks/usePagination";
import { useIDfromPathname } from "../hooks/useIDfromPathname";

export default function JoinedUsers() {
  const dispatch = useAppDispatch();

  const budgetID = useIDfromPathname();

  const usersWithAccess = useAppSelector(
    (state) => state.invitations.usersWithAccess
  );

  const [usersSort, setUsersSort] = useState<SortOptions>({
    sortBy: "timestamp",
    sortDirection: "ascending",
  });

  const { sortBy, sortDirection } = usersSort;

  const [editedUserPermissions, setEditedUserPermissions] = useState({
    id: "",
    allowManageCategories: false,
    allowManageAllTransactions: false,
  });

  useEffect(() => {
    dispatch(
      fetchJoinedUsers({
        budgetID,
        sortOptions: { sortBy, sortDirection },
      })
    );
  }, [dispatch, sortBy, sortDirection, budgetID]);

  const handleStartEdit = (
    id: string,
    allowManageCategories: boolean,
    allowManageAllTransactions: boolean
  ) => {
    setEditedUserPermissions((state) => ({
      ...state,
      id,
      allowManageAllTransactions,
      allowManageCategories,
    }));
  };
  const handleCancelEdit = () => {
    setEditedUserPermissions((state) => ({ ...state, id: "" }));
  };

  const findByKeys = ["userEmail", "username"];

  const { handleSearch, filteredArray, searchKeywords, notFound } = useSearch({
    data: usersWithAccess,
    keys: findByKeys,
  });

  const {
    paginatedData,
    setRowsPerPage,
    currentPage,
    rowsPerPage,
    setCurrentPage,
  } = usePagination(filteredArray);

  return (
    usersWithAccess.length > 0 && (
      <div className="flex flex-col items-center">
        <Table
          title="Users with whom you share a budget"
          headerCells={[
            { name: "username", sortBy: "username" },
            { name: "email", sortBy: "userEmail" },
            { name: "manage categories" },
            { name: "manage all transactions" },
            { name: "action" },
          ]}
          setRowsPerPage={setRowsPerPage}
          dataLength={filteredArray.length}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          emptyTableCondition={usersWithAccess?.length === 0}
          emptyTableTitle="You don't have any budgets yet"
          setSort={setUsersSort}
          sortDirection={sortDirection}
          sortBy={sortBy}
          handleSearch={handleSearch}
          searchKeywords={searchKeywords}
          notFound={notFound}
        >
          {paginatedData?.map((user) => (
            <tr
              key={user.userID}
              className={`hover:bg-gray-100 bg-white border-b `}
            >
              <td
                data-cell="username"
                className="font-bold px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_'] max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0"
              >
                <p> {user.username}</p>
              </td>

              <td
                data-cell="email"
                className="font-bold px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0"
              >
                {user.userEmail}
              </td>

              <td
                data-cell="manage categories"
                className="px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0 max-lg:flex max-lg:flex-col max-lg:items-center"
              >
                {editedUserPermissions.id !== user.userID ? (
                  <>
                    {user.allowManageCategories ? (
                      <ImCheckmark
                        className="max-lg:mt-4"
                        size="1.5rem"
                        color="limegreen"
                      />
                    ) : (
                      <ImCross
                        className="max-lg:mt-4"
                        size="1.3rem"
                        color="red"
                      />
                    )}
                  </>
                ) : (
                  <select
                    onChange={(e) =>
                      setEditedUserPermissions((state) => ({
                        ...state,
                        allowManageCategories:
                          e.target.value === "yes" ? true : false,
                      }))
                    }
                    className="px-2 mt-2 py-1 rounded-full -ml-3 max-w-full max-lg:ml-1 bg-white border-2 "
                    value={
                      editedUserPermissions.allowManageCategories ? "yes" : "no"
                    }
                    name="choice"
                  >
                    <option value="no">no</option>
                    <option value="yes">yes</option>
                  </select>
                )}
              </td>

              <td
                data-cell="manage all transactions"
                className=" px-6 py-6 max-lg:block max-lg:before:content-[attr(data-cell)':_']  max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-md:pb-0 max-lg:flex max-lg:flex-col max-lg:items-center"
              >
                {editedUserPermissions.id !== user.userID ? (
                  <>
                    {user.allowManageAllTransactions ? (
                      <ImCheckmark
                        className="max-lg:mt-4"
                        size="1.5rem"
                        color="limegreen"
                      />
                    ) : (
                      <ImCross
                        className="max-lg:mt-4"
                        size="1.3rem"
                        color="red"
                      />
                    )}
                  </>
                ) : (
                  <select
                    onChange={(e) =>
                      setEditedUserPermissions((state) => ({
                        ...state,
                        allowManageAllTransactions:
                          e.target.value === "yes" ? true : false,
                      }))
                    }
                    className="px-2 py-1 mt-2 rounded-full -ml-3 max-w-full max-lg:ml-1 bg-white border-2 "
                    name="choice"
                    value={
                      editedUserPermissions.allowManageAllTransactions
                        ? "yes"
                        : "no"
                    }
                  >
                    <option value="no">no</option>
                    <option value="yes">yes</option>
                  </select>
                )}
              </td>

              {editedUserPermissions.id !== user.userID ? (
                <td className="max-lg:block max-lg:mt-6 max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-lg:pb-4">
                  <Button
                    handleClick={() => {
                      dispatch(
                        deleteUser({
                          userID: user.userID,
                          budgetID,
                        })
                      );
                    }}
                    additionalStyles={
                      editedUserPermissions.id === ""
                        ? "bg-red-500 hover:bg-red-700"
                        : "bg-red-200 hover:cursor-not-allowed"
                    }
                  >
                    Delete
                  </Button>
                  <Button
                    handleClick={() =>
                      editedUserPermissions.id === "" &&
                      handleStartEdit(
                        user.userID,
                        user.allowManageCategories,
                        user.allowManageAllTransactions
                      )
                    }
                    additionalStyles={
                      editedUserPermissions.id === ""
                        ? "bg-blue-500 hover:bg-blue-700"
                        : "bg-blue-200 hover:cursor-not-allowed"
                    }
                  >
                    Edit
                  </Button>
                </td>
              ) : (
                <td className="max-lg:block max-lg:mt-6 max-lg:before:font-bold max-lg:before:uppercase max-lg:text-center max-lg:pb-4">
                  <Button
                    handleClick={() => {
                      dispatch(
                        editJoinedUserPermissions({
                          budgetID,
                          userID: user.userID,
                          allowManageCategories:
                            editedUserPermissions.allowManageCategories,
                          allowManageAllTransactions:
                            editedUserPermissions.allowManageAllTransactions,
                        })
                      );
                      setEditedUserPermissions((state) => ({
                        ...state,
                        id: "",
                      }));
                    }}
                    additionalStyles="bg-green-700 hover:bg-green-900"
                  >
                    Confirm
                  </Button>
                  <Button
                    handleClick={handleCancelEdit}
                    additionalStyles="bg-red-600 hover:bg-red-800"
                  >
                    Cancel
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </Table>
        {usersWithAccess?.length > 1 && (
          <Button
            handleClick={() => {
              editedUserPermissions.id === "" &&
                dispatch(deleteAllUsers(budgetID));
            }}
            additionalStyles={` mt-8  ${
              editedUserPermissions.id === ""
                ? "bg-red-700 hover:bg-red-700 hover:bg-red-800"
                : "bg-red-200 hover:cursor-not-allowed"
            }`}
          >
            Delete All
          </Button>
        )}
      </div>
    )
  );
}
