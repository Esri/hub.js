import * as hubSearchModule from "../../../../../src/search/hubSearch";
import { fetchQueryCategories } from "../../../../../src/core/schemas/internal/categories/fetchQueryCategories";
import { IHubRequestOptions } from "../../../../../src/hub-types";
import { IQuery } from "../../../../../src/search/types/IHubCatalog";
import { vi, expect } from "vitest";

describe("fetchQueryCategories:", () => {
  let hubSearchSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    hubSearchSpy = vi.spyOn(hubSearchModule, "hubSearch") as ReturnType<
      typeof vi.spyOn
    >;
  });

  it("throws an error if no aggregations are found", async () => {
    hubSearchSpy.mockResolvedValue({});
    const query = { q: "test" } as any;
    const requestOptions = {} as IHubRequestOptions;

    await expect(fetchQueryCategories(query, requestOptions)).rejects.toThrow(
      "No categories aggregation found while calculating categories for query"
    );
  });

  it("throws an error if no categories aggregation is found", async () => {
    hubSearchSpy.mockResolvedValue({ aggregations: [] });
    const query = { q: "test" } as any;
    const requestOptions = {} as IHubRequestOptions;

    await expect(fetchQueryCategories(query, requestOptions)).rejects.toThrow(
      "No categories aggregation found while calculating categories for query"
    );
  });

  it("filters out non-fully qualified categories", async () => {
    hubSearchSpy.mockResolvedValue({
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
    });

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
