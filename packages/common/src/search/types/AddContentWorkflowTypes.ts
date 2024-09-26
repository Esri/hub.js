import { IGroupsByMembership } from "./IGroupsByMembership";
import { EntityType, IQuery } from "./IHubCatalog";

/**
 * `AddContentWorkflow` is a string literal type that
 * defines the possible "Add Content" workflows
 */
export type AddContentWorkflow = "create" | "upload" | "existing";

/**
 * `IAddContentWorkflowConfig` is an interface that defines the
 * configuration for the "Add Content" workflows
 */
export interface IAddContentWorkflowConfig {
  create?: IAddContentCreateWorkflowConfig;
  upload?: IAddContentUploadWorkflowConfig;
  existing?: IAddContentExistingWorkflowConfig;
  state: "enabled" | "disabled";
  reason?:
    | "no-permission"
    | "not-in-groups"
    | "invalid-object"
    | "too-many-groups"
    | "unsupported-target-entity";
  // FUTURE we can add the checks
}

export type AddContentWorkflowConfig =
  | IAddContentCreateWorkflowConfig
  | IAddContentExistingWorkflowConfig
  | IAddContentUploadWorkflowConfig;

interface IAddContentWorkflowBaseConfig {
  targetEntity: EntityType;
  workflow: AddContentWorkflow;
  types: string[];
  // If groups are not passed in then the user can choose any group they are a member of
  groups?: IGroupsByMembership;
}
export interface IAddContentCreateWorkflowConfig
  extends IAddContentWorkflowBaseConfig {
  workflow: "create";
}

export interface IAddContentExistingWorkflowConfig
  extends IAddContentWorkflowBaseConfig {
  workflow: "existing";
  query: IQuery;
}

export interface IAddContentUploadWorkflowConfig
  extends IAddContentWorkflowBaseConfig {
  workflow: "upload";
}
