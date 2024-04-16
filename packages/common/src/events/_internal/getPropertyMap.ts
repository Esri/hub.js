import { IPropertyMap } from "../../core/_internal/PropertyMapper";

/**
 * @private
 * Returns an Array of IPropertyMap objects
 * that define the projection of properties from an IEvent to an IHubEvent
 * @returns an IPropertyMap array
 */
export function getPropertyMap(): IPropertyMap[] {
  const commonPropNames = [
    "orgId",
    "description",
    "id",
    "tags",
    "categories",
    "timeZone",
    "summary",
    "notifyAttendees",
    "allowRegistration",
  ];
  return commonPropNames.reduce(
    (acc, propName) => [...acc, { entityKey: propName, storeKey: propName }],
    [
      { entityKey: "isAllDay", storeKey: "allDay" },
      { entityKey: "name", storeKey: "title" },
      { entityKey: "owner", storeKey: "creator.username" },
      { entityKey: "canEdit", storeKey: "permission.canEdit" },
      { entityKey: "canDelete", storeKey: "permission.canDelete" },
      {
        entityKey: "canChangeAccessOrg",
        storeKey: "permission.canSetAccessToOrg",
      },
      {
        entityKey: "canChangeAccessPrivate",
        storeKey: "permission.canSetAccessToPrivate",
      },
      {
        entityKey: "canChangeAccessPublic",
        storeKey: "permission.canSetAccessToPublic",
      },
      {
        entityKey: "canChangeStatusCancelled",
        storeKey: "permission.canSetStatusToCancelled",
      },
      {
        entityKey: "canChangeStatusRemoved",
        storeKey: "permission.canSetStatusToRemoved",
      },
      {
        entityKey: "readGroupIds",
        storeKey: "readGroups",
      },
      {
        entityKey: "editGroupIds",
        storeKey: "editGroups",
      },
    ]
  );
}
