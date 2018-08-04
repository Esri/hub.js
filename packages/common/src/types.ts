/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem } from "@esri/arcgis-rest-common-types";

/**
 * One small step for Hub, one large leap for hubkind
 */
export interface IInitiative {
  item: IInitiativeItem;
  data?: {
    [propName: string]: any;
  };
}

export interface IInitiativeItem extends IItem {
  type: "Hub Initiative";
}
