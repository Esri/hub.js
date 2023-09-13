import { IQuery } from "../../../src";
import { negateGroupPredicates } from "../../../src/search/_internal/negateGroupPredicates";

describe("negateGroupPredicates:", () => {
  it("returns undefined if not passed a query", () => {
    expect(negateGroupPredicates(null as unknown as IQuery)).toBeUndefined();
    expect(
      negateGroupPredicates(undefined as unknown as IQuery)
    ).toBeUndefined();
  });
  it("does nothing if group predicate not present", () => {
    const qry: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              id: "00c",
            },
          ],
        },
      ],
    };
    const chk = negateGroupPredicates(qry);
    expect(chk.filters[0].predicates[0].id).toEqual({ any: ["00c"] });
  });
  it("negates simple group predicate", () => {
    const qry: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              group: "00c",
            },
          ],
        },
      ],
    };
    const chk = negateGroupPredicates(qry);
    expect(chk.filters[0].predicates[0].group).toEqual({
      any: [],
      all: [],
      not: ["00c"],
    });
  });
  it("negates group.any predicate", () => {
    const qry: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              group: { any: ["00c"] },
            },
          ],
        },
      ],
    };
    const chk = negateGroupPredicates(qry);
    expect(chk.filters[0].predicates[0].group).toEqual({
      any: [],
      all: [],
      not: ["00c"],
    });
  });
  it("negates group.all predicate", () => {
    const qry: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              group: { all: ["00c"] },
            },
          ],
        },
      ],
    };
    const chk = negateGroupPredicates(qry);
    expect(chk.filters[0].predicates[0].group).toEqual({
      any: [],
      all: [],
      not: ["00c"],
    });
  });
  it("negates group.all && group.all predicate", () => {
    const qry: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              group: { all: ["00c"], any: ["cc3"] },
            },
          ],
        },
      ],
    };
    const chk = negateGroupPredicates(qry);
    expect(chk.filters[0].predicates[0].group).toEqual({
      any: [],
      all: [],
      not: ["cc3", "00c"],
    });
  });
});
