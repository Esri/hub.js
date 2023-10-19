// import { IHubSearchOptions } from "../../../search/types/IHubSearchOptions";

// import { IQuery } from "../../../search/types/IHubCatalog";
import { ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";

import { IHubRequestOptions } from "../../../types";
import { IUiSchemaComboboxItem } from "../types";
import { IEntityEditorOptions } from "./EditorOptions";
/**
 * Fetch the entity's org tags (limited to the top 200),
 * merge with any configured on the entity itself, and convert
 * into a format that can be consumed by the combobox field
 *
 * TODO: the search portion of this util should probably
 * be hoisted to hub.js
 */
export async function getTagItems(
  options: IEntityEditorOptions,
  orgId: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IUiSchemaComboboxItem[]> {
  // TODO: Once we resolve issues consuming hubSearch in Hub.js we can swap back to this approach
  // const query: IQuery = {
  //   targetEntity: "item",
  //   filters: [{ predicates: [{ orgid: orgId }] }],
  // };
  // const opts: IHubSearchOptions = {
  //   aggFields: ["tags"],
  //   num: 0,
  //   aggLimit: 200,
  //   requestOptions: hubRequestOptions,
  // };
  // const {
  //   aggregations: [tagsAgg],
  // } = await hubSearch(query, opts);
  // const {
  //   aggregations: [tagsAgg],
  // } = await Promise.resolve({
  //   aggregations: [{ values: [{ value: "test" }] }],
  // });

  try {
    const so: ISearchOptions = {
      q: `orgid:${orgId}`,
      countFields: "tags",
      countSize: 200,
      authentication: hubRequestOptions.authentication,
    };
    const response = await searchItems(so);
    const [tagsAgg] = response.aggregations.counts.map((entry) => {
      return {
        mode: "terms",
        field: entry.fieldName,
        values: entry.fieldValues,
      };
    });

    /**
     * Because we allow custom tags, we need to merge the existing entity tags
     * and the tags fetched from the orgs, then remove duplicates, filter out
     * any empty values and convert them to the IUiSchemaComboboxItem format
     */
    const entityTags = options.tags || [];
    return [...new Set([...tagsAgg.values.map((t) => t.value), ...entityTags])]
      .filter((t) => t)
      .map((t) => ({ value: t }));
  } catch (e) {
    return [];
  }
}
