import { explainFilter } from "../../../src/search/_internal/explainFilter";
import { GenericResult } from "../../../src/search/types/types";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import * as ExplainPredicateModule from "../../../src/search/_internal/explainPredicate";
import { IFilter } from "../../../src/search/types/IHubCatalog";

describe("explainFilter", () => {
  const requestOptions: IRequestOptions = {};

  it("AND Filter delegates to explain predicate and ensures ALL match", async () => {
    const filter: IFilter = {
      operation: "AND",
      predicates: [
        {
          tags: { any: ["tag1"] },
        },
        {
          tags: { any: ["tag2"] },
        },
      ],
    };
    const result: GenericResult = {
      name: "Some Map",
      tags: ["tag1", "tag2"],
    };
    const explainSpy = jest.spyOn(ExplainPredicateModule, "explainPredicate");
    const explanation = await explainFilter(filter, result, requestOptions);
    expect(explainSpy).toHaveBeenCalledTimes(2);
    expect(explanation.matched).toBe(true);
    expect(explanation.reasons.length).toBe(2);
    expect(explanation.reasons[0].matched).toBe(true);
    expect(explanation.reasons[1].matched).toBe(true);
  });
  it("OR Filter delegates to explain predicate and ensures SOME match", async () => {
    const filter: IFilter = {
      operation: "OR",
      predicates: [
        {
          tags: { any: ["tag1"] },
        },
        {
          tags: { any: ["tag2"] },
        },
      ],
    };
    const result: GenericResult = {
      name: "Some Map",
      tags: ["tag1"],
    };
    const explainSpy = jest.spyOn(ExplainPredicateModule, "explainPredicate");
    const explanation = await explainFilter(filter, result, requestOptions);
    expect(explainSpy).toHaveBeenCalledTimes(2);
    expect(explanation.matched).toBe(true);
    expect(explanation.reasons.length).toBe(2);
    expect(explanation.reasons[0].matched).toBe(true);
    expect(explanation.reasons[1].matched).toBe(false);
  });
});
