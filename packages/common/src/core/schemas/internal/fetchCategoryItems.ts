import { request } from "@esri/arcgis-rest-request";
import { IHubRequestOptions } from "../../../types";
import { IUiSchemaComboboxItem } from "../types";

/**
 * Fetch the categorySchema for all the categories, including
 * the ones with 0 count, then recursively collet all the child
 * categories on the deepest level.
 *
 * @param orgId The organization id
 * @param hubRequestOptions The hub request options
 * @returns a _nested_ structure of categories
 */
export async function fetchCategoryItems(
  orgId: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IUiSchemaComboboxItem[]> {
  const url = `${hubRequestOptions.portal}/portals/${orgId}/categorySchema`;
  try {
    const { categorySchema } = await request(url, hubRequestOptions);
    // All categories need to be prefixed with "/Categories" to be valid
    return convertCategoryProps(categorySchema[0].categories, "/Categories");
  } catch (e) {
    return [];
  }
}

/**
 * Convert the categories into a format that can be used
 * by the IUiSchemaComboboxItem interface
 *
 * @param obj The object to convert
 * @param parentValue The parent value to append to the value
 * @returns the converted object where `title` becomes `value` and `categories` becomes `children`
 */
function convertCategoryProps(
  arrayOfCategories: any,
  parentValue: string
): IUiSchemaComboboxItem[] {
  return arrayOfCategories.map((category: any) => {
    // If there is a parentValue, we append it to the category title. This follows the schema that ArcGIS Online
    // uses to save categories on items (e.g. `/Categories/path/to/my/category`) and gives this combobox item
    // a unique value to distinguish it from others
    const value = `${parentValue}/${category.title}`;

    // use just the title as the label, so we don't have redundant information visually
    const label = category.title;

    return {
      value,
      label,
      children: category.categories?.length
        ? convertCategoryProps(category.categories, value)
        : [],
    };
  });
}
