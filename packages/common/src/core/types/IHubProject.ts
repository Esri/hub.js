import { IWithMetrics } from "../traits/IWithMetrics";
import {
  IWithLayout,
  IWithPermissions,
  IWithSlug,
  IWithCatalog,
} from "../traits/index";
import { IHubItemEntity } from "./IHubItemEntity";
import { IExtent } from "@esri/arcgis-rest-feature-layer";

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithLayout,
    IWithMetrics,
    IWithPermissions {
  status: PROJECT_STATUSES;
}

export enum PROJECT_STATUSES {
  notStarted = "notStarted",
  inProgress = "inProgress",
  onHold = "onHold",
  complete = "complete",
}

/**
 * This type redefines the IHubProject interface in such a way
 * that it can be consumed by the entity editor.
 */
export type IHubProjectEditor = Omit<IHubProject, "extent"> & {
  extent: IExtent | number[][];
  // TODO: if this is an ephemeral property, we should prefix with _
  groups: string[];
  view: {
    featuredImage?: any;
  };
};
