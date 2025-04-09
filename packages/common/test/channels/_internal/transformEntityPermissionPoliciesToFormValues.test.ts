import { COLLABORATION_TYPES, IEntityPermissionPolicy } from "../../../src";
import {
  CHANNEL_PERMISSIONS,
  ChannelNonePermission,
} from "../../../src/channels/_internal/ChannelBusinessRules";
import {
  IHubRoleConfigValue,
  transformEntityPermissionPoliciesToPublicFormValues,
  transformEntityPermissionPoliciesToOrgFormValues,
  transformEntityPermissionPoliciesToGroupFormValues,
  transformEntityPermissionPoliciesToUserFormValues,
} from "../../../src/channels/_internal/transformEntityPermissionPoliciesToFormValues";

describe("transformEntityPermissionPoliciesToFormValues", () => {
  describe("transformEntityPermissionPoliciesToPublicFormValues", () => {
    it("should build default values", () => {
      const results = transformEntityPermissionPoliciesToPublicFormValues([]);
      const expected: IHubRoleConfigValue[] = [
        {
          key: "public",
          roles: {
            anonymous: {
              value: ChannelNonePermission,
              id: undefined,
            },
            authenticated: {
              value: ChannelNonePermission,
              id: undefined,
            },
          },
        },
      ];
      expect(results).toEqual(expected);
    });
    it("should build values from existing policies", () => {
      const results = transformEntityPermissionPoliciesToPublicFormValues([
        {
          collaborationType: COLLABORATION_TYPES.anonymous,
          collaborationId: null,
          id: "31c",
          permission: CHANNEL_PERMISSIONS.channelRead,
        },
        {
          collaborationType: COLLABORATION_TYPES.authenticated,
          collaborationId: null,
          id: "52n",
          permission: CHANNEL_PERMISSIONS.channelReadWrite,
        },
        {
          collaborationType: COLLABORATION_TYPES.group,
          collaborationId: "groupId123",
          id: "63n",
          permission: CHANNEL_PERMISSIONS.channelReadWrite,
        },
      ]);
      const expected: IHubRoleConfigValue[] = [
        {
          key: "public",
          roles: {
            anonymous: {
              value: CHANNEL_PERMISSIONS.channelRead,
              id: "31c",
            },
            authenticated: {
              value: CHANNEL_PERMISSIONS.channelReadWrite,
              id: "52n",
            },
          },
        },
      ];
      expect(results).toEqual(expected);
    });
  });

  describe("transformEntityPermissionPoliciesToOrgFormValues", () => {
    it("should build default values", () => {
      const results = transformEntityPermissionPoliciesToOrgFormValues(
        [],
        "orgId123"
      );
      const expected: IHubRoleConfigValue[] = [
        {
          key: "orgId123",
          entityId: "orgId123",
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
        },
      ];
      expect(results).toEqual(expected);
    });
    it("should build values from existing policies", () => {
      const results = transformEntityPermissionPoliciesToOrgFormValues(
        [
          {
            collaborationType: COLLABORATION_TYPES.org,
            collaborationId: "orgId123",
            id: "31c",
            permission: CHANNEL_PERMISSIONS.channelRead,
          },
          {
            collaborationType: COLLABORATION_TYPES.orgAdmin,
            collaborationId: "orgId123",
            id: "52n",
            permission: CHANNEL_PERMISSIONS.channelOwner,
          },
          {
            collaborationType: COLLABORATION_TYPES.orgAdmin,
            collaborationId: "orgId456",
            permission: CHANNEL_PERMISSIONS.channelManage,
          },
          {
            collaborationType: COLLABORATION_TYPES.org,
            collaborationId: "orgId789",
            permission: CHANNEL_PERMISSIONS.channelReadWrite,
          },
          {
            collaborationType: COLLABORATION_TYPES.groupAdmin,
            collaborationId: "groupId123",
            id: "63b",
            permission: CHANNEL_PERMISSIONS.channelManage,
          },
        ],
        "orgId456"
      );
      const expected: IHubRoleConfigValue[] = [
        {
          key: "orgId123",
          entityId: "orgId123",
          entityType: "organization",
          roles: {
            member: {
              value: CHANNEL_PERMISSIONS.channelRead,
              id: "31c",
            },
            admin: {
              value: CHANNEL_PERMISSIONS.channelOwner,
              id: "52n",
            },
          },
        },
        {
          key: "orgId456",
          entityId: "orgId456",
          entityType: "organization",
          roles: {
            member: {
              value: ChannelNonePermission,
              id: undefined,
            },
            admin: {
              value: CHANNEL_PERMISSIONS.channelManage,
              id: undefined,
            },
          },
        },
        {
          key: "orgId789",
          entityId: "orgId789",
          entityType: "organization",
          roles: {
            member: {
              value: CHANNEL_PERMISSIONS.channelReadWrite,
              id: undefined,
            },
            admin: {
              value: ChannelNonePermission,
              id: undefined,
            },
          },
        },
      ];
      expect(results).toEqual(expected);
    });
  });

  describe("transformEntityPermissionPoliciesToGroupFormValues", () => {
    it("should not build default values", () => {
      const results = transformEntityPermissionPoliciesToGroupFormValues([]);
      const expected: IHubRoleConfigValue[] = [];
      expect(results).toEqual(expected);
    });
    it("should build values from existing policies", () => {
      const results = transformEntityPermissionPoliciesToGroupFormValues([
        {
          collaborationType: COLLABORATION_TYPES.group,
          collaborationId: "groupId123",
          id: "31c",
          permission: CHANNEL_PERMISSIONS.channelRead,
        },
        {
          collaborationType: COLLABORATION_TYPES.groupAdmin,
          collaborationId: "groupId123",
          id: "52n",
          permission: CHANNEL_PERMISSIONS.channelManage,
        },
        {
          collaborationType: COLLABORATION_TYPES.group,
          collaborationId: "groupId456",
          id: "21k",
          permission: CHANNEL_PERMISSIONS.channelRead,
        },
        {
          collaborationType: COLLABORATION_TYPES.groupAdmin,
          collaborationId: "groupId789",
          id: "7l3",
          permission: CHANNEL_PERMISSIONS.channelManage,
        },
        {
          collaborationType: COLLABORATION_TYPES.orgAdmin,
          collaborationId: "orgId123",
          id: "63b",
          permission: CHANNEL_PERMISSIONS.channelManage,
        },
        {
          collaborationType: COLLABORATION_TYPES.groupAdmin,
          collaborationId: "groupId555",
          id: "825",
          permission: CHANNEL_PERMISSIONS.channelOwner,
        },
      ]);
      const expected: IHubRoleConfigValue[] = [
        {
          key: "groupId123",
          entityId: "groupId123",
          entityType: "group",
          roles: {
            member: {
              value: CHANNEL_PERMISSIONS.channelRead,
              id: "31c",
            },
            admin: {
              value: CHANNEL_PERMISSIONS.channelManage,
              id: "52n",
            },
          },
        },
        {
          key: "groupId456",
          entityId: "groupId456",
          entityType: "group",
          roles: {
            member: {
              value: CHANNEL_PERMISSIONS.channelRead,
              id: "21k",
            },
            admin: {
              value: ChannelNonePermission,
              id: undefined,
            },
          },
        },
        {
          key: "groupId789",
          entityId: "groupId789",
          entityType: "group",
          roles: {
            member: {
              value: ChannelNonePermission,
              id: undefined,
            },
            admin: {
              value: CHANNEL_PERMISSIONS.channelManage,
              id: "7l3",
            },
          },
        },
        {
          key: "groupId555",
          entityId: "groupId555",
          entityType: "group",
          roles: {
            member: {
              value: ChannelNonePermission,
              id: undefined,
            },
            admin: {
              value: CHANNEL_PERMISSIONS.channelOwner,
              id: "825",
            },
          },
        },
      ];
      expect(results).toEqual(expected);
    });
  });

  describe("transformEntityPermissionPoliciesToUserFormValues", () => {
    it("should build values from existing policies", () => {
      const input: IEntityPermissionPolicy[] = [
        {
          collaborationType: COLLABORATION_TYPES.user,
          collaborationId: "userId123",
          id: "11a",
          permission: CHANNEL_PERMISSIONS.channelRead,
        },
        {
          collaborationType: COLLABORATION_TYPES.user,
          collaborationId: "userId345",
          permission: CHANNEL_PERMISSIONS.channelReadWrite,
        },
        {
          collaborationType: COLLABORATION_TYPES.user,
          collaborationId: "userId678",
          permission: CHANNEL_PERMISSIONS.channelOwner,
        },
        {
          collaborationType: COLLABORATION_TYPES.group,
          collaborationId: "groupId123",
          permission: CHANNEL_PERMISSIONS.channelRead,
        },
      ];
      const expected: IHubRoleConfigValue[] = [
        {
          key: "userId123",
          entityId: "userId123",
          entityType: "user",
          roles: {
            user: {
              value: CHANNEL_PERMISSIONS.channelRead,
              id: "11a",
            },
          },
        },
        {
          key: "userId345",
          entityId: "userId345",
          entityType: "user",
          roles: {
            user: {
              value: CHANNEL_PERMISSIONS.channelReadWrite,
              id: undefined,
            },
          },
        },
        {
          key: "userId678",
          entityId: "userId678",
          entityType: "user",
          roles: {
            user: {
              value: CHANNEL_PERMISSIONS.channelOwner,
              id: undefined,
            },
          },
        },
      ];
      const results = transformEntityPermissionPoliciesToUserFormValues(input);
      expect(results).toEqual(expected);
    });
  });
});
