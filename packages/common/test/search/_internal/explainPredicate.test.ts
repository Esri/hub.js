import { IRequestOptions } from "@esri/arcgis-rest-request";
import { explainPredicate } from "../../../src/search/_internal/explainPredicate";
import { IPredicate } from "../../../src/search/types/IHubCatalog";
import { GenericResult } from "../../../src/search/types";
import * as explainHelpersModule from "../../../src/search/_internal/explainHelpers";

// Explain Predicate just delegates to more specific functions
// so we'll just verify that it does that, not that the specific
// functions work - those are tested elsewhere
describe("explainPredicate:", () => {
  it("matchOptionsPredicate", async () => {
    const fn = spyOn(
      explainHelpersModule,
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
    await explainPredicate(predicate, result, {} as IRequestOptions);
    expect(fn).toHaveBeenCalled();
  });
  it("DatePredicate", async () => {
    const fn = spyOn(
      explainHelpersModule,
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
    await explainPredicate(predicate, result, {} as IRequestOptions);
    expect(fn).toHaveBeenCalled();
  });
  it("PropPredicate", async () => {
    const fn = spyOn(
      explainHelpersModule,
      "explainPropPredicate"
    ).and.returnValue(Promise.resolve({ included: true }));
    const predicate: IPredicate = {
      name: "yoda",
    };
    const result: GenericResult = {
      name: "vader",
    };
    await explainPredicate(predicate, result, {} as IRequestOptions);
    expect(fn).toHaveBeenCalled();
  });
});
