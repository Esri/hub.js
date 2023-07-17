import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IPredicate } from "../../../src";
import { explainPredicate } from "../../../src/search/_internal/explainPredicate";
import { GenericResult } from "../../../src/search/explainResult";

// Explain Predicate just delegates to more specific functions
// so we'll just verify that it does that, not that the specific
// functions work - those are tested elsewhere
fdescribe("explainPredicate:", () => {
  it("matchOptionsPredicate", () => {
    const fn = spyOn(
      require("../../../src/search/_internal/explainHelpers"),
      "explainMatchOptionPredicate"
    ).and.returnValue(Promise.resolve({ included: true }));
    const predicate: IPredicate = {
      tags: {
        any: ["a", "b"],
      },
    };
    const result: GenericResult = {
      tags: ["b", "c", "d"],
    };
    explainPredicate(predicate, result, {} as IRequestOptions);
    expect(fn).toHaveBeenCalled();
  });
  it("DatePredicate", () => {
    const fn = spyOn(
      require("../../../src/search/_internal/explainHelpers"),
      "explainDatePredicate"
    ).and.returnValue(Promise.resolve({ included: true }));
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
    explainPredicate(predicate, result, {} as IRequestOptions);
    expect(fn).toHaveBeenCalled();
  });
  it("PropPredicate", () => {
    const fn = spyOn(
      require("../../../src/search/_internal/explainHelpers"),
      "explainPropPredicate"
    ).and.returnValue(Promise.resolve({ included: true }));
    const predicate: IPredicate = {
      name: "yoda",
    };
    const result: GenericResult = {
      name: "vader",
    };
    explainPredicate(predicate, result, {} as IRequestOptions);
    expect(fn).toHaveBeenCalled();
  });
});
