import { IWithSlug } from "../traits";
import { IHubItemEntity } from "./IHubItemEntity";

/** Defines the properties of a Hub Template entity */
export interface IHubTemplate extends IHubItemEntity, IWithSlug {
  previewUrl: string;
}
