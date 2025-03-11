import { IChannel } from "../../discussions/api/types";
import { IEntityPermissionPolicy } from "../../permissions/types/IEntityPermissionPolicy";
import { IWithViewSettings } from "../traits/IWithViewSettings";
import { HubEntityType } from "./HubEntityType";
import { IHubEntityBase } from "./IHubEntityBase";
import { IHubLocation } from "./IHubLocation";
import { AccessLevel } from "./types";

/**
 * Defines the properties of a Hub Channel object
 */
export interface IHubChannel extends IHubEntityBase {
  /**
   * An array of blocked words. Posts & replies created/edited containing these words will result in the post status being automatically set to blocked
   */
  blockWords: string[];

  /**
   * An array of IEntityPermissionPolicy representing the configured permissions for the channel
   */
  permissions: IEntityPermissionPolicy[];

  /**
   * True when authenticated users can post pseudo-anonymously, masking their identity
   */
  allowAsAnonymous: boolean;

  /**
   * True when the currently authenticated user can edit the channel
   */
  canEdit: boolean;

  /**
   * True when the currently authenticated user can delete the channel
   */
  canDelete: boolean;

  /**
   * The ID of the organization the channel was created within
   */
  orgId: string;

  /**
   * The owner of the channel
   */
  owner: string;

  /**
   * A reference to the underlying IChannel object
   */
  channel: IChannel;

  /**
   * The access level of the channel
   */
  access: AccessLevel;

  // the following don't apply to channels, yet they have to be defined or builds fail in hub-common:
  //   - packages/common/src/associations/breakAssociation.ts
  //   - packages/common/src/associations/requestAssociation.ts
  //   - packages/common/src/content/_internal/ContentUiSchemaSettings.ts
  //   - packages/common/src/templates/_internal/TemplateUiSchemaEdit.ts
  // the above are implemented in such a way that they assume every HubEntity has the below members...
  // those fns should be refactored to code to abstractions rather than concretions,
  // i.e. trait interfaces that define the properties that the source depends on

  /**
   * Typekeywords applied to the channel
   */
  typeKeywords: string[];

  /**
   * Thumbnail of the channel
   */
  thumbnail?: string;

  // the following don't apply to channels, yet they have to be defined or builds fail in hub-components:
  //   - packages/hub-components/src/utils/cardModelConverters/internal/utils.ts
  //   - packages/hub-components/src/components/arcgis-hub-entity-view/about-components/arcgis-hub-entity-about/arcgis-hub-entity-about.tsx
  //   - packages/hub-components/src/components/arcgis-hub-entity-view/hero-components/arcgis-hub-entity-hero/arcgis-hub-entity-hero.tsx
  // the above components are implemented in such a way that they assume every HubEntity has the below members...
  // those components should be rafactored to code to abstractions rather than concretions,
  // i.e. trait interfaces that define the properties that the source depends on

  /**
   * View settings of the channel
   */
  view?: IWithViewSettings;

  /**
   * Description of the channel
   */
  description?: string;

  /**
   * Tags applied to the channel
   */
  tags: string[];

  /**
   * The location of the channel
   */
  location?: IHubLocation;
}

export interface IHubRoleConfigValue {
  // unique key for this set of roles
  key: string;
  // an optional entity ID, required when `entityType` is provided
  entityId?: string;
  // an optional entity type, required when `entityId` is provided
  entityType?: HubEntityType;
  //
  roles: Record<string, { value: string; id?: string }>;
}

export interface IHubChannelEditor {
  id: string;
  name: string;
  blockWords: string;
  publicConfigs: IHubRoleConfigValue[];
  orgConfigs: IHubRoleConfigValue[];
  groupConfigs: IHubRoleConfigValue[];
  userConfigs: IHubRoleConfigValue[];
  ownerConfigs: IHubRoleConfigValue[];
  allowAsAnonymous: boolean;
}
