import { IHubEntityBase } from "./IHubEntityBase";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubEvent extends IHubEntityBase {
  location: string;
  startDate: Date;
  readonly owner: string;
}
