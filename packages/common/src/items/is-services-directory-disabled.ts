import { parseServiceUrl } from "@esri/arcgis-rest-feature-layer";
import { getItem, IItem } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Checks if a server's services directory is disabled. Consider hoisting this to RESTJS
 * @param idOrItem A feature service ID or item
 * @param requestOptions Request options
 * @returns Promise that resolves boolean
 */
export async function isServicesDirectoryDisabled(
  idOrItem: string | IItem,
  requestOptions: IRequestOptions
): Promise<boolean> {
  let disabled;
  try {
    const item =
      typeof idOrItem === "string"
        ? await getItem(idOrItem, requestOptions)
        : idOrItem;
    if (item.url) {
      let url = parseServiceUrl(item.url);
      if (item.access !== "public" && requestOptions.authentication) {
        const token = await requestOptions.authentication.getToken(
          item.url,
          requestOptions
        );
        if (token) {
          url = `${url}?token=${token}`;
        }
      }
      const { status } = await fetch(url);
      disabled = status !== 200;
    } else {
      disabled = true;
    }
  } catch (e) {
    disabled = true;
  }
  return disabled;
}
