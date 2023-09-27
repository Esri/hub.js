import { IHubItemEntity } from "./IHubItemEntity";
import { IWithLayout, IWithSlug, IWithCatalog } from "../traits";
import { IHubItemEntityEditor } from "./IHubItemEntity";

/** Defines the properties of a Hub Initiative Template object */
export interface IHubInitiativeTemplate
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithLayout {
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
