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
    access: channel.access,
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
    channel,

    // these don't apply to channels, yet they have to be defined or builds fail in hub-common:
    //   - packages/common/src/associations/breakAssociation.ts
    //   - packages/common/src/associations/requestAssociation.ts
    //   - packages/common/src/content/_internal/ContentUiSchemaSettings.ts
    //   - packages/common/src/templates/_internal/TemplateUiSchemaEdit.ts
    // the above are implemented in such a way that they assume every HubEntity has the below members...
    // those fns should be refactored to code to abstractions rather than concretions,
    // i.e. trait interfaces that define the properties that the source depends on
    typeKeywords: [],
    thumbnail: undefined,

    // these don't apply to channels, yet they have to be defined or builds fail in hub-components:
    //   - packages/hub-components/src/utils/cardModelConverters/internal/utils.ts
    //   - packages/hub-components/src/components/arcgis-hub-entity-view/about-components/arcgis-hub-entity-about/arcgis-hub-entity-about.tsx
    //   - packages/hub-components/src/components/arcgis-hub-entity-view/hero-components/arcgis-hub-entity-hero/arcgis-hub-entity-hero.tsx
    // the above components are implemented in such a way that they assume every HubEntity has the below members...
    // those components should be rafactored to code to abstractions rather than concretions,
    // i.e. trait interfaces that define the properties that the source depends on
    view: undefined,
    description: undefined,
    location: undefined,
    tags: [],
  };
}
