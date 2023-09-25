import { IHubItemEntity } from "./IHubItemEntity";
import {
  IWithLayout,
  IWithPermissions,
  IWithSlug,
  IWithCatalog,
} from "../traits";
import { IHubItemEntityEditor } from "./IHubItemEntity";
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
export type IHubInitiativeTemplateEditor =
  IHubItemEntityEditor<IHubInitiativeTemplate> & {};
