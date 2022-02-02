import { IHubEntityBase } from "./IHubEntityBase";

export interface IHubEvent extends IHubEntityBase {
  location: string;
  startDate: Date;
  readonly owner: string;
}
