import type { IUser } from "../../../src/rest/types";
import {
  AclCategory,
  AclSubCategory,
  IChannel,
  Role,
} from "../../../src/discussions/api/types";
import { IHubChannel } from "../../../src/core/types";
import { transformChannelToEntity } from "../../../src/channels/_internal/transformChannelToEntity";
import { IEntityPermissionPolicy } from "../../../src/permissions/types";
import * as transformAclPermissionToEntityPermissionPolicyModule from "../../../src/channels/_internal/transformAclPermissionToEntityPermissionPolicy";
import * as canEditChannelV2Module from "../../../src/discussions/api/utils/channels/can-edit-channel-v2";
import * as canDeleteChannelV2Module from "../../../src/discussions/api/utils/channels/can-delete-channel-v2";

describe("transformChannelToEntity", () => {
  it("should transform a given IChannel and IUser to an IHubChannel", () => {
    const channel: IChannel = {
      id: "31c",
      name: "My channel",
      createdAt: new Date(1741102219664),
      updatedAt: new Date(1741102220000),
      creator: "creator123",
      blockWords: ["baad"],
      channelAcl: [
        {
          id: "31c",
          category: AclCategory.ORG,
          subCategory: AclSubCategory.ADMIN,
          role: Role.MANAGE,
          key: "orgId123",
        },
      ],
      allowAsAnonymous: true,
      orgId: "orgId123",
      access: "private",
    } as IChannel;
    const user: IUser = {
      username: "user123",
    };
    const entityPermissionPolicy: IEntityPermissionPolicy = {
      permission: "hub:channel:participation:manage",
      collaborationType: "org-admin",
      collaborationId: "orgId123",
      id: "31c",
    };
    const transformAclPermissionToEntityPermissionPolicySpy = spyOn(
      transformAclPermissionToEntityPermissionPolicyModule,
      "transformAclPermissionToEntityPermissionPolicy"
    ).and.returnValue(entityPermissionPolicy);
    const canEditChannelV2Spy = spyOn(
      canEditChannelV2Module,
      "canEditChannelV2"
    ).and.returnValue(true);
    const canDeleteChannelV2Spy = spyOn(
      canDeleteChannelV2Module,
      "canDeleteChannelV2"
    ).and.returnValue(false);
    const expected: IHubChannel = {
      id: "31c",
      name: "My channel",
      createdDate: new Date(1741102219664),
      createdDateSource: "channel.createdAt",
      updatedDate: new Date(1741102220000),
      updatedDateSource: "channel.updatedAt",
      type: "Channel",
      source: "creator123",
      links: {
        thumbnail: null,
        self: null,
        siteRelative: null,
        siteRelativeEntityType: null,
        workspaceRelative: null,
        layoutRelative: null,
      },
      blockWords: ["baad"],
      permissions: [entityPermissionPolicy],
      allowAsAnonymous: true,
      canEdit: true,
      canDelete: false,
      orgId: "orgId123",
      owner: "creator123",
      typeKeywords: [],
      tags: [],
      access: "private",
      channel,
      thumbnail: undefined,
      view: undefined,
      description: undefined,
      location: undefined,
    };
    const result = transformChannelToEntity(channel, user);
    expect(result).toEqual(expected);
    expect(
      transformAclPermissionToEntityPermissionPolicySpy
    ).toHaveBeenCalledTimes(1);
    expect(
      transformAclPermissionToEntityPermissionPolicySpy
    ).toHaveBeenCalledWith(channel.channelAcl[0]);
    expect(canEditChannelV2Spy).toHaveBeenCalledTimes(1);
    expect(canEditChannelV2Spy).toHaveBeenCalledWith(channel, user, channel);
    expect(canDeleteChannelV2Spy).toHaveBeenCalledTimes(1);
    expect(canDeleteChannelV2Spy).toHaveBeenCalledWith(channel, user);
  });
});
