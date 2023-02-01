import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { removeItemResource } from "@esri/arcgis-rest-portal";
import HubError from "../HubError";

/**
 * Removes a resource associated with an item
 *
 * @export
 * @param {string} id item id
 * @param {string} name resource name
 * @param {string} owner item owner
 * @param {IUserRequestOptions} ro request options
 * @return {*}  {Promise<{
 *   success: boolean;
 * }>}
 */
export async function removeResource(
  id: string,
  name: string,
  owner: string,
  ro: IUserRequestOptions
): Promise<{
  success: boolean;
}> {
  try {
    // Remove item resource
    const response = await removeItemResource({
      id,
      resource: name,
      owner,
      ...ro,
    });
    // if err throw
    if (!response.success) {
      throw new HubError(
        "Remove Item Resource",
        "Unknown error removing resource."
      );
    }
    return response;
  } catch (err) {
    if (err instanceof Error) {
      throw new HubError("Remove Item Resource", err.message, err);
    } else {
      throw new HubError(
        "Remove Item Resource",
        "Unknown error removing resource."
      );
    }
  }
}
