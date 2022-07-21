import {
  IDateRange,
  IMatchOptions,
  IPredicate,
} from "../../../src/search/types";
import { expandPredicate } from "../../../src/search/_internal/expandPredicate";

describe("ipredicate-utils", () => {
  describe("expandPredicates;", () => {
    it("expands group predicate", () => {
      const f: IPredicate = {
        term: "Orange",
        title: "Water",
        owner: {
          any: ["Dave", "Mike"],
          not: ["Andrew"],
        },
        created: {
          type: "relative-date",
          num: 2,
          unit: "months",
        },
        searchUserAccess: "groupMember",
      };
      const chk = expandPredicate(f);

      expect((chk.title as IMatchOptions).any).toBeDefined();
      expect((chk.owner as IMatchOptions).any).toEqual(["Dave", "Mike"]);
      expect((chk.owner as IMatchOptions).not).toEqual(["Andrew"]);
      expect(chk.searchUserAccess).toBeTruthy();
      expect(chk.term).toBe("Orange");
      const created = chk.created as IDateRange<number>;
      expect(created.type).toBe("date-range");
      expect(created.to).toBeCloseTo(Date.now(), -4);
    });

    it("expands item predicate", () => {
      const f: IPredicate = {
        term: "Orange",
        title: "Water",
        owner: {
          any: ["Dave", "Mike"],
          not: ["Andrew"],
        },
        type: "Web Map",
        created: {
          type: "relative-date",
          num: 2,
          unit: "months",
        },
        modified: {
          type: "date-range",
          from: 1689716790912,
          to: 1652808629198,
        },
        snowcover: {
          any: ["sparse", "medium"],
        },
      };
      const chk = expandPredicate(f);

      expect((chk.title as IMatchOptions).any).toBeDefined();

      expect((chk.owner as IMatchOptions).any).toEqual(["Dave", "Mike"]);
      expect((chk.owner as IMatchOptions).not).toEqual(["Andrew"]);
      expect(chk.term).toBe("Orange");
      // Pass through random stuff
      expect((chk.snowcover as IMatchOptions).any).toEqual([
        "sparse",
        "medium",
      ]);
      const created = chk.created as IDateRange<number>;
      expect(created.type).toBe("date-range");
      expect(created.to).toBeCloseTo(Date.now(), -4);
    });

    it("expands user filter", () => {
      const f: IPredicate = {
        username: "Dave",
        term: "Orange",
        lastlogin: {
          type: "relative-date",
          num: 2,
          unit: "months",
        },
      };
      const chk = expandPredicate(f);

      expect((chk.username as IMatchOptions).any).toEqual(["Dave"]);

      expect(chk.term).toBe("Orange");
      const dt = chk.lastlogin as IDateRange<number>;
      expect(dt.type).toBe("date-range");
      expect(dt.to).toBeCloseTo(Date.now(), -4);
    });
  });
});
