import {
  IItemAdd,
  IItemUpdate,
  IItem,
  ICreateItemOptions,
  IUpdateItemOptions,
  ICommitItemOptions,
} from "@esri/arcgis-rest-portal";

// needed to preserve 3.x behavior for saving item data
export function serializeItemParams<T>(
  requestOptions: ICreateItemOptions | IUpdateItemOptions | ICommitItemOptions
): T {
  requestOptions.params = {
    ...requestOptions.params,
    ...serializeItem(requestOptions.item),
  };
  return requestOptions as unknown as T;
}

// istanbul ignore next - copied from
// https://github.com/Esri/arcgis-rest-js/blob/8eccee45394850467194e53390df7df3e661f104/packages/arcgis-rest-portal/src/items/helpers.ts#L255
function serializeItem(item: IItemAdd | IItemUpdate | IItem): any {
  // create a clone so we're not messing with the original
  const clone = JSON.parse(JSON.stringify(item));

  // binary data needs POSTed as a `file`
  // JSON object literals should be passed as `text`.
  if (clone.data) {
    (typeof Blob !== "undefined" && item.data instanceof Blob) ||
    // Node.js doesn't implement Blob
    item.data.constructor.name === "ReadStream"
      ? (clone.file = item.data)
      : (clone.text = item.data);
    delete clone.data;
  }
  return clone;
}
