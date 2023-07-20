import { checkPermission } from "../..";
import { IArcGISContext } from "../../ArcGISContext";

import { getCategoryItems } from "../../core/schemas/internal/getCategoryItems";
import { getFeaturedContentCatalogs } from "../../core/schemas/internal/getFeaturedContentCatalogs";
import { getFeaturedImageUrl } from "../../core/schemas/internal/getFeaturedImageUrl";
import { getLocationExtent } from "../../core/schemas/internal/getLocationExtent";
import { getLocationOptions } from "../../core/schemas/internal/getLocationOptions";
import { getTagItems } from "../../core/schemas/internal/getTagItems";
import { groupsToComboBoxItems } from "../../core/schemas/internal/groupsToComboBoxItems";
import { IHubProject } from "../../core/types/IHubProject";

/**
 * Construct the Project Editor configuration options
 * @param entity
 * @param context
 * @returns
 */
export async function getProjectEditorConfigOptions(
  entity: IHubProject,
  context: IArcGISContext
) {
  const canShare = checkPermission("hub:project:share", context);

  return [
    {
      scope: "/properties/access",
      options: {
        orgName: context.portal.name,
      },
    },
    {
      scope: "/properties/location",
      options: {
        extent: await getLocationExtent(entity, context.hubRequestOptions),
        options: await getLocationOptions(
          entity,
          context.portal.name,
          context.hubRequestOptions
        ),
      },
    },
    {
      scope: "/properties/tags",
      options: {
        items: await getTagItems(
          entity,
          context.portal.id,
          context.hubRequestOptions
        ),
      },
    },
    {
      scope: "/properties/categories",
      options: {
        items: await getCategoryItems(
          context.portal.id,
          context.hubRequestOptions
        ),
      },
    },
    {
      scope: "/properties/view/properties/featuredImage",
      options: {
        imgSrc:
          entity?.view?.featuredImageUrl &&
          getFeaturedImageUrl(entity, context),
      },
    },
    {
      scope: "/properties/view/properties/featuredContentIds",
      options: getFeaturedContentCatalogs(context.currentUser),
    },
    {
      scope: "/properties/groups",
      options: {
        items: groupsToComboBoxItems(context.currentUser.groups),
        disabled: !canShare,
      },
    },
  ];
}
