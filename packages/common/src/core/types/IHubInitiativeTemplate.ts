import { IHubItemEntity } from "./IHubItemEntity";
import {
  IWithLayout,
  IWithPermissions,
  IWithSlug,
  IWithCatalog,
} from "../traits";
import { IWithMetrics } from "../traits/IWithMetrics";

/** Defines the properties of a Hub Initiative Template object */
export interface IHubInitiativeTemplate
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithLayout,
    IWithMetrics,
    IWithPermissions {
  previewUrl: string;
  recommendedTemplates: string[];
  siteSolutionId: string;
}

/**
 * This type redefines the IHubInitiativeTemplate interface in such a way
 * that it can be consumed by the entity editor.
 */
export type IHubInitiativeTemplateEditor = Omit<
  IHubInitiativeTemplate,
  "extent"
> & {
  /**
   * Thumbnail image. This is only used on the Editor and is
   * persisted in the fromEditor method on the Class.
   */
  _thumbnail?: any;
};
