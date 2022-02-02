import { IWithLayout } from "../traits/WithLayout";
import { IHubEntityItemBase } from "./IHubEntityItemBase";

export interface IHubSite extends IHubEntityItemBase, IWithLayout {
  header: Record<string, any>;
  footer: Record<string, any>;
}
