import { Filter, IDateRange, IGroupFilterDefinition } from "../../src";
import {
  expandGroupFilter,
  mergeGroupFilters,
  serializeGroupFilterForPortal,
} from "../../src/search";

describe("group-utils:", () => {
  describe("expandGroupFilter:", () => {
    it("basic props", () => {
      const f: Filter<"group"> = {
        filterType: "group",
        owner: "dbouwman_dc",
        typekeywords: ["one", "two"],
        searchUserAccess: "groupMember",
      };
      const chk = expandGroupFilter(f);
      expect(chk.owner).toEqual({ any: ["dbouwman_dc"] });
      expect(chk.typekeywords).toEqual({ any: ["one", "two"] });
      expect(chk.searchUserAccess).toBeDefined();
    });
    it("match props", () => {
      const f: Filter<"group"> = {
        filterType: "group",
        typekeywords: {
          all: ["one", "two"],
          any: ["red"],
        },
      };
      const chk = expandGroupFilter(f);
      expect(chk.typekeywords).toEqual({ all: ["one", "two"], any: ["red"] });
    });
    it("expand dates", () => {
      const f: Filter<"group"> = {
        filterType: "group",
        created: {
          type: "relative-date",
          unit: "days",
          num: 5,
        },
        modified: {
          type: "date-range",
          from: 10,
          to: 100,
        },
      };
      const chk = expandGroupFilter(f);
      expect(chk.modified).toEqual({
        type: "date-range",
        from: 10,
        to: 100,
      });
      const c = chk.created as IDateRange<number>;
      expect(c.from).toBeLessThan(c.to);
    });
  });
  describe("serializers:", () => {
    describe("serializeGroupFilterForPortal:", () => {
      it("creates q", () => {
        const f: Filter<"group"> = {
          filterType: "group",
          owner: { all: ["dbouwman_dc"] },
          typekeywords: {
            any: ["one", "two"],
          },
          created: {
            type: "date-range",
            from: 10,
            to: 100,
          },
          modified: {
            type: "date-range",
            from: 2,
            to: 8,
          },
        };
        const chk = serializeGroupFilterForPortal(f);
        expect(chk.q).toBe(
          `(((owner:"dbouwman_dc" AND (typekeywords:"one" OR typekeywords:"two")) AND created:[10 TO 100]) AND modified:[2 TO 8])`
        );
      });
      it("creates q", () => {
        const f: Filter<"group"> = {
          filterType: "group",
          typekeywords: {
            any: ["Hub Content Group"],
          },
          searchUserAccess: "groupMember",
        };
        const chk = serializeGroupFilterForPortal(f);
        expect(chk.q).toBe(`typekeywords:"Hub Content Group"`);
        expect(chk.searchUserAccess).toBe("groupMember");
      });
    });
  });

  describe("mergeGroupFilters:", () => {
    it("appends terms", () => {
      const f1: Filter<"group"> = {
        filterType: "group",
        term: "world",
      };
      const f2: Filter<"group"> = {
        filterType: "group",
        term: "Dashboard",
        owner: "dave",
      };
      const chk = mergeGroupFilters([f1, f2]);

      expect(chk.filterType).toBe("group");
      expect(chk.term).toEqual("world Dashboard");
    });
    it("simple MatchOption props", () => {
      const f1: Filter<"group"> = {
        filterType: "group",
        term: "world",
      };
      const f2: Filter<"group"> = {
        filterType: "group",
        title: "Dashboard",
        owner: "dave",
      };
      const chk = mergeGroupFilters([f1, f2]);

      expect(chk.filterType).toBe("group");
      expect(chk.term).toEqual("world");
      expect(chk.title).toEqual({ any: ["Dashboard"] });
      expect(chk.owner).toEqual({ any: ["dave"] });
    });

    it("overlapping props", () => {
      const f1: Filter<"group"> = {
        filterType: "group",
        title: "world",
        tags: ["beer"],
      };
      const f2: Filter<"group"> = {
        filterType: "group",
        tags: ["water"],
        owner: "dave",
      };
      const chk = mergeGroupFilters([f1, f2]);

      expect(chk.filterType).toBe("group");
      expect(chk.title).toEqual({ any: ["world"] });
      expect(chk.owner).toEqual({ any: ["dave"] });
      expect(chk.tags).toEqual({ any: ["beer", "water"] });
    });

    it("expanding relative dates", () => {
      const f1: Filter<"group"> = {
        filterType: "group",
        title: "world",
        created: {
          type: "relative-date",
          num: 10,
          unit: "hours",
        },
      };
      const f2: Filter<"group"> = {
        filterType: "group",
        owner: "dave",
        created: {
          type: "relative-date",
          num: 15,
          unit: "hours",
        },
      };
      const chk = mergeGroupFilters([f1, f2]);

      expect(chk.filterType).toBe("group");
      expect(chk.title).toEqual({ any: ["world"] });
      const created = chk.created as IDateRange<number>;
      const nowStamp = new Date().getTime();
      expect(created.to / 1000).toBeCloseTo(nowStamp / 1000, 1);
      // turn into a decimal so we can use `toBeCloseTo`
      expect(created.from / 1000).toBeCloseTo(
        (nowStamp - 15 * 60 * 60 * 1000) / 1000,
        1
      );
    });

    it("expanding non-overlapping ranges", () => {
      const f1: Filter<"group"> = {
        filterType: "group",
        title: "world",
        created: {
          type: "date-range",
          from: new Date("2021-05-01").getTime(),
          to: new Date("2021-05-31").getTime(),
        },
      };
      const f2: Filter<"group"> = {
        filterType: "group",
        owner: "dave",
        created: {
          type: "date-range",
          from: new Date("2021-06-01").getTime(),
          to: new Date("2021-06-30").getTime(),
        },
      };
      const chk = mergeGroupFilters([f1, f2]);

      expect(chk.filterType).toBe("group");
      expect(chk.title).toEqual({ any: ["world"] });
      const created = chk.created as IDateRange<number>;
      expect(created.from).toBeCloseTo(new Date("2021-05-01").getTime(), 2);
      expect(created.to).toBeCloseTo(new Date("2021-06-30").getTime(), 2);
    });
  });
});
