import { transformEntityToEditor } from "../../../src/channels/_internal/transformEntityToEditor";
import * as transformEntityPermissionPoliciesToFormValuesModule from "../../../src/channels/_internal/transformEntityPermissionPoliciesToFormValues";
import {
  IHubChannel,
  IHubChannelEditor,
  IHubRoleConfigValue,
} from "../../../src/core/types/IHubChannel";
import { CHANNEL_PERMISSIONS } from "../../../src/channels/_internal/ChannelBusinessRules";
import { COLLABORATION_TYPES } from "../../../src/permissions/types/IEntityPermissionPolicy";
import { IArcGISContext } from "../../../src/types/IArcGISContext";

describe("transformEntityToEditor", () => {
  const context: IArcGISContext = {
    currentUser: {
      orgId: "userOrgId123",
    },
  } as IArcGISContext;
  it("should transform an IHubChannel object to an IHubChannelEditor object", () => {
    const entity: IHubChannel = {
      id: "31c",
      name: "My channel",
      blockWords: ["baad", "baaaad"],
      allowAsAnonymous: true,
      permissions: [
        {
          permission: CHANNEL_PERMISSIONS.channelRead,
          collaborationType: COLLABORATION_TYPES.anonymous,
          collaborationId: null,
          id: "1aa",
        },
        {
          permission: CHANNEL_PERMISSIONS.channelWrite,
          collaborationType: COLLABORATION_TYPES.authenticated,
          collaborationId: null,
          id: "2aa",
        },
        {
          permission: CHANNEL_PERMISSIONS.channelReadWrite,
          collaborationType: COLLABORATION_TYPES.org,
          collaborationId: "orgId1",
          id: "3aa",
        },
        {
          permission: CHANNEL_PERMISSIONS.channelManage,
          collaborationType: COLLABORATION_TYPES.orgAdmin,
          collaborationId: "orgId1",
          id: "4aa",
        },
        {
          permission: CHANNEL_PERMISSIONS.channelReadWrite,
          collaborationType: COLLABORATION_TYPES.group,
          collaborationId: "groupId1",
          id: "5aa",
        },
        {
          permission: CHANNEL_PERMISSIONS.channelModerate,
          collaborationType: COLLABORATION_TYPES.groupAdmin,
          collaborationId: "groupId1",
          id: "6aa",
        },
        {
          permission: CHANNEL_PERMISSIONS.channelRead,
          collaborationType: COLLABORATION_TYPES.user,
          collaborationId: "userId1",
          id: "7aa",
        },
        {
          permission: CHANNEL_PERMISSIONS.channelOwner,
          collaborationType: COLLABORATION_TYPES.user,
          collaborationId: "userId2",
          id: "8aa",
        },
      ],
    } as IHubChannel;
    const publicConfigs: IHubRoleConfigValue[] = [
      {
        key: "public",
        roles: {
          anonymous: {
            value: CHANNEL_PERMISSIONS.channelRead,
            id: "1aa",
          },
          authenticated: {
            value: CHANNEL_PERMISSIONS.channelWrite,
            id: "2aa",
          },
        },
      },
    ];
    const orgConfigs: IHubRoleConfigValue[] = [
      {
        key: "orgId1",
        entityId: "orgId1",
        entityType: "organization",
        roles: {
          member: {
            value: CHANNEL_PERMISSIONS.channelReadWrite,
            id: "3aa",
          },
          admin: {
            value: CHANNEL_PERMISSIONS.channelManage,
            id: "4aa",
          },
        },
      },
    ];
    const groupConfigs: IHubRoleConfigValue[] = [
      {
        key: "groupId1",
        entityId: "groupId1",
        entityType: "group",
        roles: {
          member: {
            value: CHANNEL_PERMISSIONS.channelReadWrite,
            id: "5aa",
          },
          admin: {
            value: CHANNEL_PERMISSIONS.channelModerate,
            id: "6aa",
          },
        },
      },
    ];
    const userConfigs: IHubRoleConfigValue[] = [
      {
        key: "userId1",
        entityId: "userId1",
        entityType: "user",
        roles: {
          user: {
            value: CHANNEL_PERMISSIONS.channelRead,
            id: "7aa",
          },
        },
      },
    ];
    const ownerConfigs: IHubRoleConfigValue[] = [
      {
        key: "userId2",
        entityId: "userId2",
        entityType: "user",
        roles: {
          user: {
            value: CHANNEL_PERMISSIONS.channelOwner,
            id: "8aa",
          },
        },
      },
    ];
    const transformEntityPermissionPoliciesToPublicFormValuesSpy = spyOn(
      transformEntityPermissionPoliciesToFormValuesModule,
      "transformEntityPermissionPoliciesToPublicFormValues"
    ).and.returnValue(publicConfigs);
    const transformEntityPermissionPoliciesToOrgFormValuesSpy = spyOn(
      transformEntityPermissionPoliciesToFormValuesModule,
      "transformEntityPermissionPoliciesToOrgFormValues"
    ).and.returnValue(orgConfigs);
    const transformEntityPermissionPoliciesToGroupFormValuesSpy = spyOn(
      transformEntityPermissionPoliciesToFormValuesModule,
      "transformEntityPermissionPoliciesToGroupFormValues"
    ).and.returnValue(groupConfigs);
    const transformEntityPermissionPoliciesToUserFormValuesSpy = spyOn(
      transformEntityPermissionPoliciesToFormValuesModule,
      "transformEntityPermissionPoliciesToUserFormValues"
    ).and.returnValue(userConfigs);
    const transformEntityPermissionPoliciesToOwnerFormValuesSpy = spyOn(
      transformEntityPermissionPoliciesToFormValuesModule,
      "transformEntityPermissionPoliciesToOwnerFormValues"
    ).and.returnValue(ownerConfigs);
    const expected: IHubChannelEditor = {
      id: "31c",
      name: "My channel",
      blockWords: "baad,baaaad",
      allowAsAnonymous: true,
      publicConfigs,
      orgConfigs,
      groupConfigs,
      userConfigs,
      ownerConfigs,
    };
    const result = transformEntityToEditor(entity, context);
    expect(result).toEqual(expected);
    expect(
      transformEntityPermissionPoliciesToPublicFormValuesSpy
    ).toHaveBeenCalledTimes(1);
    expect(
      transformEntityPermissionPoliciesToPublicFormValuesSpy
    ).toHaveBeenCalledWith(entity.permissions);
    expect(
      transformEntityPermissionPoliciesToOrgFormValuesSpy
    ).toHaveBeenCalledTimes(1);
    expect(
      transformEntityPermissionPoliciesToOrgFormValuesSpy
    ).toHaveBeenCalledWith(entity.permissions, context.currentUser.orgId);
    expect(
      transformEntityPermissionPoliciesToGroupFormValuesSpy
    ).toHaveBeenCalledTimes(1);
    expect(
      transformEntityPermissionPoliciesToGroupFormValuesSpy
    ).toHaveBeenCalledWith(entity.permissions);
    expect(
      transformEntityPermissionPoliciesToUserFormValuesSpy
    ).toHaveBeenCalledTimes(1);
    expect(
      transformEntityPermissionPoliciesToUserFormValuesSpy
    ).toHaveBeenCalledWith(entity.permissions);
    expect(
      transformEntityPermissionPoliciesToOwnerFormValuesSpy
    ).toHaveBeenCalledTimes(1);
    expect(
      transformEntityPermissionPoliciesToOwnerFormValuesSpy
    ).toHaveBeenCalledWith(entity.permissions, context.currentUser.orgId);
  });
});
