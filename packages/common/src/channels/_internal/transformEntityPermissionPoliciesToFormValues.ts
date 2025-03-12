import { HubEntityType } from "../../core/types";
import {
  COLLABORATION_TYPES,
  CollaborationType,
  IEntityPermissionPolicy,
} from "../../permissions/types/IEntityPermissionPolicy";
import {
  CHANNEL_PERMISSIONS,
  ChannelNonePermission,
} from "./ChannelBusinessRules";

// TODO: finalize & move
export interface IHubRoleConfigValue {
  key: string;
  entityId?: string;
  entityType?: HubEntityType;
  roles: Record<string, { value: string; id?: string }>;
}

const COLLABORATION_TYPE_TO_ENTITY_TYPE_MAP: Partial<
  Record<CollaborationType, HubEntityType>
> = {
  [COLLABORATION_TYPES.user]: "user",
  [COLLABORATION_TYPES.group]: "group",
  [COLLABORATION_TYPES.groupAdmin]: "group",
  [COLLABORATION_TYPES.org]: "organization",
  [COLLABORATION_TYPES.orgAdmin]: "organization",
};

const COLLABORATION_TYPE_TO_ROLE_MAP: Partial<
  Record<CollaborationType, string>
> = {
  [COLLABORATION_TYPES.user]: "user",
  [COLLABORATION_TYPES.group]: "member",
  [COLLABORATION_TYPES.groupAdmin]: "admin",
  [COLLABORATION_TYPES.org]: "member",
  [COLLABORATION_TYPES.orgAdmin]: "admin",
};

/**
 * @private
 * Transforms an array of IEntityPermissionPolicy (Hub entity) objects to an array of IHubRoleConfigValue (entity editor) objects
 * representing the channel's public (anonymous & authenticated) permissions
 * @param permissionPolicies An array of IEntityPermissionPolicy objects
 * @returns an array of IHubRoleConfigValue objects
 */
export const transformEntityPermissionPoliciesToPublicFormValues = (
  permissionPolicies: IEntityPermissionPolicy[]
): IHubRoleConfigValue[] => {
  const anonymousPermission = permissionPolicies.find(
    ({ collaborationType }) =>
      collaborationType === COLLABORATION_TYPES.anonymous
  );
  const authenticatedPermission = permissionPolicies.find(
    ({ collaborationType }) =>
      collaborationType === COLLABORATION_TYPES.authenticated
  );
  return [
    {
      key: "public",
      roles: {
        anonymous: {
          value: anonymousPermission?.permission || ChannelNonePermission,
          id: anonymousPermission?.id,
        },
        authenticated: {
          value: authenticatedPermission?.permission || ChannelNonePermission,
          id: authenticatedPermission?.id,
        },
      },
    },
  ];
};

/**
 * @private
 * Transforms an array of IEntityPermissionPolicy (Hub entity) objects to an array of IHubRoleConfigValue (entity editor) objects
 * representing the channel's group (member & admin) permissions
 * @param permissionPolicies An array of IEntityPermissionPolicy objects
 * @returns an array of IHubRoleConfigValue objects
 */
export const transformEntityPermissionPoliciesToGroupFormValues = (
  permissionPolicies: IEntityPermissionPolicy[]
): IHubRoleConfigValue[] => {
  const permissionsByGroup = permissionPolicies.reduce<
    Record<
      string,
      { group: IEntityPermissionPolicy; "group-admin": IEntityPermissionPolicy }
    >
  >((acc, permissionPolicy) => {
    if (
      [COLLABORATION_TYPES.group, COLLABORATION_TYPES.groupAdmin].includes(
        permissionPolicy.collaborationType
      ) &&
      permissionPolicy.permission !== CHANNEL_PERMISSIONS.channelOwner
    ) {
      return {
        ...acc,
        [permissionPolicy.collaborationId]: {
          ...acc[permissionPolicy.collaborationId],
          [permissionPolicy.collaborationType]: permissionPolicy,
        },
      };
    } else {
      return acc;
    }
  }, {});
  return Object.entries(permissionsByGroup).reduce(
    (acc, [groupId, { group, ["group-admin"]: groupAdmin }]) => {
      return [
        ...acc,
        {
          key: groupId,
          entityId: groupId,
          entityType: "group",
          roles: {
            member: {
              value: group?.permission || ChannelNonePermission,
              id: group?.id,
            },
            admin: {
              value: groupAdmin?.permission || ChannelNonePermission,
              id: groupAdmin?.id,
            },
          },
        },
      ];
    },
    []
  );
};

/**
 * @private
 * Transforms an array of IEntityPermissionPolicy (Hub entity) objects to an array of IHubRoleConfigValue (entity editor) objects
 * representing the channel's org (member & admin) permissions
 * @param permissionPolicies An array of IEntityPermissionPolicy objects
 * @param defaultOrgId The current user's orgId
 * @returns an array of IHubRoleConfigValue objects
 */
