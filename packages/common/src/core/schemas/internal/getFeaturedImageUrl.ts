import { IArcGISContext } from "../../../ArcGISContext";
import { cacheBustUrl } from "../../../urls/cacheBustUrl";
import { HubEntity } from "../../types/HubEntity";

export function getFeaturedImageUrl(
  entity: HubEntity,
  context: IArcGISContext
) {
  const queryParams = context?.isAuthenticated
    ? `?token=${context.session.token}`
    : "";
  return cacheBustUrl(`${entity?.view?.featuredImageUrl}${queryParams}`);
}
