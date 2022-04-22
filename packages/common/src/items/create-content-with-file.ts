import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import {
  cancelItemUpload,
  commitItemUpload,
  createItem,
} from "@esri/arcgis-rest-portal";
import { IItemAdd } from "@esri/arcgis-rest-types";
import { cloneObject } from "../util";
import { _multiThreadUpload } from "./_internal/_multi-thread-upload";
import { _prepareUploadRequests } from "./_internal/_prepare-upload-requests";

/**
 * Creates an item in online from a local file/item.
 * Upload is multithreaded as the item is chunked up.
 *
 * @export
 * @param {IItemAdd} item Item to be uploaded into online.
 * @param {IUserRequestOptions} requestOptions
 * @return {*}  {Promise<string>} Newly created item id
 */
export async function createContentWithFile(
  item: IItemAdd,
  requestOptions: IUserRequestOptions
): Promise<string> {
  // Make a copy of the file
  const file: any = cloneObject(item.file);
  //  and remove the file object so
  // that it won't trigger the direct upload at the createContent request
  delete item.file;

  // Create the item in online so we have an id
  const createResult = await createItem({
    item,
    filename: file.name,
    async: true,
    multipart: true,
    overwrite: true,
    ...requestOptions,
  });
  // get the items id
  const itemId = createResult.id;

  try {
    // AGOL recommends at least 5mb for each file part
    // to upload so we use 6mb to slice the file.
    // see https://developers.arcgis.com/rest/users-groups-and-items/add-item-part.htm
    const sizeLimit = 6 * 1000 * 1000;
    // Create queue of upload requests.
    const uploadQueue = _prepareUploadRequests(
      file,
      item.owner,
      itemId,
      sizeLimit,
      requestOptions
    );
    // execute up to 5 concurrent requests
    await _multiThreadUpload(uploadQueue, 5);

    // Commit is called once all parts are uploaded during a multipart add item or update item operation.
    await commitItemUpload({
      id: itemId,
      item,
      owner: item.owner,
      ...requestOptions,
    });
  } catch (e) {
    // If an error is thrown then cancel item upload
    await cancelItemUpload({
      id: itemId,
      owner: item.owner,
      ...requestOptions,
    });

    throw e;
  }

  return itemId;
}
