import {
  generateFilter,
  createFilters
} from "../../../../src/ago/helpers/filters/create-filters";
import { ISearchParams } from "../../../../src/ago/params";

describe("generateFilters test", () => {
  it("deserializes filter string when there is not a function match in the filter string", () => {
    const filterDefinition = {
      type: "filter",
      dataType: "string",
      defaultOp: "any"
    };
    const values = "x,y,z";
    const actual = generateFilter(values, filterDefinition);
    const expected: any = {
      fn: "any",
      terms: ["x", "y", "z"],
      catalogDefinition: undefined
    };
    expect(actual).toEqual(expected);
  });

  it("deserializes filter string when there is a function match in the filter string", () => {
    const filterDefinition = {
      type: "filter",
      dataType: "string",
      defaultOp: "any"
    };
    const values = "any(x,y,z)";
    const actual = generateFilter(values, filterDefinition);
    const expected: any = {
      fn: "any",
      terms: ["x", "y", "z"],
      catalogDefinition: undefined
    };
    expect(actual).toEqual(expected);
  });
});

describe("createFilters test", () => {
  it("converts raw ISearchParams into filter object", () => {
    const params: ISearchParams = {
      q: "",
      tags: "a,b,c",
      groupIds: "1ef,2ac",
      source: "x",
      hasApi: "true"
    };
    const actual = createFilters(params);
    const expected: any = {
      tags: {
        fn: "all",
        terms: ["a", "b", "c"],
        catalogDefinition: undefined
      },
      groupIds: { fn: "any", terms: ["1ef", "2ac"], catalogDefinition: true },
      source: { fn: "any", terms: ["x"], catalogDefinition: undefined },
      hasApi: { fn: null, terms: ["true"], catalogDefinition: undefined }
    };
    expect(actual).toEqual(expected);
  });
});
