import { getPredicateValues } from "../../src/search/getPredicateValues";
import { IQuery } from "../../src/search/types/IHubCatalog";

const query: IQuery = {
  targetEntity: "item",
  filters: [
    {
      predicates: [
        {
          group: "group1",
        },
        {
          group: { all: ["group5", "group6"] },
        },
      ],
    },
    {
      predicates: [
        {
          group: {
            any: ["group2", "group3"],
            not: ["group4"],
          },
        },
        {
          type: ["Project", "Site"],
        },
      ],
    },
  ],
};

describe("getPredicateValues:", () => {
  it("defaults to any, all", () => {
    const chk = getPredicateValues("group", query);
    ["group1", "group2", "group3", "group5", "group6"].forEach((group) => {
      expect(chk).toContain(group);
    });
  });
  it("returns nothing if empty array passed", () => {
    const chk = getPredicateValues("group", query, []);
    expect(chk).toEqual([]);
  });
  it("can specify props: any, not", () => {
    const chk = getPredicateValues("group", query, ["any", "not"]);

    ["group1", "group2", "group3", "group4"].forEach((group) => {
      expect(chk).toContain(group);
    });
  });
  it("can specify props: all", () => {
    const chk = getPredicateValues("group", query, ["all"]);
    expect(chk).toEqual(["group5", "group6"]);
  });
});
