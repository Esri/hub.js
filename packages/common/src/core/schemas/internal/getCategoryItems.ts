import { request } from "@esri/arcgis-rest-request";
import { IHubRequestOptions } from "../../../types";
import { HubEntity } from "../../types/HubEntity";
import { IUiSchemaComboboxItem } from "../types";

/**
 * Fetch the categorySchema for all the categories, including
 * the ones with 0 count, then recursively collet all the child
 * categories on the deepest level. Parse into a format that
 * can be consumed by the combobox field
 *
 * TODO: the request portion of this util should probably
 * be hoisted to hub.js
 * TODO: render nested categories in combobox
 */
export async function getCategoryItems(
  orgId: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IUiSchemaComboboxItem[]> {
  const url = `${hubRequestOptions.portal}/portals/${orgId}/categorySchema`;
  try {
    const { categorySchema } = await request(url, hubRequestOptions);
    return parseCategories(categorySchema[0].categories, []);
  } catch (e) {
    return [];
  }
}

function parseCategories(
  categories: any[],
  allCategories: any[]
): IUiSchemaComboboxItem[] {
  categories.forEach((c) => {
    if (!c.categories?.length) {
      allCategories.push({
        value: c.title,
      });
    } else {
      parseCategories(c.categories, allCategories);
    }
  });
  return allCategories;
}
