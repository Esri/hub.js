import { IHubItemEntity } from "./IHubItemEntity";
import { IWithLayout } from "../traits/IWithLayout";
import { IWithSlug } from "../traits/IWithSlug";
import { IWithCatalog } from "../traits/IWithCatalog";
import { IWithViewSettings } from "../traits/IWithViewSettings";
import { IHubItemEntityEditor } from "./IHubItemEntity";

/** Defines the properties of a Hub Initiative Template object */
export interface IHubInitiativeTemplate
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithLayout,
    IWithViewSettings {
  previewUrl: string;
  recommendedTemplates: string[];
  siteSolutionId: string;
}

/**
 * This type redefines the IHubInitiativeTemplate interface in such a way
 * that it can be consumed by the entity editor.
 */
export type IHubInitiativeTemplateEditor =
  IHubItemEntityEditor<IHubInitiativeTemplate>;
