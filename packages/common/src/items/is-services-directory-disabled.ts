import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import type { IItem } from "@esri/arcgis-rest-portal";
import { parseServiceUrl } from "@esri/arcgis-rest-feature-service";
import { getItem } from "@esri/arcgis-rest-portal";
import { request } from "@esri/arcgis-rest-request";

/**
 * Checks if a server's services directory is disabled. Consider hoisting this to RESTJS
 * @param idOrItem A feature service ID or item
 * @param requestOptions Request options
 * @returns Promise that resolves boolean
 */
export const isServicesDirectoryDisabled = async (
  idOrItem: string | IItem,
  requestOptions: IUserRequestOptions
): Promise<boolean> => {
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
      // We use rawResponse to get the status code
      // without having to parse the response body
      const raw = (await request(url, {
        ...requestOptions,
        rawResponse: true,
        httpMethod: "GET",
      })) as Response;

      disabled = raw.status !== 200;
    } else {
      disabled = true;
    }
  } catch (e) {
    disabled = true;
  }
  return disabled;
};
