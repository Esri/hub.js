import { IWithLayout } from "../traits/WithLayout";
import { IHubEntityItemBase } from "./IHubEntityItemBase";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubSite extends IHubEntityItemBase, IWithLayout {
  header: Record<string, any>;
  footer: Record<string, any>;
}
