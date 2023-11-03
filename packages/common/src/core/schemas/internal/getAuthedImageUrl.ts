import { IArcGISContext } from "../../../ArcGISContext";
import { cacheBustUrl } from "../../../urls/cacheBustUrl";

export function getAuthedImageUrl(url: string, context: IArcGISContext) {
  const queryParams = context.isAuthenticated
    ? `?token=${context.session.token}`
    : "";
  // TODO: Decide if the url should be passed in or plucked out of this deep path here
  return url && cacheBustUrl(`${url}${queryParams}`);
}
