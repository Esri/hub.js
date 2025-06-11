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
  let transformEntityPermissionPoliciesToPublicFormValuesSpy: jasmine.Spy;
  let transformEntityPermissionPoliciesToOrgFormValuesSpy: jasmine.Spy;
  let transformEntityPermissionPoliciesToGroupFormValuesSpy: jasmine.Spy;
  let transformEntityPermissionPoliciesToUserFormValuesSpy: jasmine.Spy;
  const CONTEXT: IArcGISContext = {
    currentUser: {
      orgId: "userOrgId123",
    },
  } as IArcGISContext;
  const PUBLIC_CONFIGS: IHubRoleConfigValue[] = [
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
  const ORG_CONFIGS: IHubRoleConfigValue[] = [
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
          value: CHANNEL_PERMISSIONS.channelOwner,
          id: "4aa",
        },
      },
    },
  ];
  const GROUP_CONFIGS: IHubRoleConfigValue[] = [
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
  const USER_CONFIGS: IHubRoleConfigValue[] = [
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
  const ENTITY: IHubChannel = {
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
        permission: CHANNEL_PERMISSIONS.channelOwner,
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

  beforeEach(() => {
    transformEntityPermissionPoliciesToPublicFormValuesSpy = spyOn(
      transformEntityPermissionPoliciesToFormValuesModule,
      "transformEntityPermissionPoliciesToPublicFormValues"
    ).and.returnValue(PUBLIC_CONFIGS);
    transformEntityPermissionPoliciesToOrgFormValuesSpy = spyOn(
      transformEntityPermissionPoliciesToFormValuesModule,
      "transformEntityPermissionPoliciesToOrgFormValues"
    ).and.returnValue(ORG_CONFIGS);
    transformEntityPermissionPoliciesToGroupFormValuesSpy = spyOn(
      transformEntityPermissionPoliciesToFormValuesModule,
      "transformEntityPermissionPoliciesToGroupFormValues"
    ).and.returnValue(GROUP_CONFIGS);
    transformEntityPermissionPoliciesToUserFormValuesSpy = spyOn(
      transformEntityPermissionPoliciesToFormValuesModule,
      "transformEntityPermissionPoliciesToUserFormValues"
    ).and.returnValue(USER_CONFIGS);
  });

  it("should transform an IHubChannel object to an IHubChannelEditor object", () => {
    const expected: IHubChannelEditor = {
      id: "31c",
      name: "My channel",
      blockWords: "baad,baaaad",
      allowAsAnonymous: true,
      publicConfigs: PUBLIC_CONFIGS,
      orgConfigs: ORG_CONFIGS,
      groupConfigs: GROUP_CONFIGS,
      userConfigs: USER_CONFIGS,
    };
    const result = transformEntityToEditor(ENTITY, CONTEXT);
    expect(result).toEqual(expected);
    expect(
      transformEntityPermissionPoliciesToPublicFormValuesSpy
    ).toHaveBeenCalledTimes(1);
    expect(
      transformEntityPermissionPoliciesToPublicFormValuesSpy
    ).toHaveBeenCalledWith(ENTITY.permissions);
    expect(
      transformEntityPermissionPoliciesToOrgFormValuesSpy
    ).toHaveBeenCalledTimes(1);
    expect(
      transformEntityPermissionPoliciesToOrgFormValuesSpy
    ).toHaveBeenCalledWith(ENTITY.permissions, CONTEXT.currentUser.orgId);
    expect(
      transformEntityPermissionPoliciesToGroupFormValuesSpy
    ).toHaveBeenCalledTimes(1);
    expect(
      transformEntityPermissionPoliciesToGroupFormValuesSpy
    ).toHaveBeenCalledWith(ENTITY.permissions);
    expect(
      transformEntityPermissionPoliciesToUserFormValuesSpy
    ).toHaveBeenCalledTimes(1);
    expect(
      transformEntityPermissionPoliciesToUserFormValuesSpy
    ).toHaveBeenCalledWith(ENTITY.permissions);
  });
  it("should handle blockWords being null", () => {
    const entity: IHubChannel = {
      ...ENTITY,
      blockWords: null,
    } as IHubChannel;
    const expected: IHubChannelEditor = {
      id: "31c",
      name: "My channel",
      blockWords: "",
      allowAsAnonymous: true,
      publicConfigs: PUBLIC_CONFIGS,
      orgConfigs: ORG_CONFIGS,
      groupConfigs: GROUP_CONFIGS,
      userConfigs: USER_CONFIGS,
    };
    const result = transformEntityToEditor(entity, CONTEXT);
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
    ).toHaveBeenCalledWith(entity.permissions, CONTEXT.currentUser.orgId);
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
  });
});
