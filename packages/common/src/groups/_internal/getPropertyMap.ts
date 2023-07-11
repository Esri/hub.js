import { IPropertyMap } from "../../core/_internal/PropertyMapper";

/**
 * Returns an Array of IPropertyMap objects
 * that define the projection of properties from a IModel to an IHubGroup
 * @returns
 * @private
 */

export function getPropertyMap(): IPropertyMap[] {
  const map: IPropertyMap[] = [];

  /**
   * group-specific mappings. Note: we do not need to explicitly map
   * properties from the group item's data.view into the entity's view
   * because that mapping is already defined in the base property map
   */
  map.push({ entityKey: "name", storeKey: "title" });
  map.push({ entityKey: "summary", storeKey: "snippet" });

  const groupProps = [
    "access",
    "autoJoin",
    "description",
    "id",
    "isInvitationOnly",
    "isDiscussable",
    "isReadOnly",
    "isViewOnly",
    "membershipAccess",
    "owner",
    "protected",
    "sortField",
    "sortOrder",
    "tags",
    "thumbnail",
    "thumbnailUrl",
    "userMembership",
  ];
  groupProps.forEach((entry) => {
    map.push({ entityKey: entry, storeKey: entry });
  });

  return map;
}
