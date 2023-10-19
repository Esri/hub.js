import { IArcGISContext } from "../../../ArcGISContext";
import { cacheBustUrl } from "../../../urls/cacheBustUrl";
import { IEntityEditorOptions } from "./EditorOptions";

export function getFeaturedImageUrl(
  options: IEntityEditorOptions,
  context: IArcGISContext
) {
  const queryParams = context.isAuthenticated
    ? `?token=${context.session.token}`
    : "";
  // TODO: Decide if the url should be passed in or plucked out of this deep path here
  return (
    options.view?.featuredImageUrl &&
    cacheBustUrl(`${options.view.featuredImageUrl}${queryParams}`)
  );
}
