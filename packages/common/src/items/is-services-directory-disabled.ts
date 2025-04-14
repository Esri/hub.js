import { parseServiceUrl } from "@esri/arcgis-rest-feature-layer";
import { getItem } from "@esri/arcgis-rest-portal";
import {
  IRequestOptions,
  isNoCorsRequestRequired,
  request,
  sendNoCorsRequest,
} from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";

/**
 * Checks if a server's services directory is disabled. Consider hoisting this to RESTJS
 * @param idOrItem A feature service ID or item
 * @param requestOptions Request options
 * @returns Promise that resolves boolean
 */
export const isServicesDirectoryDisabled = async (
  idOrItem: string | IItem,
  requestOptions: IRequestOptions
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
      const { status } = await request(url, {
        ...requestOptions,
        rawResponse: true,
      });
      // const { status } = await fetch(url, requestOptions);
      disabled = status !== 200;
    } else {
      disabled = true;
    }
  } catch (e) {
    disabled = true;
  }
  return disabled;
};
