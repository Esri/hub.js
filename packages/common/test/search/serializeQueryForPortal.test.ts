import { IPredicate, IQuery } from "../../src";
import { serializeQueryForPortal } from "../../src/search/serializeQueryForPortal";

describe("ifilter-utils:", () => {
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
    it("it drops empty predicates", () => {
      const p: IPredicate = {
        searchUserAccess: "groupMember",
      };
      const p2: IPredicate = {
        owner: "dave",
      };
      const p3: IPredicate = {
        filterType: "foo",
      };

      const query: IQuery = {
        targetEntity: "group",
        filters: [
          {
            operation: "AND",
            predicates: [p, p2, p3],
          },
        ],
      };

      const chk = serializeQueryForPortal(query);

      expect(chk.q).toEqual(`(owner:"dave")`);
      expect(chk.searchUserAccess).toBe("groupMember");
    });
    it("it drops empty predicates: different order", () => {
      const p: IPredicate = {
        searchUserAccess: "groupMember",
      };
      const p2: IPredicate = {
        owner: "dave",
      };
      const p3: IPredicate = {
        filterType: "foo",
      };

      const query: IQuery = {
        targetEntity: "group",
        filters: [
          {
            operation: "AND",
            predicates: [p2, p3, p],
          },
        ],
      };

      const chk = serializeQueryForPortal(query);

      expect(chk.q).toEqual(`(owner:"dave")`);
      expect(chk.searchUserAccess).toBe("groupMember");
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
