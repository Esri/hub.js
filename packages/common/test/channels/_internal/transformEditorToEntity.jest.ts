import { transformEditorToEntity } from "../../../src/channels/_internal/transformEditorToEntity";
import {
  IHubChannel,
  IHubChannelEditor,
} from "../../../src/core/types/IHubChannel";
import * as transformFormValuesToEntityPermissionPoliciesModule from "../../../src/channels/_internal/transformFormValuesToEntityPermissionPolicies";
import {
  CHANNEL_PERMISSIONS,
  ChannelNonePermission,
} from "../../../src/channels/_internal/ChannelBusinessRules";
import { IEntityPermissionPolicy } from "../../../src/permissions/types/IEntityPermissionPolicy";

describe("transformEditorToEntity", () => {
  it("should transform an IHubChannelEditor to a partial IHubChannel", () => {
    const editor: IHubChannelEditor = {
      id: "31c",
      name: "My channel",
      blockWords: "baad, baaaad",
      publicConfigs: [
        {
          key: "public",
          entityId: null,
          entityType: null,
          roles: {
            anonymous: {
              value: ChannelNonePermission,
              id: "11a",
            },
            authenticated: {
              value: CHANNEL_PERMISSIONS.channelRead,
              id: "11b",
            },
          },
        },
      ],
      orgConfigs: [
        {
          key: "orgId123",
          entityId: "orgId123",
          entityType: "organization",
          roles: {
            member: {
              value: CHANNEL_PERMISSIONS.channelReadWrite,
              id: "11c",
            },
            admin: {
              value: CHANNEL_PERMISSIONS.channelOwner,
              id: "11d",
            },
          },
        },
      ],
      groupConfigs: [
        {
          key: "groupId123",
          entityId: "groupId123",
          entityType: "group",
          roles: {
            member: {
              value: CHANNEL_PERMISSIONS.channelReadWrite,
              id: "11e",
            },
            admin: {
              value: CHANNEL_PERMISSIONS.channelModerate,
              id: "11f",
            },
          },
        },
      ],
      userConfigs: [
        {
          key: "userId123",
          entityId: "userId123",
          entityType: "user",
          roles: {
            user: {
              value: CHANNEL_PERMISSIONS.channelReadWrite,
              id: "11g",
            },
          },
        },
      ],
      allowAsAnonymous: true,
    };
    const permissionPolicies: IEntityPermissionPolicy[] = [
      {
        permission: CHANNEL_PERMISSIONS.channelRead,
        collaborationType: "authenticated",
        collaborationId: null,
        id: "11b",
      },
      {
        permission: CHANNEL_PERMISSIONS.channelReadWrite,
        collaborationType: "org",
        collaborationId: "orgId123",
        id: "11c",
      },
      {
        permission: CHANNEL_PERMISSIONS.channelOwner,
        collaborationType: "org-admin",
        collaborationId: "orgId123",
        id: "11d",
      },
      {
        permission: CHANNEL_PERMISSIONS.channelReadWrite,
        collaborationType: "group",
        collaborationId: "groupId123",
        id: "11e",
      },
      {
        permission: CHANNEL_PERMISSIONS.channelModerate,
        collaborationType: "group-admin",
        collaborationId: "groupId123",
        id: "11f",
      },
      {
        permission: CHANNEL_PERMISSIONS.channelReadWrite,
        collaborationType: "user",
        collaborationId: "userId123",
        id: "11g",
      },
    ];
    const transformFormValuesToEntityPermissionPoliciesSpy = jest
      .spyOn(
        transformFormValuesToEntityPermissionPoliciesModule,
        "transformFormValuesToEntityPermissionPolicies"
      )
      .mockReturnValue(permissionPolicies);
    const results = transformEditorToEntity(editor);
    const expected: Partial<IHubChannel> = {
      name: "My channel",
      blockWords: ["baad", "baaaad"],
      allowAsAnonymous: true,
      permissions: permissionPolicies,
    };
    expect(results).toEqual(expected);
    expect(
      transformFormValuesToEntityPermissionPoliciesSpy
    ).toHaveBeenCalledTimes(1);
    expect(
      transformFormValuesToEntityPermissionPoliciesSpy
    ).toHaveBeenCalledWith([
      ...editor.publicConfigs,
      ...editor.orgConfigs,
      ...editor.groupConfigs,
      ...editor.userConfigs,
    ]);
  });
});
