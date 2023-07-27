import { IPropertyMap } from "../../core/_internal/PropertyMapper";

/**
 * Returns an Array of IPropertyMap objects
 * that define the projection of properties from a IGroup to an IHubGroup
 * @returns
 * @private
 */

export function getPropertyMap(): IPropertyMap[] {
  const map: IPropertyMap[] = [];

  /**
   * group-specific mappings
   */
  map.push({ entityKey: "name", storeKey: "title" });
  map.push({ entityKey: "summary", storeKey: "snippet" });
  map.push({ entityKey: "permissions", storeKey: "properties.permissions" });

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
