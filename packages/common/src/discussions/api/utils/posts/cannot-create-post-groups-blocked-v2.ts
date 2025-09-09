import { IGroup, IUser } from "@esri/arcgis-rest-portal";
import { AclCategory, IChannel, IDiscussionsUser, Role } from "../../types";
import { canCreatePostV2 } from "./can-create-post-v2";
import { isDiscussable } from "../../../utils";

export function cannotCreatePostGroupsBlockedV2(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (canCreatePostV2(channel, user)) {
    return false;
  }
  const userGroupsById = (user.groups || []).reduce<Record<string, IGroup>>(
    (acc, group) => ({ ...acc, [group.id]: group }),
    {}
  );
  const channelUserGroups = channel.channelAcl.reduce<IGroup[]>(
    (acc, permission) =>
      permission.category === AclCategory.GROUP &&
      [
        Role.WRITE,
        Role.READWRITE,
        Role.OWNER,
        Role.MANAGE,
        Role.MODERATE,
      ].includes(permission.role) &&
      userGroupsById[permission.key]
        ? [...acc, userGroupsById[permission.key]]
        : acc,
    []
  );
  if (!channelUserGroups.length) {
    return false;
  }
  return channelUserGroups.every((group) => !isDiscussable(group));
}
