import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { createItem, ICreateItemResponse } from "@esri/arcgis-rest-portal";
import { IItemAdd } from "@esri/arcgis-rest-types";

/**
 * Create AGO item from a URL
 *
 * @export
 * @param {IItemAdd} item Item to be uploaded into online.
 * @param {IUserRequestOptions} requestOptions
 * @return {*}  {Promise<string>} Newly created item ID
 */
export async function createItemFromUrl(
  item: IItemAdd,
  requestOptions: IUserRequestOptions
): Promise<ICreateItemResponse> {
  // Fire off createItem call
  const createResult: ICreateItemResponse = await createItem({
    item,
    owner: item.owner,
    file: item.file,
    dataUrl: item.dataUrl,
    text: item.text,
    multipart: item.multipart,
    async: item.async,
    ...requestOptions,
  });
  // return the newly created item id
  return createResult;
}
