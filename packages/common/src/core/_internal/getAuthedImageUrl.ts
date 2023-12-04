import { UserSession } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { cacheBustUrl } from "../../urls/cacheBustUrl";

/**
 * Get the image url with token if authenticated,
 * return the original url otherwise
 * @param url image url
 * @param requestOptions
 */
export function getAuthedImageUrl(
  url: string,
  requestOptions: IRequestOptions
) {
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }
  const queryParams = requestOptions.authentication ? `?token=${token}` : "";

  return url && cacheBustUrl(`${url}${queryParams}`);
}