export const transformEntityPermissionPoliciesToOrgFormValues = (
  permissionPolicies: IEntityPermissionPolicy[],
  defaultOrgId?: string
): IHubRoleConfigValue[] => {
  const permissionsByOrg = permissionPolicies.reduce<
    Record<
      string,
      { org: IEntityPermissionPolicy; "org-admin": IEntityPermissionPolicy }
    >
  >((acc, permissionPolicy) => {
    if (
      [COLLABORATION_TYPES.org, COLLABORATION_TYPES.orgAdmin].includes(
        permissionPolicy.collaborationType
      )
    ) {
      return {
        ...acc,
        [permissionPolicy.collaborationId]: {
          ...acc[permissionPolicy.collaborationId],
          [permissionPolicy.collaborationType]: permissionPolicy,
        },
      };
    } else {
      return acc;
    }
  }, {});
  const orgConfigs: IHubRoleConfigValue[] = Object.entries(
    permissionsByOrg
  ).reduce((acc, [orgId, { org, ["org-admin"]: orgAdmin }]) => {
    return [
      ...acc,
      {
        key: orgId,
        entityId: orgId,
        entityType: "organization",
        roles: {
          member: {
            value: org?.permission || ChannelNonePermission,
            id: org?.id,
          },
          admin: {
            value: orgAdmin?.permission || ChannelNonePermission,
            id: orgAdmin?.id,
          },
        },
      },
    ];
  }, []);
  if (!orgConfigs.length) {
    orgConfigs.push({
      key: defaultOrgId,
      entityId: defaultOrgId,
      entityType: "organization",
      roles: {
        member: {
          value: ChannelNonePermission,
          id: undefined,
        },
        admin: {
          value: CHANNEL_PERMISSIONS.channelOwner,
          id: undefined,
        },
      },
    });
  }
  return orgConfigs;
};

/**
 * @private
 * Transforms an array of IEntityPermissionPolicy (Hub entity) objects to an array of IHubRoleConfigValue (entity editor) objects
 * representing the channel's individual user permissions
 * @param permissionPolicies An array of IEntityPermissionPolicy objects
 * @returns an array of IHubRoleConfigValue objects
 */
export const transformEntityPermissionPoliciesToUserFormValues = (
  permissionPolicies: IEntityPermissionPolicy[]
): IHubRoleConfigValue[] => {
  return permissionPolicies.reduce<IHubRoleConfigValue[]>(
    (acc, permissionPolicy) => {
      return permissionPolicy.collaborationType === COLLABORATION_TYPES.user
        ? [
            ...acc,
            {
              key: permissionPolicy.collaborationId,
              entityId: permissionPolicy.collaborationId,
              entityType: "user",
              roles: {
                user: {
                  value: permissionPolicy.permission,
                  id: permissionPolicy.id,
                },
              },
            },
          ]
        : acc;
    },
    []
  );
};

/**
 * @private
 * Transforms an array of IEntityPermissionPolicy (Hub entity) objects to a IHubRoleConfigValue (entity editor) object
 * representing the channel's owner permissions
 * @param permissionPolicies An array of IEntityPermissionPolicy objects
 * @param defaultOrgId The current user's orgId
 * @returns an IHubRoleConfigValue object
 */
// export const transformEntityPermissionPoliciesToOwnerFormValues = (
//   permissionPolicies: IEntityPermissionPolicy[],
//   defaultOrgId: string
// ): IHubRoleConfigValue[] => {
//   const ownerConfigs: IHubRoleConfigValue[] = permissionPolicies.reduce<
//     IHubRoleConfigValue[]
//   >((acc, permissionPolicy) => {
//     if (permissionPolicy.permission === CHANNEL_PERMISSIONS.channelOwner) {
//       return [
//         ...acc,
//         {
//           key: permissionPolicy.collaborationId,
//           entityId: permissionPolicy.collaborationId,
//           entityType:
//             COLLABORATION_TYPE_TO_ENTITY_TYPE_MAP[
//               permissionPolicy.collaborationType
//             ],
//           roles: {
//             [COLLABORATION_TYPE_TO_ROLE_MAP[
//               permissionPolicy.collaborationType
//             ]]: {
//               value: permissionPolicy.permission,
//               id: permissionPolicy.id,
//             },
//           },
//         },
//       ];
//     }
//     return acc;
//   }, []);
//   // create a channel owner config if one doesn't exist
//   if (!ownerConfigs.length) {
//     ownerConfigs.push({
//       key: defaultOrgId,
//       entityId: defaultOrgId,
//       entityType: COLLABORATION_TYPE_TO_ENTITY_TYPE_MAP["org-admin"],
//       roles: {
//         [COLLABORATION_TYPE_TO_ROLE_MAP["org-admin"]]: {
//           value: CHANNEL_PERMISSIONS.channelOwner,
//           id: undefined,
//         },
//       },
//     });
//   }
//   return ownerConfigs;
// };
