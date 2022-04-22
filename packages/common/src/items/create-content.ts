import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { setItemAccess } from "@esri/arcgis-rest-portal";
import { IItemAdd } from "@esri/arcgis-rest-types";
import { createContentWithFile } from "./create-content-with-file";
import { createContentWithUrl } from "./create-content-with-url";
import { _waitForItemReady } from "./_internal/_wait-for-item-ready";

/**
 * Creates an item in online from either url or file.
 * Once created we wait for the item to be ready (or throw an error if creation failed)
 * If access is not private then we make a call to update that.
 *
 * @export
 * @param {IItemAdd} item Item to be uploaded into online
 * @param {IUserRequestOptions} requestOptions
 * @return {*}  {Promise<string>} AGO item id
 */
export async function createContent(
  item: IItemAdd,
  requestOptions: IUserRequestOptions
): Promise<string> {
  // Is there a file or data url?
  const shouldWaitForItemReady = item.dataUrl || item.file;
  let itemId: string;

  // If there is a file then we create the item and chunk the file
  // while multithread uploading it
  if (item.file) {
    itemId = await createContentWithFile(item, requestOptions);
    // Otherwise it's being created from a url.
  } else {
    itemId = await createContentWithUrl(item, requestOptions);
  }

  // If there is a file or data url we want to check to see if / when the item is ready.
  if (shouldWaitForItemReady) {
    await _waitForItemReady(itemId, requestOptions);
  }

  // If the item access is NOT private (which is the sharing access level by default)
  // We subsequently update the items access level.
  if (item.access !== "private") {
    await setItemAccess({
      id: itemId,
      owner: item.owner,
      access: item.access,
      ...requestOptions,
    });
  }

  return itemId;
}
