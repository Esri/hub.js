import { IGroup, IUser, SearchQueryBuilder } from "@esri/arcgis-rest-portal";
import {
  getUserThumbnailUrl,
  getGroupThumbnailUrl,
  migrateToCollectionKey,
  getResultSiteRelativeLink,
  getGroupPredicate,
  getKilobyteSizeOfQuery,
} from "../../src/search/utils";

import { serializeQueryForPortal } from "../../src/search/serializeQueryForPortal";
import { IRelativeDate } from "../../src/search/types/types";
import { IHubSearchResult } from "../../src/search/types/IHubSearchResult";
import { IHubSite } from "../../src/core/types/IHubSite";
import { IQuery } from "../../src/search/types/IHubCatalog";
import { valueToMatchOptions } from "../../src/search/valueToMatchOptions";
import { relativeDateToDateRange } from "../../src/search/relativeDateToDateRange";

describe("Search Utils:", () => {
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

  describe("group thumbnails:", () => {
    const portal = "https://foo.com/sharing/rest";
    const token = "FAKE_TOKEN";
    it("returns null if no thumbnail present", () => {
      const g = {} as IGroup;
      expect(getGroupThumbnailUrl(portal, g, token)).toBeNull();
    });
    it("constructs url without token for public groups", () => {
      const group = {
        id: "3ef",
        title: "fake group",
        access: "public",
        thumbnail: "photo.jpg",
      } as IGroup;
      expect(getGroupThumbnailUrl(portal, group, token)).toEqual(
        "https://foo.com/sharing/rest/community/groups/3ef/info/photo.jpg"
      );
    });
    it("constructs url with token for non-public groups", () => {
      const group = {
        id: "3ef",
        title: "fake group",
        access: "org",
        thumbnail: "photo.jpg",
      } as IGroup;
      expect(getGroupThumbnailUrl(portal, group, token)).toEqual(
        "https://foo.com/sharing/rest/community/groups/3ef/info/photo.jpg?token=FAKE_TOKEN"
      );
    });
  });

  describe("migrateToCollectionKey", () => {
    it("returns the key as-is if not a legacy search category", () => {
      const key = "dataset";
      const result = migrateToCollectionKey(key);
      expect(result).toBe(key);
    });

    it("returns a converted value if the key is a legacy search category", () => {
      const result = migrateToCollectionKey("App,Map");
      expect(result).toBe("appAndMap");
    });
  });

  describe("getResultSiteRelativeLink", () => {
    it("returns undefined if result.links isn't present", () => {
      const searchResult = {
        id: "9001",
        type: "Feature Service",
      } as IHubSearchResult;
      const result = getResultSiteRelativeLink(
        searchResult,
        null as unknown as IHubSite
      );
      expect(result).toBeUndefined();
    });
    it("returns undefined if result.links.siteRelative isn't present", () => {
      const searchResult = {
        id: "9001",
        type: "Feature Service",
        links: {},
      } as IHubSearchResult;
      const result = getResultSiteRelativeLink(
        searchResult,
        null as unknown as IHubSite
      );
      expect(result).toBeUndefined();
    });
    it("returns an unmodified siteRelative link if result isn't a Hub Page", () => {
      const searchResult = {
        id: "9001",
        type: "Feature Service",
        links: {
          siteRelative: "/foo/9001",
        },
      } as IHubSearchResult;
      const result = getResultSiteRelativeLink(
        searchResult,
        null as unknown as IHubSite
      );
      expect(result).toBe("/foo/9001");
    });
    it("returns a Hub Page result's unmodified siteRelative link if no site is included", () => {
      const searchResult = {
        id: "9001",
        type: "Hub Page",
        links: {
          siteRelative: "/foo/9001",
        },
      } as IHubSearchResult;
      const result = getResultSiteRelativeLink(
        searchResult,
        null as unknown as IHubSite
      );
      expect(result).toBe("/foo/9001");
    });
    it("returns a Hub Page result's unmodified siteRelative link if site has no pages", () => {
      const searchResult = {
        id: "9001",
        type: "Hub Page",
        links: {
          siteRelative: "/foo/9001",
        },
      } as IHubSearchResult;
      const result = getResultSiteRelativeLink(searchResult, {} as IHubSite);
      expect(result).toBe("/foo/9001");
    });
    it("returns a Hub Page result's unmodified siteRelative link if matching page doesn't have a slug", () => {
      const searchResult = {
        id: "9001",
        type: "Hub Page",
        links: {
          siteRelative: "/foo/9001",
        },
      } as IHubSearchResult;
      const site = {
        pages: [{ id: "9001" }],
      } as IHubSite;
      const result = getResultSiteRelativeLink(searchResult, site);
      expect(result).toBe("/foo/9001");
    });
    it("substitutes the id in the siteRelative link for the matching page's slug", () => {
      const searchResult = {
        id: "9001",
        type: "Hub Page",
        links: {
          siteRelative: "/foo/9001",
        },
      } as IHubSearchResult;
      const site = {
        pages: [{ id: "9001", slug: "bar" }],
      } as IHubSite;
      const result = getResultSiteRelativeLink(searchResult, site);
      expect(result).toBe("/foo/bar");
    });
  });

  describe("getGroupPredicate:", () => {
    it("returns undefined if no predicate with group found", () => {
      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                id: "00c",
              },
            ],
          },
        ],
      };
      const chk = getGroupPredicate(qry);
      expect(chk).toBeUndefined();
    });

    it("returns expanded group predicate", () => {
      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                type: "Funnel Cake",
                group: "00c",
              },
            ],
          },
        ],
      };
      const chk = getGroupPredicate(qry);

      expect(chk).toEqual({
        type: {
          any: ["Funnel Cake"],
        },
        group: {
          any: ["00c"],
        },
      });
    });
  });

  describe("getKilobyteSizeOfQuery", () => {
    // These tests create a blob
    it("returns the size of the query in kilobytes", () => {
      const query = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                type: "Web Map",
                typekeywords: { any: ["my|web|map"] },
              },
            ],
          },
        ],
      } as IQuery;
      const stringQuery = serializeQueryForPortal(query).q;
      const size = 0.044921875;
      const chk = getKilobyteSizeOfQuery(stringQuery);
      expect(chk).toEqual(size);
    });

    it("returns 0 if the query is empty", () => {
      const queryString = "";
      const size = 0;
      const chk = getKilobyteSizeOfQuery(queryString);
      expect(chk).toEqual(size);
    });

    it("handles special characters in the query", () => {
      const query = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                type: "Web Map",
                title: "🚀🚀🚀",
              },
            ],
          },
        ],
      } as IQuery;
      const stringQuery = serializeQueryForPortal(query).q;
      const size = 0.0400390625;
      const chk = getKilobyteSizeOfQuery(stringQuery);
      expect(chk).toEqual(size);
    });

    it("handles a SearchQueryBuilder object", () => {
      const query = new SearchQueryBuilder()
        .match("Patrick")
        .in("owner")
        .and()
        .startGroup()
        .match("Web Mapping Application")
        .in("type")
        .or()
        .match("Mobile Application")
        .in("type")
        .or()
        .match("Application")
        .in("type")
        .endGroup();
      const size = 0.0966796875;
      const chk = getKilobyteSizeOfQuery(query);
      expect(chk).toEqual(size);
    });
  });
});
