import { IWithViewSettings } from "../../../core/traits/IWithViewSettings";
import { IArcGISContext } from "../../../ArcGISContext";
import { cacheBustUrl } from "../../../urls/cacheBustUrl";

export function getFeaturedImageUrl(
  view: IWithViewSettings,
  context: IArcGISContext
) {
  const queryParams = context.isAuthenticated
    ? `?token=${context.session.token}`
    : "";
  // TODO: Decide if the url should be passed in or plucked out of this deep path here
  return (
    view?.featuredImageUrl &&
    cacheBustUrl(`${view.featuredImageUrl}${queryParams}`)
  );
}
