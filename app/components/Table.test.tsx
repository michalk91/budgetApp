import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Table from "./Table";
import type { TableProps } from "../types";

const renderTable = (props: Partial<TableProps> = {}) => {
  const setSortGlobal = vi.fn();

  render(
    <Table
      title="Budgets"
      headerCells={[
        { name: "amount", sortBy: "budgetValue" },
        { name: "name", sortBy: "budgetName" },
        { name: "action" },
      ]}
      emptyTableCondition={false}
      emptyTableTitle=""
      searchKeywords=""
      notFound={false}
      currentPage={1}
      dataLength={0}
      rowsPerPage={10}
      sortBy="budgetValue"
      sortDirection="ascending"
      setSortGlobal={setSortGlobal}
      {...props}
    >
      {null}
    </Table>
  );

  const header = (name: string) => screen.getByRole("columnheader", { name });

  return { setSortGlobal, header };
};

describe("Table header sorting", () => {
  it("sorts when the column label is clicked, cycling the direction", () => {
    const { setSortGlobal } = renderTable();

    fireEvent.click(screen.getByRole("button", { name: "amount" }));

    expect(setSortGlobal).toHaveBeenCalledWith({
      sortBy: "budgetValue",
      sortDirection: "descending",
    });
  });

  it("makes the whole header cell a button for sortable columns only", () => {
    const { header } = renderTable();

    expect(header("name").querySelector("button")).toBeTruthy();
    expect(header("action").querySelector("button")).toBeNull();
  });

  it("marks the sorted column from props, e.g. after a page reload", () => {
    const { header } = renderTable({
      sortBy: "budgetName",
      sortDirection: "descending",
    });

    expect(header("name").getAttribute("aria-sort")).toBe("descending");
    expect(header("amount").getAttribute("aria-sort")).toBeNull();
  });

  it("marks nothing when sorting is off", () => {
    const { header } = renderTable({ sortDirection: "without" });

    expect(header("amount").getAttribute("aria-sort")).toBeNull();
  });
});
