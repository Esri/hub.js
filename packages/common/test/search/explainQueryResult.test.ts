import { IQuery, GenericResult, explainQueryResult } from "../../src";
import * as ExplainFilterModule from "../../src/search/_internal/explainFilter";
describe("explainQueryResult:", () => {
  it("throws if not an item query", async () => {
    const query: IQuery = {
      targetEntity: "group",
      filters: [],
    };
    const result: GenericResult = {
      id: "123",
    };
    const requestOptions = {};
    try {
      await explainQueryResult(result, query, requestOptions);
    } catch (err) {
      expect(err.message).toContain(
        'Only queries with targetEntity: "item" are supported'
      );
    }
  });
  it("delegates to explain filter", async () => {
    const query: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [{ tags: "foo" }],
        },
        {
          predicates: [{ tags: "bar" }],
        },
      ],
    };
    const result: GenericResult = {
      id: "123",
      tags: ["bar", "foo"],
    };
    const requestOptions = {};
    const explainSpy = spyOn(
      ExplainFilterModule,
      "explainFilter"
    ).and.callThrough();

    const chk = await explainQueryResult(result, query, requestOptions);
    expect(explainSpy).toHaveBeenCalledTimes(2);
    expect(chk.result).toEqual(result);
    expect(chk.query).toEqual(query);
    expect(chk.matched).toBe(true);
  });
  it("if any filter returns matched=false, query does not match", async () => {
    const query: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [{ tags: "foo" }],
        },
        {
          predicates: [{ tags: "bar" }],
        },
      ],
    };
    const result: GenericResult = {
      id: "123",
      tags: ["foo"],
    };
    const requestOptions = {};
    const explainSpy = spyOn(
      ExplainFilterModule,
      "explainFilter"
    ).and.callThrough();

    const chk = await explainQueryResult(result, query, requestOptions);
    expect(explainSpy).toHaveBeenCalledTimes(2);
    expect(chk.result).toEqual(result);
    expect(chk.query).toEqual(query);
    expect(chk.matched).toBe(false);
  });
});
