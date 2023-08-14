import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IPredicate } from "../../../src";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { GenericResult } from "../../../src/search/explainQueryResult";
import {
  checkAll,
  checkAny,
  checkNot,
  explainDatePredicate,
  explainMatchOptionPredicate,
  explainPropPredicate,
} from "../../../src/search/_internal/explainHelpers";

const ITEM_GROUPS_RESPONSE = {
  admin: [
    { id: "ga01", title: "Admin Group 1" },
    { id: "ga02", title: "Admin Group 2" },
  ],
  member: [
    { id: "g01", title: "Member Group 1" },
    { id: "g02", title: "Member Group 2" },
  ],
  other: [{ id: "o01", title: "Other Group 1" }],
};

describe("explainQuery helpers:", () => {
  describe("explainDatePredicate:", () => {
    it("throws because it is not implemented", async () => {
      const predicate: IPredicate = {
        created: {
          type: "relative-date",
          num: 10,
          unit: "days",
        },
      };
      const result: GenericResult = {
        created: new Date().getTime(),
      };
      try {
        await explainDatePredicate(predicate, result, {} as IRequestOptions);
      } catch (err) {
        expect(err.message).toBe("Not implemented");
      }
    });
  });
  describe("explainPropPredicate:", () => {
    it("throws because it is not implemented", async () => {
      const predicate: IPredicate = {
        isopendata: true,
      };
      const result: GenericResult = {
        type: "fake thing",
      };
      try {
        await explainPropPredicate(predicate, result, {} as IRequestOptions);
      } catch (err) {
        expect(err.message).toBe("Not implemented");
      }
    });
  });

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
    it("missing prop fails", async () => {
      const predicate: IPredicate = {
        tags: {
          any: ["a", "b"],
        },
      };
      const result: GenericResult = {
        title: "No Tags!",
      };

      const chk = await explainMatchOptionPredicate(
        predicate,
        result,
        {} as IRequestOptions
      );

      expect(chk.matched).toBeFalsy();
      expect(chk.reasons.length).toEqual(1);
    });
    describe("handling groups:", () => {
      it("fetches item groups and falls through to array in array checks", async () => {
        const getGroupsSpy = spyOn(
          PortalModule,
          "getItemGroups"
        ).and.returnValue(Promise.resolve(ITEM_GROUPS_RESPONSE));
        const predicate: IPredicate = {
          group: {
            any: ["g01", "ga02"],
          },
        };
        const result: GenericResult = {
          id: "3ef",
          title: "fake item",
        };
        const chk = await explainMatchOptionPredicate(
          predicate,
          result,
          {} as IRequestOptions
        );
        expect(getGroupsSpy).toHaveBeenCalledWith("3ef", {});
        expect(chk.matched).toBeTruthy();

        expect(chk.reasons.length).toEqual(1);
        expect(chk.reasons[0].attribute).toEqual("group");
        expect(chk.reasons[0].values).toEqual("ga01,ga02,g01,g02,o01");
        expect(chk.reasons[0].condition).toEqual("IN");
        expect(chk.reasons[0].requirement).toEqual("g01,ga02");
        expect(chk.reasons[0].message).toEqual(
          "Value(s) ga01,ga02,g01,g02,o01 contained at least one of value from [g01,ga02]"
        );
        expect(chk.reasons[0].meta).toBeDefined();
      });
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
            "Value(s) 3ef,00c,4ef contained at least one of value from [3ef,4ef]",
        });
        const chk2 = checkAny("group", ["3ef", "4ef"], ["00c", "4ef"]);
        expect(chk2).toEqual({
          attribute: "group",
          values: "00c,4ef",
          condition: "IN",
          requirement: "3ef,4ef",
          matched: true,
          message:
            "Value(s) 00c,4ef contained at least one of value from [3ef,4ef]",
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
          message: "Value(s) vader did not contain any of value from [jsmith]",
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
          message: "Value(s) vader did not contain any of value from [jsmith]",
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
          message: "Value(s) 4ef,3ef,00c contained all values from [3ef,4ef]",
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
          matched: false,
          message: "Value(s) vader did not contain all values from [jsmith]",
        });
      });
      it("no match: string in array", () => {
        const chk = checkAll("owner", ["jsmith"], "vader");
        expect(chk).toEqual({
          attribute: "owner",
          values: "vader",
          condition: "ALL",
          requirement: "jsmith",
          matched: false,
          message: "Value(s) vader did not contain all values from [jsmith]",
        });
      });
      it("no match: array in array", () => {
        const chk = checkAll("group", ["3ef", "cc0"], ["3ef", "4ef"]);
        expect(chk).toEqual({
          attribute: "group",
          values: "3ef,4ef",
          condition: "ALL",
          requirement: "3ef,cc0",
          matched: false,
          message: "Value(s) 3ef,4ef did not contain all values from [3ef,cc0]",
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
          matched: false,
          message: "Value(s) jsmith is contained in [jsmith]",
        });
      });
      it("no match: string in array", () => {
        const chk = checkNot("owner", ["jsmith"], "jsmith");
        expect(chk).toEqual({
          attribute: "owner",
          values: "jsmith",
          condition: "NOT_IN",
          requirement: "jsmith",
          matched: false,
          message: "Value(s) jsmith is contained in [jsmith]",
        });
      });
      it("no match: array in array", () => {
        const chk = checkNot("group", ["3ef", "cc0"], ["3ef", "4ef"]);
        expect(chk).toEqual({
          attribute: "group",
          values: "3ef,4ef",
          condition: "NOT_IN",
          requirement: "3ef,cc0",
          matched: false,
          message: "Value(s) 3ef,4ef is contained in [3ef,cc0]",
        });
      });
    });
  });
});
