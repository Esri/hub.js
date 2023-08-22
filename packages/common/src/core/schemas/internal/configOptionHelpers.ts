import { IArcGISContext } from "../../../ArcGISContext";
import { checkPermission } from "../../../permissions/checkPermission";
import { UiSchemaElementOptions } from "../types";
import { getCategoryItems } from "./getCategoryItems";
import { getLocationExtent } from "./getLocationExtent";
import { getLocationOptions } from "./getLocationOptions";
import { getSharableGroupsComboBoxItems } from "./getSharableGroupsComboBoxItems";
import { getTagItems } from "./getTagItems";
import { getFeaturedImageUrl } from "./getFeaturedImageUrl";
import { getFeaturedContentCatalogs } from "./getFeaturedContentCatalogs";
import { ConfigurableEntity } from "./ConfigurableEntity";

export type ConfigOption =
  | "access"
  | "location"
  | "tags"
  | "categories"
  | "featuredImage"
  | "featuredContentCatalogs"
  | "thumbnail"
  | "groupsToShareTo"
  | "membershipAccess";

export type ConfigHelperFn = (
  entity: ConfigurableEntity,
  context: IArcGISContext
) => Promise<UiSchemaElementOptions>;

export const configHelpers: Record<ConfigOption, ConfigHelperFn> = {
  access: getAccessConfigOptions,
  location: getLocationConfigOptions,
  tags: getTagConfigOptions,
  categories: getCategoryConfigOptions,
  groupsToShareTo: getGroupsToShareToConfigOptions,
  featuredContentCatalogs: getFeaturedContentCatalogOptions,
  featuredImage: getFeaturedImageConfigOptions,
  thumbnail: getThumbnailConfigOptions,
  membershipAccess: getMembershipAccessConfigOptions,
};

async function getFeaturedContentCatalogOptions(
  _entity: ConfigurableEntity,
  context: IArcGISContext
): Promise<UiSchemaElementOptions> {
  return Promise.resolve({
    scope: "/properties/view/properties/featuredContentIds",
    options: getFeaturedContentCatalogs(context.currentUser),
  });
}

async function getAccessConfigOptions(
  _entity: ConfigurableEntity,
  context: IArcGISContext
): Promise<UiSchemaElementOptions> {
  return Promise.resolve({
    scope: "/properties/access",
    options: {
      orgName: context.portal.name,
    },
  });
}

async function getFeaturedImageConfigOptions(
  entity: ConfigurableEntity,
  context: IArcGISContext
): Promise<UiSchemaElementOptions> {
  return Promise.resolve({
    scope: "/properties/view/properties/featuredImage",
    options: {
      imgSrc:
        entity.view?.featuredImageUrl && getFeaturedImageUrl(entity, context),
    },
  });
}

async function getThumbnailConfigOptions(
  entity: ConfigurableEntity,
  _context: IArcGISContext
): Promise<UiSchemaElementOptions> {
  return Promise.resolve({
    scope: "/properties/_thumbnail",
    options: {
      imgSrc: entity.thumbnailUrl,
    },
  });
}

async function getLocationConfigOptions(
  entity: ConfigurableEntity,
  context: IArcGISContext
): Promise<UiSchemaElementOptions> {
  const ext = await getLocationExtent(entity, context.hubRequestOptions);
  const opts = await getLocationOptions(
    entity,
    context.portal.name,
    context.hubRequestOptions
  );
  return Promise.resolve({
    scope: "/properties/location",
    options: {
      extent: ext,
      options: opts,
    },
  });
}

// CAUSES ISSUE
async function getTagConfigOptions(
  entity: ConfigurableEntity,
  context: IArcGISContext
): Promise<UiSchemaElementOptions> {
  return Promise.resolve({
    scope: "/properties/tags",
    options: {
      items: await getTagItems(
        entity,
        context.portal.id,
        context.hubRequestOptions
      ),
    },
  });
}

async function getCategoryConfigOptions(
  _entity: ConfigurableEntity,
  context: IArcGISContext
): Promise<UiSchemaElementOptions> {
  return Promise.resolve({
    scope: "/properties/categories",
    options: {
      items: await getCategoryItems(
        context.portal.id,
        context.hubRequestOptions
      ),
    },
  });
}

async function getGroupsToShareToConfigOptions(
  _entity: ConfigurableEntity,
  context: IArcGISContext
): Promise<UiSchemaElementOptions> {
  const canShare = checkPermission(
    "platform:portal:user:shareToGroup",
    context
  );
  return Promise.resolve({
    scope: "/properties/_groups",
    options: {
      items: getSharableGroupsComboBoxItems(context.currentUser.groups),
      disabled: !canShare,
    },
  });
}

async function getMembershipAccessConfigOptions(
  _entity: ConfigurableEntity
): Promise<UiSchemaElementOptions> {
  const isEditGroup = _entity.isSharedUpdate;
  return Promise.resolve({
    scope: "/properties/membershipAccess",
    options: {
      disabled: [true, true, isEditGroup],
    },
  });
}
