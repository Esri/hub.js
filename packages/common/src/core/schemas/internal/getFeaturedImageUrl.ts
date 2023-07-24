import { IArcGISContext } from "../../../ArcGISContext";
import { cacheBustUrl } from "../../../urls/cacheBustUrl";
import { HubEntity } from "../../types/HubEntity";

export function getFeaturedImageUrl(
  entity: HubEntity,
  context: IArcGISContext
) {
  const queryParams = context.isAuthenticated
    ? `?token=${context.session.token}`
    : "";
  // TODO: Decide if the url should be passed in or plucked out of this deep path here
  return cacheBustUrl(`${entity.view.featuredImageUrl}${queryParams}`);
}
