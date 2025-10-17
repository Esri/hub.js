import { combineQueries } from "../../src/search/combineQueries";
import { IQuery } from "../../src/search/types/IHubCatalog";
import { cloneObject } from "../../src/util";

const harnessQueries: IQuery[] = [
  {
    targetEntity: "item",
    filters: [
      {
        operation: "AND",
        predicates: [
          {
            type: "Hub Site Application",
          },
        ],
      },
    ],
  },
  {
    targetEntity: "item",
    filters: [
      {
        operation: "OR",
        predicates: [
          {
            type: "Hub Page",
          },
        ],
      },
    ],
  },
  {
    targetEntity: "user",
    filters: [
      {
        operation: "OR",
        predicates: [
          {
            name: "Vader",
          },
        ],
      },
    ],
  },
];

describe("combineQueries:", () => {
  it("works with one query", () => {
    const qry = cloneObject(harnessQueries[0]);
    const result = combineQueries([qry]);
    expect(result).toEqual(qry);
  });
  it("works with multiple queries", () => {
    const qrys = [harnessQueries[0], harnessQueries[1]];
    const result = combineQueries(qrys);
    expect(result.targetEntity).toEqual("item");
    expect(result.filters.length).toBe(2);
  });

  it("throws if all targetEntities are not the same", () => {
    const qrys = [harnessQueries[0], harnessQueries[2]];
    try {
      combineQueries(qrys);
    } catch (err) {
      const error = err as { message?: string };
      expect(error.message).toEqual(
        "Cannot combine queries for different entity types"
      );
    }
  });
});
