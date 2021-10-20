import {
  mergeContentFilter,
  mergeMatchOptions,
  DateRange,
  Filter,
  MatchOptions,
} from "../../src/search";

fdescribe("Filters:", () => {
  describe("mergeMatchOptions:", () => {
    it("simple merging arrays", () => {
      const mo1: MatchOptions = {
        any: ["red"],
        all: ["cat", "dog"],
        not: ["bmw"],
      };
      const mo2: MatchOptions = {
        any: ["yellow"],
        all: ["fish", "dog"],
      };

      const chk = mergeMatchOptions(mo1, mo2);

      expect(chk.any).toEqual(["red", "yellow"]);
      expect(chk.all).toEqual(["cat", "dog", "fish"]);
      expect(chk.not).toEqual(["bmw"]);
      expect(chk.exact).not.toBeDefined();
    });
  });

  describe("mergeContentFilters:", () => {
    it("simple MatchOption props", () => {
      const f1: Filter<"content"> = {
        filterType: "content",
        group: "ef0",
      };
      const f2: Filter<"content"> = {
        filterType: "content",
        type: "Dashboard",
        owner: "dave",
      };
      const chk = mergeContentFilter([f1, f2]);

      expect(chk.filterType).toBe("content");
      expect(chk.group).toEqual({ any: ["ef0"] });
      expect(chk.type).toEqual({ any: ["Dashboard"] });
      expect(chk.owner).toEqual({ any: ["dave"] });
    });

    it("overlapping props", () => {
      const f1: Filter<"content"> = {
        filterType: "content",
        group: "ef0",
        tags: ["beer"],
      };
      const f2: Filter<"content"> = {
        filterType: "content",
        type: "Dashboard",
        tags: ["water"],
        owner: "dave",
      };
      const chk = mergeContentFilter([f1, f2]);

      expect(chk.filterType).toBe("content");
      expect(chk.group).toEqual({ any: ["ef0"] });
      expect(chk.type).toEqual({ any: ["Dashboard"] });
      expect(chk.owner).toEqual({ any: ["dave"] });
      expect(chk.tags).toEqual({ any: ["beer", "water"] });
    });

    it("expanding relative dates", () => {
      const f1: Filter<"content"> = {
        filterType: "content",
        group: "ef0",
        created: {
          type: "relative-date",
          num: 10,
          unit: "hours",
        },
      };
      const f2: Filter<"content"> = {
        filterType: "content",
        owner: "dave",
        created: {
          type: "relative-date",
          num: 15,
          unit: "hours",
        },
      };
      const chk = mergeContentFilter([f1, f2]);

      expect(chk.filterType).toBe("content");
      expect(chk.group).toEqual({ any: ["ef0"] });
      const created = chk.created as DateRange<number>;
      const nowStamp = new Date().getTime();
      expect(created.to / 1000).toBeCloseTo(nowStamp / 1000, 1);
      // turn into a decimal so we can use `toBeCloseTo`
      expect(created.from / 1000).toBeCloseTo(
        (nowStamp - 15 * 60 * 60 * 1000) / 1000,
        1
      );
    });

    it("expanding non-overlapping ranges", () => {
      const f1: Filter<"content"> = {
        filterType: "content",
        group: "ef0",
        created: {
          type: "date-range",
          from: new Date("2021-05-01").getTime(),
          to: new Date("2021-05-31").getTime(),
        },
      };
      const f2: Filter<"content"> = {
        filterType: "content",
        owner: "dave",
        created: {
          type: "date-range",
          from: new Date("2021-06-01").getTime(),
          to: new Date("2021-06-30").getTime(),
        },
      };
      const chk = mergeContentFilter([f1, f2]);

      expect(chk.filterType).toBe("content");
      expect(chk.group).toEqual({ any: ["ef0"] });
      const created = chk.created as DateRange<number>;
      expect(created.from).toBeCloseTo(new Date("2021-05-01").getTime(), 2);
      expect(created.to).toBeCloseTo(new Date("2021-06-30").getTime(), 2);
    });

    it("subfilters and expansions", () => {
      const f1: Filter<"content"> = {
        filterType: "content",
        group: "ef0",
        type: "$storymap",
      };
      const f2: Filter<"content"> = {
        filterType: "content",
        owner: "dave",
        subFilters: [
          {
            typekeywords: ["water", "juice", "beer"],
          },
        ],
      };
      const chk = mergeContentFilter([f1, f2]);

      expect(chk.filterType).toBe("content");
      expect(chk.group).toEqual({ any: ["ef0"] });
      expect(chk.owner).toEqual({ any: ["dave"] });
      if (chk.subFilters) {
        expect(chk.subFilters.length).toBe(3);
      }
    });
  });
});
