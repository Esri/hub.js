import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { setItemAccess } from "@esri/arcgis-rest-portal";
import { IItemAdd } from "@esri/arcgis-rest-types";
import { createContentWithFile } from "./create-content-with-file";
import { createContentWithUrl } from "./create-content-with-url";
import { _waitForItemReady } from "./_internal/_wait-for-item-ready";

export async function createContent(
  item: IItemAdd,
  requestOptions: IUserRequestOptions
): Promise<string> {
  const shouldWaitForItemReady = item.dataUrl || item.file;
  let itemId: string;

  if (item.file) {
    itemId = await createContentWithFile(item, requestOptions);
  } else {
    itemId = await createContentWithUrl(item, requestOptions);
  }

  if (shouldWaitForItemReady) {
    await _waitForItemReady(itemId, requestOptions);
  }

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
