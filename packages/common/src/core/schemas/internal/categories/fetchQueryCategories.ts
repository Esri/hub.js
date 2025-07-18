import { IHubRequestOptions } from "../../../../hub-types";
import { hubSearch } from "../../../../search/hubSearch";
import { IQuery } from "../../../../search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../../search/types/IHubSearchOptions";
import { isFullyQualifiedCategory } from "./isFullyQualifiedCategory";

/**
 * Aggregates categories from a search query. Note that aggregation categories are all lowercased.
 *
 * @param query The query to search for categories.
 * @param requestOptions The request options to use for the search.
 * @returns a flat array of fully qualified category paths, all lowercased (e.g. ["/categories/category1", "/categories/category1/subcategory1", ...])
 */
export async function fetchQueryCategories(
  query: IQuery,
  requestOptions: IHubRequestOptions
): Promise<string[]> {
  const searchOptions: IHubSearchOptions = {
    num: 1,
    include: [],
    requestOptions: requestOptions,
    aggLimit: 200,
    httpMethod: "POST",
    aggFields: ["categories"],
  };

  const response = await hubSearch(query, searchOptions);
  const categoriesAggregation = response.aggregations?.find(
    (agg) => agg.field === "categories"
  );
  if (!categoriesAggregation) {
    throw new Error(
      `No categories aggregation found while calculating categories for query`
    );
  }
  return categoriesAggregation.values
    .map((v) => v.value as string)
    .filter((v) => isFullyQualifiedCategory(v));
}
