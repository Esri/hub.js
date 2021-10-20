import {
  ContentFilterDefinition,
  DateRange,
  Filter,
  RelativeDate,
  relativeDateToDateRange,
} from "../../src/search";
import {
  convertDefinitionToFilter,
  expandContentFilter,
  expandTypeField,
  valueToMatchOptions,
} from "../../src/search";

describe("Filter Expansion:", () => {
  describe("matchOptions:", () => {
    it("convert value to MatchOptions", () => {
      const chkString = valueToMatchOptions("yellow");
      expect(chkString.any).toBeDefined();
      if (chkString.any) {
        expect(chkString.any[0]).toBe("yellow");
      }

      const chkArr = valueToMatchOptions(["yellow", "red"]);
      if (chkArr.any) {
        expect(chkArr.any).not.toBe(["yellow", "red"]);
        expect(chkArr.any).toEqual(["yellow", "red"]);
      }

      const passThru = valueToMatchOptions({
        any: ["A", "B"],
        not: ["D", "E"],
      });
      if (passThru.any) {
        expect(passThru.any).toEqual(["A", "B"]);
      }
      if (passThru.not) {
        expect(passThru.not).toEqual(["D", "E"]);
      }
    });
  });

  describe("relativeDateToDateRange:", () => {
    it("converts hours", () => {
      const rd: RelativeDate = {
        type: "relative-date",
        num: 1,
        unit: "hours",
      };
      const chk = relativeDateToDateRange(rd);
      expect(chk.from).toBeLessThan(chk.to);
    });
    it("converts days", () => {
      const rd: RelativeDate = {
        type: "relative-date",
        num: 1,
        unit: "days",
      };
      const chk = relativeDateToDateRange(rd);
      expect(chk.from).toBeLessThan(chk.to);
    });
    it("converts weeks", () => {
      const rd: RelativeDate = {
        type: "relative-date",
        num: 1,
        unit: "weeks",
      };
      const chk = relativeDateToDateRange(rd);
      expect(chk.from).toBeLessThan(chk.to);
    });
    it("converts months", () => {
      const rd: RelativeDate = {
        type: "relative-date",
        num: 1,
        unit: "months",
      };
      const chk = relativeDateToDateRange(rd);
      expect(chk.from).toBeLessThan(chk.to);
      const m = new Date(chk.from).getMonth();
      expect(m).toBeLessThan(new Date().getMonth());
    });
    it("converts years", () => {
      const rd: RelativeDate = {
        type: "relative-date",
        num: 1,
        unit: "years",
      };
      const chk = relativeDateToDateRange(rd);
      expect(chk.from).toBeLessThan(chk.to);
      const yr = new Date(chk.from).getFullYear();
      expect(yr).toBeLessThan(new Date().getFullYear());
    });
  });

  describe("expandTypeField:", () => {
    it("single string", () => {
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
        type: "$storymap",
      };
      const chk = expandTypeField(f);
      expect(chk.subFilters).toBeDefined();
      expect(chk.type).not.toBeDefined();
      if (chk.subFilters) {
        expect(chk.subFilters).toEqual([
          { type: "StoryMap" },
          { type: "Web Mapping Application", typekeywords: ["Story Map"] },
        ]);
      }
    });

    it("unknown type", () => {
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
        type: "StoryMap",
      };
      const chk = expandTypeField(f);
      expect(chk.subFilters).toEqual([]);
      expect(chk.type).toBeDefined();
      expect(chk.type).toBe("StoryMap");
    });

    it("array ", () => {
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
        type: ["$storymap"],
      };
      const chk = expandTypeField(f);
      expect(chk.subFilters).toBeDefined();
      expect(chk.type).toBeDefined();
      expect(chk.type).toEqual([]);
      if (chk.subFilters) {
        expect(chk.subFilters).toEqual([
          { type: "StoryMap" },
          { type: "Web Mapping Application", typekeywords: ["Story Map"] },
        ]);
      }
    });

    it("mixed array ", () => {
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
        type: ["Dashboard", "$storymap"],
      };
      const chk = expandTypeField(f);
      expect(chk.subFilters).toBeDefined();
      expect(chk.type).toBeDefined();
      expect(chk.type).toEqual(["Dashboard"]);
      if (chk.subFilters) {
        expect(chk.subFilters).toEqual([
          { type: "StoryMap" },
          { type: "Web Mapping Application", typekeywords: ["Story Map"] },
        ]);
      }
    });
  });

  describe("definitionToFilter:", () => {
    it("general props", () => {
      const def: ContentFilterDefinition = {
        owner: "dbouwman",
        metadataCountry: "Canada",
        tags: ["Maple Syrup", "Quebecois"],
      };
      const chk = convertDefinitionToFilter(def);
      expect(chk.owner).toBeDefined();
      expect(chk.metadataCountry).toBeDefined();
      expect(chk.tags).toBeDefined();
      expect(chk.owner).toEqual({ any: ["dbouwman"] });
      expect(chk.metadataCountry).toEqual({ any: ["Canada"] });
      expect(chk.tags).toEqual({
        any: ["Maple Syrup", "Quebecois"],
      });
    });

    it("subFilters", () => {
      const def: ContentFilterDefinition = {
        owner: "dbouwman",
        term: "water",
        subFilters: [
          {
            metadataCountry: "Canada",
          },
          {
            tags: ["Maple Syrup", "Quebecois"],
          },
        ],
      };
      const chk = convertDefinitionToFilter(def);
      expect(chk.owner).toBeDefined();
      expect(chk.owner).toEqual({ any: ["dbouwman"] });
      expect(chk.term).toBe("water");

      expect(chk.subFilters).toBeDefined();
      if (chk.subFilters) {
        expect(chk.subFilters[0].metadataCountry).toEqual({
          any: ["Canada"],
        });
        expect(chk.subFilters[1].tags).toEqual({
          any: ["Maple Syrup", "Quebecois"],
        });
      }
    });

    it("relative dates", () => {
      const def: ContentFilterDefinition = {
        created: {
          from: 10,
          to: 11,
        },
        subFilters: [
          {
            modified: {
              type: "relative-date",
              num: 1,
              unit: "hours",
            },
          },
        ],
      };
      const chk = convertDefinitionToFilter(def);
      expect(chk.created).toBeDefined();
      expect(chk.created?.to).toBe(11);
      expect(chk.created?.from).toBe(10);

      expect(chk.subFilters).toBeDefined();
      if (chk.subFilters) {
        expect(chk.subFilters[0].modified).toBeDefined();
        const mod = chk.subFilters[0].modified as DateRange<number>;
        expect(mod.from).toBeLessThan(mod.to);
      }
    });
  });

  describe("expandContentFilter:", () => {
    it("basic props", () => {
      const def: Filter<"content"> = {
        filterType: "content",
        owner: "dbouwman",
        metadataCountry: "Canada",
        tags: ["Maple Syrup", "Quebecois"],
      };
      const chk = expandContentFilter(def);
      expect(chk.owner).toBeDefined();
      expect(chk.metadataCountry).toBeDefined();
      expect(chk.tags).toBeDefined();
      expect(chk.owner).toEqual({ any: ["dbouwman"] });
      expect(chk.metadataCountry).toEqual({ any: ["Canada"] });
      expect(chk.tags).toEqual({
        any: ["Maple Syrup", "Quebecois"],
      });
    });

    it("type expansions", () => {
      const def: Filter<"content"> = {
        filterType: "content",
        owner: "dbouwman",
        metadataCountry: "Canada",
        type: ["Dashboard", "$storymap"],
      };
      const chk = expandContentFilter(def);
      expect(chk.owner).toBeDefined();
      expect(chk.metadataCountry).toBeDefined();
      expect(chk.owner).toEqual({ any: ["dbouwman"] });
      expect(chk.metadataCountry).toEqual({ any: ["Canada"] });
      expect(chk.type).toEqual({
        any: ["Dashboard"],
      });
      expect(chk.subFilters).toBeDefined();
    });

    it("subFilters", () => {
      const def: Filter<"content"> = {
        filterType: "content",
        owner: "dbouwman",
        term: "water",
        subFilters: [
          "$storymap",
          {
            tags: ["Maple Syrup", "Quebecois"],
          },
        ],
      };
      const chk = expandContentFilter(def);
      expect(chk.owner).toBeDefined();
      expect(chk.owner).toEqual({ any: ["dbouwman"] });
      expect(chk.term).toBe("water");

      expect(chk.subFilters).toBeDefined();

      expect(chk.subFilters?.length).toBe(3);
      if (chk.subFilters) {
        expect(chk.subFilters[0].type).toEqual({
          any: ["StoryMap"],
        });
        expect(chk.subFilters[1].type).toEqual({
          any: ["Web Mapping Application"],
        });
        expect(chk.subFilters[1].typekeywords).toEqual({
          any: ["Story Map"],
        });
        expect(chk.subFilters[2].tags).toEqual({
          any: ["Maple Syrup", "Quebecois"],
        });
      }
    });

    it("handles undefined subFilters", () => {
      const def: Filter<"content"> = {
        filterType: "content",
        owner: "dbouwman",
        term: "water",
      };
      const chk = expandContentFilter(def);
      expect(chk.owner).toBeDefined();
      expect(chk.owner).toEqual({ any: ["dbouwman"] });
      expect(chk.term).toBe("water");

      expect(chk.subFilters).toBeDefined();
    });
  });
});
