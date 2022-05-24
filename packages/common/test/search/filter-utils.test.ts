import {
  Filter,
  expandFilter,
  IMatchOptions,
  IDateRange,
  IFilterGroup,
  serializeFilterGroupsForPortal,
} from "../../src";

describe("filter-utils:", () => {
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
        modified: {
          type: "date-range",
          from: 1689716790912,
          to: 1652808629198,
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

  fdescribe("serialize for Portal:", () => {
    it("converts item filter", () => {
      const f: Filter<"item"> = {
        filterType: "item",
        term: "water",
        modified: {
          type: "date-range",
          from: 1689716790912,
          to: 1652808629198,
        },
        type: { any: ["Web Map", "Hub Project"] },
      };

      const group: IFilterGroup<"item"> = {
        filterType: "item",
        filters: [f],
      };

      const chk = serializeFilterGroupsForPortal([group]);

      expect(chk.q).toEqual(
        '(water AND modified:[1689716790912 TO 1652808629198] AND (type:"Web Map" OR type:"Hub Project"))'
      );
    });
    it("handles complex filter", () => {
      const f: Filter<"item"> = {
        filterType: "item",
        tags: {
          any: ["water", "rivers"],
          all: "production",
          not: ["preview", "deprecated"],
        },
      };

      const group: IFilterGroup<"item"> = {
        filterType: "item",
        operation: "AND",
        filters: [f],
      };

      const chk = serializeFilterGroupsForPortal([group]);

      expect(chk.q).toEqual(
        '(tags:"water" OR tags:"rivers") AND tags:"production" AND (-tags:"preview" OR -tags:"deprecated")'
      );
    });
    it("handles multiple filters", () => {
      const filters: Array<IFilterGroup<"item">> = [
        {
          operation: "OR",
          filterType: "item",
          filters: [
            {
              filterType: "item",
              term: "austin",
            },
          ],
        },
        {
          operation: "OR",
          filterType: "item",
          filters: [
            {
              filterType: "item",
              type: "Hub Project",
            },
            {
              filterType: "item",
              type: "Web Map",
            },
            {
              filterType: "item",
              type: "Hub Site Application",
            },
          ],
        },
      ];
      const chk = serializeFilterGroupsForPortal(filters);

      expect(chk.q).toEqual(
        'austin AND (type:"Hub Project" OR type:"Web Map" OR type:"Hub Site Application")'
      );
    });
    it("handles complex filter without any", () => {
      const f: Filter<"item"> = {
        filterType: "item",
        tags: {
          all: "production",
          not: ["preview", "deprecated"],
        },
      };

      const group: IFilterGroup<"item"> = {
        filterType: "item",
        operation: "AND",
        filters: [f],
      };

      const chk = serializeFilterGroupsForPortal([group]);

      expect(chk.q).toEqual(
        'tags:"production" AND (-tags:"preview" OR -tags:"deprecated")'
      );
    });
    it("handles complex filter without any or all", () => {
      const f: Filter<"item"> = {
        filterType: "item",
        tags: {
          not: ["preview", "deprecated"],
        },
      };

      const group: IFilterGroup<"item"> = {
        filterType: "item",
        operation: "AND",
        filters: [f],
      };

      const chk = serializeFilterGroupsForPortal([group]);

      expect(chk.q).toEqual('(-tags:"preview" OR -tags:"deprecated")');
    });
    it("handles simple filter ", () => {
      const f: Filter<"item"> = {
        filterType: "item",
        tags: "water",
      };

      const group: IFilterGroup<"item"> = {
        filterType: "item",
        operation: "AND",
        filters: [f],
      };

      const chk = serializeFilterGroupsForPortal([group]);

      expect(chk.q).toEqual('tags:"water"');
    });
  });
});
