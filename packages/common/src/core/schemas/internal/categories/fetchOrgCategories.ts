import { request } from "@esri/arcgis-rest-request";
import { IHubRequestOptions } from "../../../../hub-types";

/**
 * Fetch the categorySchema for all the categories in an org, including
 * the ones with 0 count, then recursively construct an array of
 * fully qualified category paths.
 *
 * @param orgId The organization id
 * @param hubRequestOptions The hub request options
 * @returns a flat array of category paths (e.g. ["/Categories/Category1", "/Categories/Category1/Subcategory1", ...])
 */
export async function fetchOrgCategories(
  orgId: string,
  hubRequestOptions: IHubRequestOptions
): Promise<string[]> {
  const url = `${hubRequestOptions.portal}/portals/${orgId}/categorySchema`;
  try {
    const { categorySchema } = (await request(url, hubRequestOptions)) as {
      categorySchema: IOrgCategoriesNode[];
    };
    // All categories need to be prefixed with "/Categories" to be valid
    return parseOrgCategories(categorySchema[0].categories, "/Categories");
  } catch (e) {
    return [];
  }
}

interface IOrgCategoriesNode {
  title: string;
  categories?: IOrgCategoriesNode[];
}

/**
 * Convert the categories into a format that can be used
 * by the IUiSchemaComboboxItem interface
 *
 * @param obj The object to convert
 * @param parentValue The parent value to append to the value
 * @returns the converted object where `title` becomes `value` and `categories` becomes `children`
 */
function parseOrgCategories(
  nodes: IOrgCategoriesNode[],
  parentValue: string
): string[] {
  return nodes.reduce((categories, node) => {
    // If there is a parentValue, we append it to the category title. This follows the schema that ArcGIS Online
    // uses to save categories on items (e.g. `/Categories/path/to/my/category`) and gives this combobox item
    // a unique value to distinguish it from others
    const value = `${parentValue}/${node.title}`;
    categories.push(value);

    // If there are child categories, we recursively parse them
    if (node.categories && node.categories.length > 0) {
      categories.push(...parseOrgCategories(node.categories, value));
    }

    return categories;
  }, [] as string[]);
}
