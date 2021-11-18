import {
  expandUserFilter,
  Filter,
  IDateRange,
  mergeUserFilters,
  serializeUserFilterForPortal,
} from "../../src/search";

describe("user-utils:", () => {
  describe("expandUserFilter:", () => {
    it("basic props", () => {
      const f: Filter<"user"> = {
        filterType: "user",
        firstname: "leroy",
        disabled: true,
      };
      const chk = expandUserFilter(f);
      expect(chk.firstname).toEqual({ any: ["leroy"] });
      expect(chk.disabled).toEqual(true);
    });
    it("match props", () => {
      const f: Filter<"user"> = {
        filterType: "user",
        lastname: {
          all: ["Brown", "Smith"],
          any: ["Jones"],
          not: ["Jackson"],
        },
      };
      const chk = expandUserFilter(f);
      expect(chk.lastname).toEqual({
        all: ["Brown", "Smith"],
        any: ["Jones"],
        not: ["Jackson"],
      });
    });
    it("expand dates", () => {
      const f: Filter<"user"> = {
        filterType: "user",
        created: {
          type: "relative-date",
          unit: "days",
          num: 5,
        },
        lastlogin: {
          type: "date-range",
          from: 10,
          to: 100,
        },
      };
      const chk = expandUserFilter(f);
      expect(chk.lastlogin).toEqual({
        type: "date-range",
        from: 10,
        to: 100,
      });
      const c = chk.created as IDateRange<number>;
      expect(c.from).toBeLessThan(c.to);
    });
  });

  describe("serializers:", () => {
    it("creates q", () => {
      const f: Filter<"user"> = {
        filterType: "user",
        term: "Thomas",
        firstname: { any: ["Dave", "Mike"] },
        disabled: true,
        created: {
          type: "date-range",
          from: 10,
          to: 100,
        },
        lastlogin: {
          type: "date-range",
          from: 2,
          to: 8,
        },
      };
      const chk = serializeUserFilterForPortal(f);
      expect(chk.q).toBe(
        `(Thomas) (((firstname:"Dave" OR firstname:"Mike") AND created:[10 TO 100]) AND lastlogin:[2 TO 8])`
      );
    });
    it("allows empty query", () => {
      const f: Filter<"user"> = {
        filterType: "user",
      };
      const chk = serializeUserFilterForPortal(f);
      expect(chk.q).toBe(``);
    });
  });
  describe("mergeUserFilters:", () => {
    it("appends terms", () => {
      const f1: Filter<"user"> = {
        filterType: "user",
        term: "world",
      };
      const f2: Filter<"user"> = {
        filterType: "user",
        term: "Dashboard",
      };
      const chk = mergeUserFilters([f1, f2]);

      expect(chk.filterType).toBe("user");
      expect(chk.term).toEqual("world Dashboard");
    });
    it("simple MatchOption props", () => {
      const f1: Filter<"user"> = {
        filterType: "user",
        term: "world",
      };
      const f2: Filter<"user"> = {
        filterType: "user",
        lastname: "Jones",
      };
      const chk = mergeUserFilters([f1, f2]);

      expect(chk.filterType).toBe("user");
      expect(chk.term).toEqual("world");
      expect(chk.lastname).toEqual({ any: ["Jones"] });
    });

    it("overlapping props", () => {
      const f1: Filter<"user"> = {
        filterType: "user",
        term: "World",
        lastname: ["Smith"],
      };
      const f2: Filter<"user"> = {
        filterType: "user",
        lastname: ["Williams"],
        firstname: "Dave",
      };
      const chk = mergeUserFilters([f1, f2]);

      expect(chk.filterType).toBe("user");
      expect(chk.term).toEqual("World");
      expect(chk.lastname).toEqual({ any: ["Smith", "Williams"] });
      expect(chk.firstname).toEqual({ any: ["Dave"] });
    });

    it("expanding relative dates", () => {
      const f1: Filter<"user"> = {
        filterType: "user",
        created: {
          type: "relative-date",
          num: 10,
          unit: "hours",
        },
      };
      const f2: Filter<"user"> = {
        filterType: "user",
        created: {
          type: "relative-date",
          num: 15,
          unit: "hours",
        },
      };
      const chk = mergeUserFilters([f1, f2]);

      expect(chk.filterType).toBe("user");
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
      const f1: Filter<"user"> = {
        filterType: "user",
        created: {
          type: "date-range",
          from: new Date("2021-05-01").getTime(),
          to: new Date("2021-05-31").getTime(),
        },
      };
      const f2: Filter<"user"> = {
        filterType: "user",
        created: {
          type: "date-range",
          from: new Date("2021-06-01").getTime(),
          to: new Date("2021-06-30").getTime(),
        },
      };
      const chk = mergeUserFilters([f1, f2]);

      expect(chk.filterType).toBe("user");
      const created = chk.created as IDateRange<number>;
      expect(created.from).toBeCloseTo(new Date("2021-05-01").getTime(), 2);
      expect(created.to).toBeCloseTo(new Date("2021-06-30").getTime(), 2);
    });
  });
});
