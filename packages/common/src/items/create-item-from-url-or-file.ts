import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import {
  ICreateItemResponse,
  setItemAccess,
  shareItemWithGroup,
} from "@esri/arcgis-rest-portal";
import { IGroup, IItemAdd } from "@esri/arcgis-rest-types";
import { failSafe, isUpdateGroup } from "../utils";
import { createItemFromFile } from "./create-item-from-file";
import { createItemFromUrl } from "./create-item-from-url";
import { _waitForItemReady } from "./_internal/_wait-for-item-ready";

interface ICreateItemFromUrlOrFileOptions extends IUserRequestOptions {
  item: IItemAdd;
  groups?: IGroup[];
}

/**
 * Creates an item in online from either url or file.
 * Once created we wait for the item to be ready (or throw an error if creation failed)
 * If access is not private then we make a call to update that.
 *
 * @export
 * @param {IItemAdd} item Item to be uploaded into online
 * @param {string[]} groupIds Group ids for the item to be shared to.
 * @param {IUserRequestOptions} requestOptions
 * @return {*}  {Promise<string>} AGO item id
 */
export async function createItemFromUrlOrFile(
  createItemFromUrlOrFileOptions: ICreateItemFromUrlOrFileOptions
): Promise<ICreateItemResponse> {
  const { item, groups, ...userRequestOptions } =
    createItemFromUrlOrFileOptions;
  // Is there a file or data url?
  const shouldWaitForItemReady = item.dataUrl || item.file;
  let createdItem: ICreateItemResponse;

  // If there is a file then we create the item and chunk the file
  // while multithread uploading it
  if (item.file) {
    createdItem = await createItemFromFile(item, userRequestOptions);
    // Otherwise it's being created from a url.
  } else {
    createdItem = await createItemFromUrl(item, userRequestOptions);
  }

  // If there is a file or data url we want to check to see if / when the item is ready.
  if (shouldWaitForItemReady) {
    await _waitForItemReady(createdItem.id, userRequestOptions);
  }

  // If the item access is NOT private (which is the sharing access level by default)
  // We subsequently update the items access level.
  if (item.access !== "private") {
    await setItemAccess({
      id: createdItem.id,
      owner: item.owner,
      access: item.access,
      ...userRequestOptions,
    });
  }

  // If group ids were passedd in then make share calls to each.
  if (groups?.length) {
    const failSafeShare = failSafe(shareItemWithGroup);
    await Promise.all(
      groups.map((group: IGroup) =>
        failSafeShare({
          id: createdItem.id,
          owner: item.owner,
          groupId: group.id,
          confirmItemControl: isUpdateGroup(group),
          ...userRequestOptions,
        })
      )
    );
  }

  return createdItem;
}
