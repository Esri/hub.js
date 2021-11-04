import { Filter, IDateRange, IGroupFilterDefinition } from "../../src";
import {
  expandGroupFilter,
  serializeGroupFilterForPortal,
} from "../../src/search/group-utils";

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
          `((((owner:"dbouwman_dc") AND (typekeywords:"one" OR typekeywords:"two")) AND created:[10 TO 100]) AND modified:[2 TO 8])`
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
        expect(chk.q).toBe(`(typekeywords:"Hub Content Group")`);
        expect(chk.searchUserAccess).toBe("groupMember");
      });
    });
  });
});
