import {
  FetchReadMethodName,
  getItemResource,
  IItem,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { failSafe } from "../utils";

/**
 * Given an item, and a list of resource name/prop pairs,
 * fetch the resources and return as an object for the IModel
 *
 * @export
 * @param {IItem} item
 * @param {{
 *     [key: string]: string
 *   }} resourceNamePairs
 * @param {IRequestOptions} requestOptions
 * @return {*}  {Promise<Record<string, any>>}
 */
// we should actually resolve this lint error
// eslint-disable-next-line @typescript-eslint/require-await
export async function fetchModelResources(
  item: IItem,
  resourceNamePairs: {
    [key: string]: string;
  },
  requestOptions: IRequestOptions
): Promise<Record<string, any>> {
  // Iterate through the resource name/prop pairs and fetch the resources
  return Object.entries(resourceNamePairs).reduce(
    async (acc: Record<string, any>, [key, value]) => {
      // failsafe to prevent errors returns falsy if error
      const failSafeGetResource = failSafe(getItemResource, null);
      // get the resource
      const resp = await failSafeGetResource(item.id, {
        fileName: value,
        // Must be "arrayBuffer" | "blob" | "formData" | "json" | "text";
        readAs: value.split(".").pop() as FetchReadMethodName,
        ...requestOptions,
      });
      // if the failsafe succeeds
      if (resp) {
        // Update the acc with the prop and resource
        acc[key] = resp;
      }
      return acc;
    },
    {}
  );
}
