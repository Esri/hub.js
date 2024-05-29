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
    if (!nestedCategory.children?.length) {
      allCategories.push({
        value: parents
          ? ` ${parents} / ${nestedCategory.value}`
          : nestedCategory.value,
      });
    } else {
      flattenCategories(
        nestedCategory.children,
        allCategories,
        parents ? ` ${parents} / ${nestedCategory.value}` : nestedCategory.value
      );
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
function convertCategoryProps(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertCategoryProps);
  } else if (typeof obj === "object" && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      if (key === "title") {
        newObj.value = obj[key];
      } else if (key === "categories") {
        newObj.children = convertCategoryProps(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  } else {
    return obj;
  }
}
