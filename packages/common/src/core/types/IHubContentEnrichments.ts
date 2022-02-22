import { IHubGeography } from "../../types";

import { IItemEnrichments } from "./IItemEnrichments";
import { IServerEnrichments } from "./IServerEnrichments";

export interface IHubContentEnrichments
  extends IItemEnrichments,
    IServerEnrichments {
  /**
   * boundary will default to the item extent
   * but can be overwritten by enrichments from the Hub API (inline)
   * or fetched from a location such as /resources/boundary.json
   */
  boundary?: IHubGeography;

  // TODO: a better type than any
  /**
   *
   */
  statistics?: any;
}
