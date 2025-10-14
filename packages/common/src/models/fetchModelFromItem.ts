import { getItemData, IItem } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IModel } from "../hub-types";
import { includes } from "../utils";

/**
 * Given an Item, fetch the data json and return an IModel
 * @param item
 * @param requestOptions
 * @returns
 */
export async function fetchModelFromItem(
  item: IItem,
  requestOptions: IRequestOptions
): Promise<IModel> {
  const data = shouldFetchItemData(item)
    ? ((await getItemData(item.id, requestOptions).catch(() => null)) as Record<
        string,
        unknown
      >)
    : null;
  return {
    item,
    data,
  } as IModel;
}

/**
 * Determine if we should attempt to fetch the item data
 * @param item
 * @returns
 */
export function shouldFetchItemData(item: IItem): boolean {
  // This function can and should be expanded as we discover
  // more item types or families that should not attempt to
  // fetch data for. Example: "Image Collection" will try
  // to download the entire image collection to the browser
  const typesToExclude = ["Image Collection"];
  return !includes(typesToExclude, item.type);
}
