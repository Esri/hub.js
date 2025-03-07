import { IEntityPermissionPolicy } from "../../permissions/types/IEntityPermissionPolicy";
import { HubEntityType } from "./HubEntityType";
import { IHubEntityBase } from "./IHubEntityBase";
import { AccessLevel } from "./types";

export interface IHubChannel extends IHubEntityBase {
  blockWords: string[];
  permissions: IEntityPermissionPolicy[];
  allowAsAnonymous: boolean;
  canEdit: boolean;
  canDelete: boolean;
  orgId: string;
  owner: string;

  // these don't apply to channels, yet they have to be defined else build errors are raised in:
  //   - breakAssociation.ts
  //   - requestAssociation.ts
  //   - ContentUiSchemaSettings.ts
  //   - TemplateUiSchemaEdit.ts
  // the above are implemented in such a way that they assume every HubEntity has the below members...
  // they should depend on abstractions, i.e. interfaces, rather than concrete objects...
  typeKeywords: string[];
  access: AccessLevel;
  thumbnail?: string;
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
  ownerConfig: IHubRoleConfigValue;
  allowAsAnonymous: boolean;
}
