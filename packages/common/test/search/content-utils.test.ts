import {
  convertContentDefinitionToFilter,
  expandContentFilter,
  expandTypeField,
  mergeContentFilter,
  serializeContentFilterForPortal,
} from "../../src/search/content-utils";
import {
  Filter,
  IContentFilter,
  IContentFilterDefinition,
  IDateRange,
} from "../../src/search/types";

describe("Content:", () => {
  describe("serializers:", () => {
    it("serializeContentFilterForPortal: simple filter", () => {
      const f: IContentFilter = {
        tags: {
          all: ["red", "blue"],
        },
        type: {
          exact: "Web Mapping Application",
        },
      };
      const chk = serializeContentFilterForPortal(f);
      expect(chk.q).toBe('(tags:"red" AND tags:"blue")');
      expect(chk.filter).toBe('type:"Web Mapping Application"');
    });

    it("serializeContentFilterForPortal: multiples", () => {
      const f: IContentFilter = {
        tags: {
          all: ["red", "blue"],
          exact: "orange",
        },
        owner: {
          any: ["Dave", "Andrew"],
        },
        created: {
          from: 10,
          to: 100,
        },
        type: {
          exact: "Web Mapping Application",
        },
      };
      const chk = serializeContentFilterForPortal(f);
      expect(chk.q).toBe(
        '(((tags:"red" AND tags:"blue") AND (owner:"Dave" OR owner:"Andrew")) AND created:[10 TO 100])'
      );
      expect(chk.filter).toBe(
        '(tags:"orange" AND type:"Web Mapping Application")'
      );
    });
    it("serializeForPortal: subfilter", () => {
      const f: IContentFilter = {
        term: "water",
        group: {
          all: "3ef",
        },
        tags: {
          any: ["red", "blue"],
        },
        subFilters: [
          {
            type: {
              all: "StoryMap",
            },
          },
          {
            type: {
              all: "Web Mapping Application",
            },
            typekeywords: {
              all: "Story Map",
            },
          },
        ],
      };
      const chk = serializeContentFilterForPortal(f);
      expect(chk.q).toBe(
        'water ((group:"3ef" AND (tags:"red" OR tags:"blue")) AND (type:"StoryMap" OR (type:"Web Mapping Application" AND typekeywords:"Story Map")))'
      );
      expect(chk.filter).toBe("");
    });
  });
  describe("expansions:", () => {
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
      it("type expansions with object", () => {
        const def: Filter<"content"> = {
          filterType: "content",
          owner: "dbouwman",
          type: { any: "Dashboard" },
        };
        const chk = expandContentFilter(def);
        expect(chk.owner).toBeDefined();
        expect(chk.owner).toEqual({ any: ["dbouwman"] });
        expect(chk.type).toBeDefined();
        expect(chk.subFilters).toBeDefined();
        expect(chk.subFilters?.length).toBe(0);
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

      it("malformed subFilters", () => {
        const def = {
          filterType: "content",
          owner: "dbouwman",
          term: "water",
          subFilters: ["invalid"],
        } as unknown as Filter<"content">;
        const chk = expandContentFilter(def);
        expect(chk.owner).toBeDefined();
        expect(chk.owner).toEqual({ any: ["dbouwman"] });
        expect(chk.term).toBe("water");

        expect(chk.subFilters).toBeDefined();

        expect(chk.subFilters?.length).toBe(0);
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
  describe("definitionToFilter:", () => {
    it("general props", () => {
      const def: IContentFilterDefinition = {
        owner: "dbouwman",
        metadataCountry: "Canada",
        tags: ["Maple Syrup", "Quebecois"],
      };
      const chk = convertContentDefinitionToFilter(def);
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
      const def: IContentFilterDefinition = {
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
      const chk = convertContentDefinitionToFilter(def);
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
      const def: IContentFilterDefinition = {
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
      const chk = convertContentDefinitionToFilter(def);
      expect(chk.created).toBeDefined();
      expect(chk.created?.to).toBe(11);
      expect(chk.created?.from).toBe(10);

      expect(chk.subFilters).toBeDefined();
      if (chk.subFilters) {
        expect(chk.subFilters[0].modified).toBeDefined();
        const mod = chk.subFilters[0].modified as IDateRange<number>;
        expect(mod.from).toBeLessThan(mod.to);
      }
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

    it("merges terms", () => {
      const f1: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const f2: Filter<"content"> = {
        filterType: "content",
        term: "beer",
      };
      const chk = mergeContentFilter([f1, f2]);

      expect(chk.filterType).toBe("content");
      expect(chk.term).toEqual("water beer");
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
      const created = chk.created as IDateRange<number>;
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
