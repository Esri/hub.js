import { IGroup, ISearchOptions, IUser } from "@esri/arcgis-rest-portal";
import { ISearchResponse } from "../../src";
import { IHubSearchResult, IRelativeDate } from "../../src/search";
import {
  expandApis,
  getUserThumbnailUrl,
  valueToMatchOptions,
  relativeDateToDateRange,
  getGroupThumbnailUrl,
  getNextFunction,
  migrateToCollectionKey,
} from "../../src/search/utils";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { mockUserSession } from "../test-helpers/fake-user-session";

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

  describe("get next function:", () => {
    it("uses auth on subsequent calls", async () => {
      const request = {
        authentication: MOCK_AUTH,
      } as unknown as ISearchOptions;

      const Module = {
        fn: <T>(r: any) => {
          return Promise.resolve({} as unknown as ISearchResponse<T>);
        },
      };
      const fnSpy = spyOn(Module, "fn").and.callThrough();

      const chk = await getNextFunction<IHubSearchResult>(
        request,
        10,
        20,
        fnSpy
      );
      await chk();
      expect(fnSpy).toHaveBeenCalled();
      // verify it's called with the MOCK_AUTH
      const opts = fnSpy.calls.mostRecent().args[0];
      expect(opts.authentication).toEqual(MOCK_AUTH);
      expect(opts.requestOptions).not.toBeDefined();
    });
    it("updates requestOptions.authentication on subsequent calls", async () => {
      const request = {
        authentication: MOCK_AUTH,
        requestOptions: {},
      } as unknown as ISearchOptions;

      const Module = {
        fn: <T>(r: any) => {
          return Promise.resolve({} as unknown as ISearchResponse<T>);
        },
      };
      const fnSpy = spyOn(Module, "fn").and.callThrough();

      const chk = await getNextFunction<IHubSearchResult>(
        request,
        10,
        20,
        fnSpy
      );
      await chk();
      expect(fnSpy).toHaveBeenCalled();
      // verify it's called with the MOCK_AUTH
      const opts = fnSpy.calls.mostRecent().args[0];
      expect(opts.authentication).toEqual(MOCK_AUTH);
      expect(opts.requestOptions.authentication).toEqual(MOCK_AUTH);
    });
    it("can change auth on subsequent calls", async () => {
      const request = {
        authentication: MOCK_AUTH,
        requestOptions: {},
      } as unknown as ISearchOptions;

      const Module = {
        fn: <T>(r: any) => {
          return Promise.resolve({} as unknown as ISearchResponse<T>);
        },
      };
      const fnSpy = spyOn(Module, "fn").and.callThrough();

      const chk = await getNextFunction<IHubSearchResult>(
        request,
        10,
        20,
        fnSpy
      );
      await chk();
      expect(fnSpy).toHaveBeenCalled();
      // verify it's called with the MOCK_AUTH
      const opts = fnSpy.calls.mostRecent().args[0];
      expect(opts.authentication).toEqual(MOCK_AUTH);
      expect(opts.requestOptions.authentication).toEqual(MOCK_AUTH);
      await chk(mockUserSession);
      const opts2 = fnSpy.calls.mostRecent().args[0];
      expect(opts2.authentication).toEqual(mockUserSession);
      expect(opts.requestOptions.authentication).toEqual(mockUserSession);
    });
    it("can pass auth on subsequent calls", async () => {
      const request = {} as unknown as ISearchOptions;

      const Module = {
        fn: <T>(r: any) => {
          return Promise.resolve({} as unknown as ISearchResponse<T>);
        },
      };
      const fnSpy = spyOn(Module, "fn").and.callThrough();

      const chk = await getNextFunction<IHubSearchResult>(
        request,
        -2, // weird guard in code, not 100% sure what it's for but I don't want to change it
        20,
        fnSpy
      );
      await chk();
      expect(fnSpy).toHaveBeenCalled();
      // verify it's called with the MOCK_AUTH
      const opts = fnSpy.calls.mostRecent().args[0];
      expect(opts.authentication).not.toBeDefined();
      await chk(mockUserSession);
      const opts2 = fnSpy.calls.mostRecent().args[0];
      expect(opts2.authentication).toEqual(mockUserSession);
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
});
