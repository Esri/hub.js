import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { createItem } from "@esri/arcgis-rest-portal";
import { IItemAdd } from "@esri/arcgis-rest-types";

export async function createContentWithUrl(
  item: IItemAdd,
  requestOptions: IUserRequestOptions
): Promise<string> {
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
  return createResult.id;
}
