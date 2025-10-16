import { getItemData, IItem } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IModel } from "../hub-types";
import { shouldFetchData } from "../content/_internal/shouldFetchData";

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
  const data = shouldFetchData(item, [
    // other types that require data fetches
    "Discussion",
    "Hub Initiative",
    "Hub Page",
    "Hub Project",
  ])
    ? ((await getItemData(item.id, requestOptions).catch(
        (): null => null
      )) as Record<string, unknown>)
    : null;
  return {
    item,
    data,
  } as IModel;
}
