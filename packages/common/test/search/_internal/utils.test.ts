import { ISearchOptions } from "@esri/arcgis-rest-portal";
import { ISearchResponse } from "../../../src/types";
import { IHubSearchResult, IRelativeDate } from "../../../src/search";
import {
  valueToMatchOptions,
  relativeDateToDateRange,
  getNextFunction,
} from "../../../src/search/_internal/utils";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { mockUserSession } from "../../test-helpers/fake-user-session";

describe("Internal Search Utils:", () => {
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

  describe("get next function:", () => {
    it("change change auth on subsequent calls", async () => {
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
      await chk(mockUserSession);
      const opts2 = fnSpy.calls.mostRecent().args[0];
      expect(opts2.authentication).toEqual(mockUserSession);
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
});
