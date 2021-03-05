import { GroupMembership, IGroup, IUser } from "@esri/arcgis-rest-portal";

export const reduceByGroupMembership = (
  membershipTypes: GroupMembership[]
): ((memo: string[], group: IGroup) => string[]) => {
  return (memo, group) => {
    if (membershipTypes.indexOf(group.userMembership.memberType) > -1) {
      memo.push(group.id);
    }
    return memo;
  };
};

export const isOrgAdmin = (user: IUser): boolean => {
  return user.role === "org_admin" && !user.roleId;
};
