import { IHubChannel } from "../../core/types/IHubChannel";
import {
  canEditChannelV2,
  canDeleteChannelV2,
} from "../../discussions/api/utils/channels";
import { IChannel } from "../../discussions/api/types";
import { IUser } from "@esri/arcgis-rest-types";
import { transformAclPermissionToEntityPermissionPolicy } from "./transformAclPermissionToEntityPermissionPolicy";

/**
 * @private
 * Transforms a given IChannel object to an IHubChannel object
 * @param channel An IChannel object
 * @param user The currently authenticated user
 * @returns an IHubChannel object
 */
export function transformChannelToEntity(
  channel: IChannel,
  user: IUser
): IHubChannel {
  return {
    id: channel.id,
    name: channel.name,
    createdDate: new Date(channel.createdAt),
    createdDateSource: "channel.createdAt",
    updatedDate: new Date(channel.updatedAt),
    updatedDateSource: "channel.updatedAt",
    type: "Channel",
    source: channel.creator,
    links: {
      thumbnail: null,
      self: null,
      siteRelative: null,
      siteRelativeEntityType: null,
      workspaceRelative: null,
      layoutRelative: null,
    },
    blockWords: channel.blockWords,
    permissions: channel.channelAcl.map((channelAclPermission) =>
      transformAclPermissionToEntityPermissionPolicy(channelAclPermission)
    ),
    allowAsAnonymous: channel.allowAsAnonymous,
    // TODO: verify w/ Jeremy if the 3rd param is right...
    canEdit: canEditChannelV2(channel, user, channel),
    canDelete: canDeleteChannelV2(channel, user),
    orgId: channel.orgId,
    owner: channel.creator,

    typeKeywords: [],
    access: "private",
  };
}
