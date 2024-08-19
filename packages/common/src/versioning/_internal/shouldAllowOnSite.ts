import { IHubItemEntity } from "../../core";
import { isOpenDataGroup } from "../../groups";
import { HubSite } from "../../sites";

// VERIFY ACCESS
// Rules:
// - umbrella? entity is in an open data group
// - otherwise: entity is contained in the catalog
export const shouldAllowOnSite = async (
  entityInstance: IHubItemEntity,
  siteInstance: HubSite
) => {
  if (siteInstance.toJson().isUmbrella) {
    // for umbrella we only allow entities that are in an Open Data group
    const groups = await entityInstance.sharedWith();
    return groups.some(isOpenDataGroup);
  } else {
    // only allow entities that are in the site's catalog
    // TODO: 'group' when entity is group
    const entityType = "item";
    return (
      siteInstance.catalog &&
      (await siteInstance.catalog.contains(entityInstance.id, { entityType }))
        .isContained
    );
  }
};
