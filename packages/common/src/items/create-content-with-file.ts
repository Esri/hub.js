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

export async function createContentWithFile(
  item: IItemAdd,
  requestOptions: IUserRequestOptions
): Promise<string> {
  // Make a copy of the file
  const file: any = cloneObject(item.file);
  //  and remove the file object so
  // that it won't trigger the direct upload at the createContent request
  delete item.file;

  const createResult = await createItem({
    item,
    filename: file.name,
    async: true,
    multipart: true,
    overwrite: true,
    ...requestOptions,
  });

  const itemId = createResult.id;

  try {
    // AGOL recommends at least 5mb for each file part
    // to upload so we use 6mb to slice the file.
    // see https://developers.arcgis.com/rest/users-groups-and-items/add-item-part.htm
    const sizeLimit = 6 * 1000 * 1000;
    const uploadQueue = _prepareUploadRequests(
      file,
      item.owner,
      itemId,
      sizeLimit,
      requestOptions
    );
    // up to 5 concurrent requests
    await _multiThreadUpload(uploadQueue, 5);

    await commitItemUpload({
      id: itemId,
      item,
      owner: item.owner,
      ...requestOptions,
    });
  } catch (e) {
    await cancelItemUpload({
      id: itemId,
      owner: item.owner,
      ...requestOptions,
    });

    throw e;
  }

  return itemId;
}
