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
export async function getCategoryItems(
  orgId: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IUiSchemaComboboxItem[]> {
  const url = `${hubRequestOptions.portal}/portals/${orgId}/categorySchema`;
  try {
    const { categorySchema } = await request(url, hubRequestOptions);
    return convertCategoryProps(categorySchema[0].categories);
  } catch (e) {
    return [];
  }
}

/**
 * Convert the categories into a format that can be used
 * by the IUiSchemaComboboxItem interface
 *
 * @param obj The object to convert
 * @returns the converted object where `title` becomes `value` and `categories` becomes `children`
 */
function convertCategoryProps(
  arrayOfCategories: any,
  parentValue?: string
): IUiSchemaComboboxItem[] {
  return arrayOfCategories.map((category: any) => {
    // if there is a parentValue, append the category title to it to give it a unique value
    // that can be distinguished from other categories
    const value = parentValue
      ? `${parentValue} / ${category.title}`
      : category.title;

    // use just the title as the label, so we don't have redundant information visually
    const label = category.title;

    // if there are no more categories, return null for children, otherwise recursively call this function
    return {
      value,
      label,
      children: !category.categories?.length
        ? []
        : convertCategoryProps(category.categories, value),
    };
  });
}
