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
export async function getNestedCategoryItems(
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
 * Fetch the categorySchema for all the categories, including
 * the ones with 0 count, then recursively collet all the child
 * categories on the deepest level.
 *
 * @param orgId The organization id
 * @param hubRequestOptions The hub request options
 * @returns a _flattened_ structure of categories
 */
export async function getFlattenedCategoryItems(
  orgId: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IUiSchemaComboboxItem[]> {
  const nestedCategories = await getNestedCategoryItems(
    orgId,
    hubRequestOptions
  );
  return flattenCategories(nestedCategories, []);
}

/**
 * Recursively flatten the nested categories
 *
 * @param nestedCategories The nested categories
 * @param allCategories The array to store the flattened categories
 * @param parents The parent categories
 * @returns a _flattened_ structure of categories
 */
function flattenCategories(
  nestedCategories: IUiSchemaComboboxItem[],
  allCategories: any[],
  parents?: string
): IUiSchemaComboboxItem[] {
  nestedCategories.forEach((nestedCategory) => {
    const { value, label, children } = nestedCategory;
    const category = { value, label, parents };
    allCategories.push(category);
    if (children) {
      flattenCategories(children, allCategories, value);
    }
  });
  return allCategories;
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
    const value = parentValue
      ? `${parentValue} / ${category.title}`
      : category.title;
    const label = category.title;
    return {
      value: `${value}`,
      label: `${label}`,
      children: !category.categories?.length
        ? null
        : convertCategoryProps(category.categories, value),
    };
  });
}
