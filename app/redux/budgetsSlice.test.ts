import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteAllBudgets, deleteBudget } from "./budgetsSlice";

// In-memory stand-in for the Firestore calls used by budget deletion.
const db = vi.hoisted(() => ({
  budgets: {} as Record<
    string,
    { ownerID: string; transactions: number; invitations: number }
  >,
  batches: [] as string[][],
}));

vi.mock("../firebase/config", () => ({ db: {} }));

vi.mock("firebase/firestore", () => {
  const ref = (path: string) => ({ path });

  return {
    collection: (_db: unknown, path: string) => ({ path }),
    where: (field: string, _op: string, value: string) => ({ field, value }),
    query: (
      coll: { path: string },
      filter: { field: string; value: string }
    ) => ({
      ...coll,
      filter,
    }),
    doc: (_db: unknown, coll: string, id: string) => ref(`${coll}/${id}`),
    getDoc: async ({ path }: { path: string }) => {
      const budget = db.budgets[path.split("/")[1]];
      return { exists: () => !!budget, data: () => budget };
    },
    getDocs: async ({
      path,
      filter,
    }: {
      path: string;
      filter?: { field: string; value: string };
    }) => {
      let docs: { id: string; ref: { path: string } }[] = [];

      if (path === "budgets") {
        docs = Object.entries(db.budgets)
          .filter(([, budget]) => budget.ownerID === filter?.value)
          .map(([id]) => ({ id, ref: ref(`budgets/${id}`) }));
      } else if (path === "invitations") {
        const count = db.budgets[filter!.value].invitations;
        docs = Array.from({ length: count }, (_, i) => ({
          id: `inv${i}`,
          ref: ref(`invitations/${filter!.value}-inv${i}`),
        }));
      } else {
        const budgetID = path.split("/")[1];
        docs = Array.from(
          { length: db.budgets[budgetID].transactions },
          (_, i) => ({
            id: `t${i}`,
            ref: ref(`${path}/t${i}`),
          })
        );
      }

      return { docs };
    },
    writeBatch: () => {
      const deleted: string[] = [];
      return {
        delete: ({ path }: { path: string }) => deleted.push(path),
        commit: async () => {
          db.batches.push(deleted);
        },
      };
    },
  };
});

const run = (
  thunk: ReturnType<typeof deleteBudget | typeof deleteAllBudgets>
) => thunk(vi.fn(), () => ({ user: { userID: "owner" } }), undefined);

beforeEach(() => {
  db.budgets = {};
  db.batches = [];
});

describe("deleteBudget", () => {
  it("deletes transactions, invitations and the budget in one batch, budget last", async () => {
    db.budgets.b1 = { ownerID: "owner", transactions: 2, invitations: 1 };

    const result = await run(deleteBudget("b1"));

    expect(result.payload).toEqual({ id: "b1" });
    expect(db.batches).toHaveLength(1);
    expect(db.batches[0]).toEqual([
      "budgets/b1/transactions/t0",
      "budgets/b1/transactions/t1",
      "invitations/b1-inv0",
      "budgets/b1",
    ]);
  });

  it("splits large budgets into batches of 500 and deletes the budget in the last one", async () => {
    db.budgets.big = { ownerID: "owner", transactions: 700, invitations: 0 };

    await run(deleteBudget("big"));

    expect(db.batches.map((batch) => batch.length)).toEqual([500, 201]);
    expect(db.batches[1].at(-1)).toBe("budgets/big");
  });

  it("refuses to delete a budget owned by someone else", async () => {
    db.budgets.b1 = {
      ownerID: "someone-else",
      transactions: 1,
      invitations: 0,
    };

    const result = await run(deleteBudget("b1"));

    expect(result.meta.requestStatus).toBe("rejected");
    expect(db.batches).toEqual([]);
  });
});

describe("deleteAllBudgets", () => {
  it("deletes every owned budget with its related documents", async () => {
    db.budgets = {
      a: { ownerID: "owner", transactions: 1, invitations: 1 },
      b: { ownerID: "owner", transactions: 2, invitations: 0 },
      shared: { ownerID: "someone-else", transactions: 1, invitations: 0 },
    };

    const result = await run(deleteAllBudgets());

    expect(result.payload).toEqual({ deletedBudgetsIDs: ["a", "b"] });
    const deleted = db.batches.flat();
    expect(deleted).toContain("budgets/a");
    expect(deleted).toContain("invitations/a-inv0");
    expect(deleted).toContain("budgets/b/transactions/t1");
    expect(deleted).not.toContain("budgets/shared");
    // Each budget document goes last in its own batch.
    db.batches.forEach((batch) =>
      expect(batch.at(-1)).toMatch(/^budgets\/[^/]+$/)
    );
  });
});
