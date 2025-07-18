import * as hubSearchModule from "../../../../../src/search/hubSearch";
import { fetchQueryCategories } from "../../../../../src/core/schemas/internal/categories/fetchQueryCategories";
import { IHubRequestOptions } from "../../../../../src/hub-types";
import { IQuery } from "../../../../../src/search/types/IHubCatalog";

describe("fetchQueryCategories:", () => {
  let hubSearchSpy: jasmine.Spy;
  beforeEach(() => {
    hubSearchSpy = spyOn(hubSearchModule, "hubSearch");
  });
  it("throws an error if no aggregations are found", async () => {
    hubSearchSpy.and.returnValue(Promise.resolve({}));
    const query = { q: "test" } as any;
    const requestOptions = {} as IHubRequestOptions;

    try {
      await fetchQueryCategories(query, requestOptions);
      fail("Expected error to be thrown");
    } catch (error) {
      expect((error as { message: string }).message).toBe(
        "No categories aggregation found while calculating categories for query"
      );
    }
  });
  it("throws an error if no categories aggregation is found", async () => {
    hubSearchSpy.and.returnValue(Promise.resolve({ aggregations: [] }));
    const query = { q: "test" } as any;
    const requestOptions = {} as IHubRequestOptions;

    try {
      await fetchQueryCategories(query, requestOptions);
      fail("Expected error to be thrown");
    } catch (error) {
      expect((error as { message: string }).message).toBe(
        "No categories aggregation found while calculating categories for query"
      );
    }
  });

  it("filters out non-fully qualified categories", async () => {
    hubSearchSpy.and.returnValue(
      Promise.resolve({
        aggregations: [
          {
            field: "categories",
            values: [
              { value: "/categories/fruit/apple" },
              { value: "/fruit/banana" }, // not fully qualified
              { value: "/categories/vegetable/carrot" },
            ],
          },
        ],
      })
    );

    const query = { filters: [] } as IQuery;
    const requestOptions = {} as IHubRequestOptions;

    const categories = await fetchQueryCategories(query, requestOptions);
    expect(hubSearchSpy).toHaveBeenCalledTimes(1);
    expect(hubSearchSpy).toHaveBeenCalledWith(query, {
      num: 1,
      include: [],
      requestOptions: requestOptions,
      aggLimit: 200,
      httpMethod: "POST",
      aggFields: ["categories"],
    });
    expect(categories).toEqual([
      "/categories/fruit/apple",
      "/categories/vegetable/carrot",
    ]);
  });
});
