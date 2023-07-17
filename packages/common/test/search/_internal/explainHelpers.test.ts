import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IPredicate } from "../../../src";

import { GenericResult } from "../../../src/search/explainResult";
import {
  checkAll,
  checkAny,
  checkNot,
  explainMatchOptionPredicate,
} from "../../../src/search/_internal/explainHelpers";

describe("explainQuery helpers:", () => {
  describe("explainMatchOptionPredicate:", () => {
    it("simple any", async () => {
      const predicate: IPredicate = {
        tags: {
          any: ["a", "b"],
        },
      };
      const result: GenericResult = {
        tags: ["b", "c", "d"],
      };

      const chk = await explainMatchOptionPredicate(
        predicate,
        result,
        {} as IRequestOptions
      );

      expect(chk.matched).toBeTruthy();
    });

    it("simple all", async () => {
      const predicate: IPredicate = {
        tags: {
          all: ["c", "d"],
        },
      };
      const result: GenericResult = {
        tags: ["b", "c", "d"],
      };

      const chk = await explainMatchOptionPredicate(
        predicate,
        result,
        {} as IRequestOptions
      );

      expect(chk.matched).toBeTruthy();
    });

    it("simple not", async () => {
      const predicate: IPredicate = {
        tags: {
          not: ["e", "f"],
        },
      };
      const result: GenericResult = {
        tags: ["b", "c", "d"],
      };

      const chk = await explainMatchOptionPredicate(
        predicate,
        result,
        {} as IRequestOptions
      );

      expect(chk.matched).toBeTruthy();
    });

    it("complex any, all, not", async () => {
      const predicate: IPredicate = {
        tags: {
          any: ["a", "b"],
          all: ["c", "d"],
          not: ["e", "f"],
        },
      };
      const result: GenericResult = {
        tags: ["b", "c", "d"],
      };

      const chk = await explainMatchOptionPredicate(
        predicate,
        result,
        {} as IRequestOptions
      );

      expect(chk.matched).toBeTruthy();
    });
  });

  describe("low-level checks:", () => {
    describe("checkAny:", () => {
      it("string value match", () => {
        const chk = checkAny("owner", "jsmith", "jsmith");
        expect(chk).toEqual({
          attribute: "owner",
          values: "jsmith",
          condition: "IN",
          requirement: "jsmith",
          matched: true,
          message:
            "Value(s) jsmith contained at least one of value from [jsmith]",
        });
      });
      it("string value in array", () => {
        const chk = checkAny("group", ["3ef", "4ef"], "3ef");
        expect(chk).toEqual({
          attribute: "group",
          values: "3ef",
          condition: "IN",
          requirement: "3ef,4ef",
          matched: true,
          message:
            "Value(s) 3ef contained at least one of value from [3ef,4ef]",
        });
      });
      it("array value in array", () => {
        const chk = checkAny("group", ["3ef", "4ef"], ["3ef", "00c", "4ef"]);
        expect(chk).toEqual({
          attribute: "group",
          values: "3ef,00c,4ef",
          condition: "IN",
          requirement: "3ef,4ef",
          matched: true,
          message:
            "Value(s) 3ef,4ef contained at least one of value from [3ef,4ef]",
        });
        const chk2 = checkAny("group", ["3ef", "4ef"], ["00c", "4ef"]);
        expect(chk2).toEqual({
          attribute: "group",
          values: "00c,4ef",
          condition: "IN",
          requirement: "3ef,4ef",
          matched: true,
          message:
            "Value(s) 4ef contained at least one of value from [3ef,4ef]",
        });
      });
      it("no match: string in string", () => {
        const chk = checkAny("owner", "jsmith", "vader");
        expect(chk).toEqual({
          attribute: "owner",
          values: "vader",
          condition: "IN",
          matched: false,
          requirement: "jsmith",
          message: "No match",
        });
      });
      it("no match: string in array", () => {
        const chk = checkAny("owner", ["jsmith"], "vader");
        expect(chk).toEqual({
          attribute: "owner",
          values: "vader",
          condition: "IN",
          matched: false,
          requirement: "jsmith",
          message: "No match",
        });
      });
    });
    describe("checkAll:", () => {
      it("string value match", () => {
        const chk = checkAll("owner", "jsmith", "jsmith");
        expect(chk).toEqual({
          attribute: "owner",
          values: "jsmith",
          condition: "ALL",
          requirement: "jsmith",
          matched: true,
          message: "Value(s) jsmith contained all values from [jsmith]",
        });
      });
      it("array value in array", () => {
        const chk = checkAll("group", ["3ef", "4ef"], ["4ef", "3ef", "00c"]);
        expect(chk).toEqual({
          attribute: "group",
          values: "4ef,3ef,00c",
          condition: "ALL",
          requirement: "3ef,4ef",
          matched: true,
          message: "Value(s) 3ef,4ef contained all values from [3ef,4ef]",
        });
      });
      it("string value in array", () => {
        const chk = checkAll("group", ["3ef"], "3ef");
        expect(chk).toEqual({
          attribute: "group",
          values: "3ef",
          condition: "ALL",
          requirement: "3ef",
          matched: true,
          message: "Value(s) 3ef contained all values from [3ef]",
        });
      });
      it("no match: string in string", () => {
        const chk = checkAll("owner", "jsmith", "vader");
        expect(chk).toEqual({
          attribute: "owner",
          values: "vader",
          condition: "ALL",
          requirement: "jsmith",
          matched: true,
          message: "No match",
        });
      });
      it("no match: string in array", () => {
        const chk = checkAll("owner", ["jsmith"], "vader");
        expect(chk).toEqual({
          attribute: "owner",
          values: "vader",
          condition: "ALL",
          requirement: "jsmith",
          matched: true,
          message: "No match",
        });
      });
      it("no match: array in array", () => {
        const chk = checkAll("group", ["3ef", "cc0"], ["3ef", "4ef"]);
        expect(chk).toEqual({
          attribute: "group",
          values: "3ef,4ef",
          condition: "ALL",
          requirement: "3ef,cc0",
          matched: true,
          message: "No match",
        });
      });
    });
    describe("checkNot:", () => {
      it("string value match", () => {
        const chk = checkNot("owner", "jsmith", "mike");
        expect(chk).toEqual({
          attribute: "owner",
          values: "mike",
          condition: "NOT_IN",
          requirement: "jsmith",
          matched: true,
          message: "Value(s) mike is not contained in [jsmith]",
        });
      });
      it("array value in array", () => {
        const chk = checkNot("group", ["3ef", "4ef"], ["00c"]);
        expect(chk).toEqual({
          attribute: "group",
          values: "00c",
          condition: "NOT_IN",
          requirement: "3ef,4ef",
          matched: true,
          message: "Value(s) 00c is not contained in [3ef,4ef]",
        });
      });
      it("string value in array", () => {
        const chk = checkNot("group", ["3ef"], "00c");
        expect(chk).toEqual({
          attribute: "group",
          values: "00c",
          condition: "NOT_IN",
          requirement: "3ef",
          matched: true,
          message: "Value(s) 00c is not contained in [3ef]",
        });
      });
      it("no match: string in string", () => {
        const chk = checkNot("owner", "jsmith", "jsmith");
        expect(chk).toEqual({
          attribute: "owner",
          values: "jsmith",
          condition: "NOT_IN",
          requirement: "jsmith",
          matched: true,
          message: "No match",
        });
      });
      it("no match: string in array", () => {
        const chk = checkNot("owner", ["jsmith"], "jsmith");
        expect(chk).toEqual({
          attribute: "owner",
          values: "jsmith",
          condition: "NOT_IN",
          requirement: "jsmith",
          matched: true,
          message: "No match",
        });
      });
      it("no match: array in array", () => {
        const chk = checkNot("group", ["3ef", "cc0"], ["3ef", "4ef"]);
        expect(chk).toEqual({
          attribute: "group",
          values: "3ef,4ef",
          condition: "NOT_IN",
          requirement: "3ef,cc0",
          matched: true,
          message: "No match",
        });
      });
    });
  });
});
