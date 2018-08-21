/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItemAdd } from "@esri/arcgis-rest-common-types";

/**
 * Generic Model, will be used for all type-specific api wrappers
 */
export interface IModel {
  item: {
    [propName: string]: any;
  };
  data?: {
    [propName: string]: any;
  };
}

/**
 * One small step for Hub, one large leap for hubkind
 */
export interface IInitiativeModel extends IModel {
  item: IInitiativeItem;
  data?: {
    [propName: string]: any;
  };
}

export interface IInitiativeItem extends IItemAdd {
  id?: string;
  type: "Hub Initiative";
}
