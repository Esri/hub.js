import { IHubSearchOptions } from "../../../search";
import { hubSearch } from "../../../search/hubSearch";
import { IQuery } from "../../../search/types/IHubCatalog";
import { IHubRequestOptions } from "../../../types";
import { HubEntity } from "../../types/HubEntity";
import { IUiSchemaComboboxItem } from "../types";

/**
 * Fetch the entity's org tags (limited to the top 200),
 * merge with any configured on the entity itself, and convert
 * into a format that can be consumed by the combobox field
 *
 * TODO: the search portion of this util should probably
 * be hoisted to hub.js
 */
export async function getTagItems(
  entity: HubEntity,
  orgId: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IUiSchemaComboboxItem[]> {
  const query: IQuery = {
    targetEntity: "item",
    filters: [{ predicates: [{ orgid: orgId }] }],
  };
  const opts: IHubSearchOptions = {
    aggFields: ["tags"],
    num: 0,
    aggLimit: 200,
    requestOptions: hubRequestOptions,
  };

  try {
    const {
      aggregations: [tagsAgg],
    } = await hubSearch(query, opts);
    /**
     * Because we allow custom tags, we need to merge the existing entity tags
     * and the tags fetched from the orgs, then remove duplicates, filter out
     * any empty values and convert them to the IUiSchemaComboboxItem format
     */
    const entityTags = entity.tags || [];
    return [...new Set([...tagsAgg.values.map((t) => t.value), ...entityTags])]
      .filter((t) => t)
      .map((t) => ({ value: t }));
  } catch (e) {
    return [];
  }
}
