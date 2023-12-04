import { UserSession } from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { cacheBustUrl } from "../../urls/cacheBustUrl";

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
  // TODO: Decide if the url should be passed in or plucked out of this deep path here
  return url && cacheBustUrl(`${url}${queryParams}`);
}
