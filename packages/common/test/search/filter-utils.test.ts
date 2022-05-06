import {
  Filter,
  expandFilter,
  IMatchOptions,
  IDateRange,
  IFilterGroup,
  serializeFilterGroupsForPortal,
} from "../../src";

fdescribe("filter-utils:", () => {
  describe("expandFilters;", () => {
    it("expands group filter", () => {
      const f: Filter<"group"> = {
        filterType: "group",
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
      const chk = expandFilter(f);

      expect((chk.title as IMatchOptions).any).toBeDefined();
      expect(chk.filterType).toBe("group");
      expect((chk.owner as IMatchOptions).any).toEqual(["Dave", "Mike"]);
      expect((chk.owner as IMatchOptions).not).toEqual(["Andrew"]);
      expect(chk.searchUserAccess).toBeTruthy();
      expect(chk.term).toBe("Orange");
      const created = chk.created as IDateRange<number>;
      expect(created.type).toBe("date-range");
      expect(created.to).toBeCloseTo(Date.now(), -4);
    });

    it("expands item filter", () => {
      const f: Filter<"item"> = {
        filterType: "item",
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
        snowcover: {
          any: ["sparse", "medium"],
        },
      };
      const chk = expandFilter(f);

      expect((chk.title as IMatchOptions).any).toBeDefined();
      expect(chk.filterType).toBe("item");
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
      const f: Filter<"user"> = {
        filterType: "user",
        username: "Dave",
        term: "Orange",
        lastlogin: {
          type: "relative-date",
          num: 2,
          unit: "months",
        },
      };
      const chk = expandFilter(f);

      expect((chk.username as IMatchOptions).any).toEqual(["Dave"]);
      expect(chk.filterType).toBe("user");
      expect(chk.term).toBe("Orange");
      const dt = chk.lastlogin as IDateRange<number>;
      expect(dt.type).toBe("date-range");
      expect(dt.to).toBeCloseTo(Date.now(), -4);
    });
  });

  describe("serialize for Portal:", () => {
    it("converts simple group to portal query", () => {
      const f: Filter<"item"> = {
        filterType: "item",
        term: "water",
        type: { any: ["Web Map", "Hub Project"] },
      };

      const group: IFilterGroup<"item"> = {
        operation: "AND",
        filters: [f],
      };

      const chk = serializeFilterGroupsForPortal([group]);

      expect(chk.q).toEqual(
        '(water AND (type:"Web Map" OR type:"Hub Project"))'
      );
    });
  });
});
