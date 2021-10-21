import { IContentFilter, IMatchOptions } from "../../src/search";
import {
  serializeDateRange,
  serializeMatchOptions,
  serializeStringOrArray,
  serializeContentFilterForPortal,
} from "../../src/search/portalSerializers";

describe("Portal Serializers:", () => {
  describe("serializers:", () => {
    it("dateRange to query", () => {
      const chk = serializeDateRange("created", { from: 10, to: 11 });
      expect(chk.q).toBe("created:[10 TO 11]");
    });

    it("field: string", () => {
      const chk = serializeStringOrArray("OR", "owner", "luke");
      expect(chk).toBe(`owner:"luke"`);
    });

    it("field: array of strings", () => {
      const chk = serializeStringOrArray("OR", "owner", ["luke", "yoda"]);
      expect(chk).toBe(`(owner:"luke" OR owner:"yoda")`);
    });
    describe("serializeMatchOptions:", () => {
      it("arrays", () => {
        const mo: IMatchOptions = {
          any: ["buildings", "tents"],
          all: ["red", "blue"],
          not: ["yellow"],
          exact: ["Rubber", "Duck"],
        };
        const chk = serializeMatchOptions("tags", mo);

        expect(chk.q).toBe(
          '(tags:"buildings" OR tags:"tents") AND (tags:"red" AND tags:"blue") AND (-tags:"yellow")'
        );
        expect(chk.filter).toBe(`(tags:"Rubber" AND tags:"Duck")`);
      });
      it("only not", () => {
        const mo: IMatchOptions = {
          not: "buildings",
        };
        const chk = serializeMatchOptions("tags", mo);
        expect(chk.q).toBe('-tags:"buildings"');
      });

      it("all string props", () => {
        const mo: IMatchOptions = {
          any: "buildings",
          all: "red",
          not: "yellow",
          exact: "Rubber",
        };
        const chk = serializeMatchOptions("tags", mo);

        expect(chk.q).toBe(
          'tags:"buildings" AND tags:"red" AND -tags:"yellow"'
        );
        expect(chk.filter).toBe(`tags:"Rubber"`);
      });

      describe("exact on non-filterable fields:", () => {
        it("added to existing .all", () => {
          const mo: IMatchOptions = {
            all: ["water", "river"],
            exact: "buildings",
          };
          const chk = serializeMatchOptions("metaInfo", mo);
          expect(chk.q).toBe(
            '(metaInfo:"water" AND metaInfo:"river" AND metaInfo:"buildings")'
          );
          expect(chk.filter).toEqual("");
        });
        it("added to .all", () => {
          const mo: IMatchOptions = {
            exact: "buildings",
          };
          const chk = serializeMatchOptions("metaInfo", mo);
          expect(chk.q).toBe('(metaInfo:"buildings")');
          expect(chk.filter).toEqual("");
        });
        it("added to .all if both arrays", () => {
          const mo: IMatchOptions = {
            all: ["water", "river"],
            exact: ["buildings"],
          };
          const chk = serializeMatchOptions("metaInfo", mo);
          expect(chk.q).toBe(
            '(metaInfo:"water" AND metaInfo:"river" AND metaInfo:"buildings")'
          );
          expect(chk.filter).toEqual("");
        });
        it("added to .all if both string", () => {
          const mo: IMatchOptions = {
            all: "water",
            exact: "buildings",
          };
          const chk = serializeMatchOptions("metaInfo", mo);
          expect(chk.q).toBe('(metaInfo:"water" AND metaInfo:"buildings")');
          expect(chk.filter).toEqual("");
        });
        it("added to .all is string", () => {
          const mo: IMatchOptions = {
            all: "water",
            exact: ["buildings"],
          };
          const chk = serializeMatchOptions("metaInfo", mo);
          expect(chk.q).toBe('(metaInfo:"water" AND metaInfo:"buildings")');
          expect(chk.filter).toEqual("");
        });
        it("added to .all from array ", () => {
          const mo: IMatchOptions = {
            exact: ["buildings"],
          };
          const chk = serializeMatchOptions("metaInfo", mo);
          expect(chk.q).toBe('(metaInfo:"buildings")');
          expect(chk.filter).toEqual("");
        });
      });
    });
  });

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

// it("live: story maps in group", async () => {
//   const f: ContentFilter = {
//     term: "Example",
//     group: { all: "5c56fb9bf1574b19a90911a2f208d25e" },
//     subFilters: [
//       {
//         type: {
//           all: "StoryMap",
//         },
//       },
//       {
//         type: {
//           all: "Web Mapping Application",
//         },
//         typekeywords: {
//           all: "Story Map",
//         },
//       },
//     ],
//   };
//   const so = serializeForPortal(f);
//   so.portal = "https://qaext.arcgis.com/sharing/rest";
//   const resp = await searchItems(so);
//   listResults(resp);
// });

// it("live: story maps in group", async () => {
//   const fd: Filter<"content"> = {
//     filterType: "content",
//     group: "5c56fb9bf1574b19a90911a2f208d25e",
//     subFilters: ["storymap"],
//   };
//   const f = expandFilter(fd);
//   const so = serializeForPortal(f);
//   so.portal = "https://qaext.arcgis.com/sharing/rest";
//   const resp = await searchItems(so);
//   listResults(resp);
// });

// it("live: story maps in group", async () => {
//   const fd: Filter<"content"> = {
//     filterType: "content",
//     group: "5c56fb9bf1574b19a90911a2f208d25e",
//     type: ["storymap"],
//   };
//   console.log(`Filter: \n ${JSON.stringify(fd, null, 2)}`);
//   const f = expandFilter(fd);
//   const so = serializeForPortal(f);
//   so.portal = "https://qaext.arcgis.com/sharing/rest";
//   const resp = await searchItems(so);
//   listResults(resp);
// });

// function listResults(res: ISearchResult<IItem>): void {
//   const parts = [`query: ${res.query}`, `total: ${res.total}`];
//   res.results.forEach((itm) => {
//     parts.push(`${itm.id} : ${itm.title} : ${itm.type}`);
//   });
//   console.info(parts.join(`\n`));
// }
