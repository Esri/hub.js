import {
  Filter,
  expandFilter,
  IMatchOptions,
  IDateRange,
  IFilterGroup,
  isEmptyFilter,
  isEmptyFilterGroup,
  IFilter,
  IPredicate,
  expandPredicate,
  IQuery,
  serializeQueryForPortal,
} from "../../src";

describe("ifilter-utils:", () => {
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

  describe("serialize query for Portal:", () => {
    it("converts item filter", () => {
      const p: IPredicate = {
        term: "water",
        modified: {
          type: "date-range",
          from: 1689716790912,
          to: 1652808629198,
        },
        type: { any: ["Web Map", "Hub Project"] },
      };

      const query: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [p],
          },
        ],
      };

      const chk = serializeQueryForPortal(query);

      expect(chk.q).toEqual(
        '(water AND modified:[1689716790912 TO 1652808629198] AND (type:"Web Map" OR type:"Hub Project"))'
      );
    });
    it("blocks props not in portal allow list", () => {
      const p: IPredicate = {
        term: "water",
        color: "yellow", // will not be serialized
        modified: {
          type: "date-range",
          from: 1689716790912,
          to: 1652808629198,
        },
        type: { any: ["Web Map", "Hub Project"] },
      };

      const query: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [p],
          },
        ],
      };

      const chk = serializeQueryForPortal(query);

      expect(chk.q).toEqual(
        '(water AND modified:[1689716790912 TO 1652808629198] AND (type:"Web Map" OR type:"Hub Project"))'
      );
    });
    it("handles complex filter", () => {
      const p: IPredicate = {
        tags: {
          any: ["water", "rivers"],
          all: "production",
          not: ["preview", "deprecated"],
        },
      };

      const query: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [p],
          },
        ],
      };

      const chk = serializeQueryForPortal(query);

      expect(chk.q).toEqual(
        '(tags:"water" OR tags:"rivers") AND tags:"production" AND (-tags:"preview" OR -tags:"deprecated")'
      );
    });
    it("can pass through props", () => {
      const p: IPredicate = {
        searchUserAccess: "member",
      };

      const query: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [p],
          },
        ],
      };

      const chk = serializeQueryForPortal(query);

      expect(chk.searchUserAccess).toEqual("member");
    });
    it("handles multiple filters", () => {
      const query: IQuery = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                term: "austin",
              },
            ],
          },
          {
            operation: "OR",
            predicates: [
              {
                type: "Hub Project",
              },
              {
                type: "Web Map",
              },
              {
                type: "Hub Site Application",
              },
            ],
          },
        ],
      };

      const chk = serializeQueryForPortal(query);

      expect(chk.q).toEqual(
        'austin AND (type:"Hub Project" OR type:"Web Map" OR type:"Hub Site Application")'
      );
    });
    it("handles complex filter without any", () => {
      const p: IPredicate = {
        tags: {
          all: "production",
          not: ["preview", "deprecated"],
        },
      };

      const query: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [p],
          },
        ],
      };

      const chk = serializeQueryForPortal(query);

      expect(chk.q).toEqual(
        'tags:"production" AND (-tags:"preview" OR -tags:"deprecated")'
      );
    });
    it("handles complex filter without any or all", () => {
      const p: IPredicate = {
        tags: {
          not: ["preview", "deprecated"],
        },
      };

      const query: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [p],
          },
        ],
      };

      const chk = serializeQueryForPortal(query);

      expect(chk.q).toEqual('(-tags:"preview" OR -tags:"deprecated")');
    });
    it("handles simple filter ", () => {
      const p: IPredicate = {
        tags: "water",
      };

      const query: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [p],
          },
        ],
      };

      const chk = serializeQueryForPortal(query);

      expect(chk.q).toEqual('tags:"water"');
    });
    it("handles bool filter ", () => {
      const p: IPredicate = {
        isopendata: true,
      };

      const query: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [p],
          },
        ],
      };

      const chk = serializeQueryForPortal(query);

      expect(chk.q).toEqual("isopendata:true");
    });
    it("handles passthrough props ", () => {
      const p: IPredicate = {
        searchUserAccess: "groupMember",
        searchUserName: "dave",
      };

      const query: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [p],
          },
        ],
      };

      const chk = serializeQueryForPortal(query);

      expect(chk.searchUserAccess).toEqual("groupMember");
      expect(chk.searchUserName).toEqual("dave");
    });
  });

  // describe("empty filters:", () => {
  //   it("detects empty filter", () => {
  //     expect(isEmptyFilter({ filterType: "item" })).toBe(true);
  //     expect(isEmptyFilter({ filterType: "item", owner: "dave" })).toBe(false);
  //   });

  //   it("detects empty filtergroup", () => {
  //     expect(
  //       isEmptyFilterGroup({ operation: "OR", filters: [], filterType: "item" })
  //     ).toBe(true);
  //     expect(
  //       isEmptyFilterGroup({
  //         operation: "OR",
  //         filters: [{ filterType: "item" }],
  //         filterType: "item",
  //       })
  //     ).toBe(true);
  //     expect(
  //       isEmptyFilterGroup({
  //         operation: "OR",
  //         filters: [{ filterType: "item", owner: "dave" }],
  //         filterType: "item",
  //       })
  //     ).toBe(false);
  //     expect(
  //       isEmptyFilterGroup({
  //         operation: "OR",
  //         filters: [
  //           { filterType: "item", owner: "dave" },
  //           { filterType: "item" },
  //         ],
  //         filterType: "item",
  //       })
  //     ).toBe(false);
  //   });
  // });
});
