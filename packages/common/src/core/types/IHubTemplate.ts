import { IWithSlug } from "../traits";
import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

/** Defines the properties of a Hub Template entity */
export interface IHubTemplate extends IHubItemEntity, IWithSlug {
  previewUrl: string;
  isDeployed: boolean;
  deployedType: string;
}

/**
 * This type redefines the IHubTemplate interface in such a way
 * that it can be consumed by the entity editor.
 */
export type IHubTemplateEditor = IHubItemEntityEditor<IHubTemplate> & {};
