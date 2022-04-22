import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { createItem } from "@esri/arcgis-rest-portal";
import { IItemAdd } from "@esri/arcgis-rest-types";

/**
 * Create AGO item from a URL
 *
 * @export
 * @param {IItemAdd} item Item to be uploaded into online.
 * @param {IUserRequestOptions} requestOptions
 * @return {*}  {Promise<string>} Newly created item ID
 */
export async function createContentWithUrl(
  item: IItemAdd,
  requestOptions: IUserRequestOptions
): Promise<string> {
  // Fire off createItem call
  const createResult = await createItem({
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
  return createResult.id;
}
