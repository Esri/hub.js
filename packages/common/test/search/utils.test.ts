import { IUser } from "@esri/arcgis-rest-types";
import { IMatchOptions, IRelativeDate } from "../../src/search";
import {
  expandApis,
  getUserThumbnailUrl,
  mergeMatchOptions,
  relativeDateToDateRange,
  serializeDateRange,
  serializeMatchOptions,
  serializeStringOrArray,
  valueToMatchOptions,
} from "../../src/search/utils";

describe("Search Utils:", () => {
  describe("expandApis", () => {
    it("expands well known apis", () => {
      const chk = expandApis(["arcgis", "hub"]);
      expect(chk.length).toBe(2);
    });

    it("passes through objects", () => {
      const chk = expandApis([
        { url: "https://my.enterprise.com/instance", type: "arcgis" },
      ]);
      expect(chk.length).toBe(1);
      expect(chk[0].type).toBe("arcgis");
    });
  });

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
  describe("expansions:", () => {
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
        const rd: IRelativeDate = {
          type: "relative-date",
          num: 1,
          unit: "hours",
        };
        const chk = relativeDateToDateRange(rd);
        expect(chk.from).toBeLessThan(chk.to);
      });
      it("converts days", () => {
        const rd: IRelativeDate = {
          type: "relative-date",
          num: 1,
          unit: "days",
        };
        const chk = relativeDateToDateRange(rd);
        expect(chk.from).toBeLessThan(chk.to);
      });
      it("converts weeks", () => {
        const rd: IRelativeDate = {
          type: "relative-date",
          num: 1,
          unit: "weeks",
        };
        const chk = relativeDateToDateRange(rd);
        expect(chk.from).toBeLessThan(chk.to);
      });
      it("converts months", () => {
        const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const rd: IRelativeDate = {
          type: "relative-date",
          num: 1,
          unit: "months",
        };
        const chk = relativeDateToDateRange(rd);
        expect(chk.from).toBeLessThan(chk.to);
        const m = new Date(chk.from).getMonth();
        const now = new Date();
        const curMonth = now.getMonth();
        // Account for January/December
        if (curMonth > 0) {
          const prevMonthDays = monthDays[curMonth - 1];
          const curDay = now.getDate();
          if (curDay > prevMonthDays) {
            // see NOTE in relativeDateToDateRange() about why this is
            // should probably also expect that chk.to - prevMonthDays > chk.from
            expect(m).toBe(curMonth);
          } else {
            expect(m).toBeLessThan(curMonth);
          }
        } else {
          expect(m).toBe(11);
        }
      });
      it("converts years", () => {
        const rd: IRelativeDate = {
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
  });
  describe("merging: ", () => {
    it("merge MatchOptions", () => {
      const mo1: IMatchOptions = {
        any: ["red"],
        all: ["cat", "dog"],
        not: ["bmw"],
      };
      const mo2: IMatchOptions = {
        any: ["yellow"],
        all: ["fish", "dog"],
      };

      const chk = mergeMatchOptions(mo1, mo2);

      expect(chk.any).toEqual(["red", "yellow"]);
      expect(chk.all).toEqual(["cat", "dog", "fish"]);
      expect(chk.not).toEqual(["bmw"]);
      expect(chk.exact).not.toBeDefined();
    });
    it("mergeMatchOptsion handles string values", () => {
      const mo1: IMatchOptions = {
        any: ["red"],
        all: ["cat", "dog"],
        not: "bmw",
      };
      const mo2: IMatchOptions = {
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

  describe("user thumbnails:", () => {
    const portal = "https://foo.com/sharing/rest";
    const token = "FAKE_TOKEN";
    it("returns null if no thumbnail present", () => {
      const user = {} as IUser;
      expect(getUserThumbnailUrl(portal, user, token)).toBeNull();
    });
    it("constructs url without token for public users", () => {
      const user = {
        username: "jsmith",
        access: "public",
        thumbnail: "photo.jpg",
      } as IUser;
      expect(getUserThumbnailUrl(portal, user, token)).toEqual(
        "https://foo.com/sharing/rest/community/users/jsmith/info/photo.jpg"
      );
    });
    it("constructs url with token for non-public users", () => {
      const user = {
        username: "jsmith",
        access: "org",
        thumbnail: "photo.jpg",
      } as IUser;
      expect(getUserThumbnailUrl(portal, user, "FAKE_TOKEN")).toEqual(
        "https://foo.com/sharing/rest/community/users/jsmith/info/photo.jpg?token=FAKE_TOKEN"
      );
    });
  });
});
