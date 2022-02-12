import { IWithLayout } from "../traits/WithLayout";
import { IHubItemEntity } from "./IHubItemEntity";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubSite extends IHubItemEntity, IWithLayout {
  header: Record<string, any>;
  footer: Record<string, any>;
  pages: Record<string, any>;
}
