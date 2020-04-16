/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItemAdd, IItem } from "@esri/arcgis-rest-types";

/**
 * Generic Model, used with all items that have a json
 * `/data` payload
 *
 * @export
 * @interface IModel
 */
export interface IModel {
  item: IItem;
  data?: {
    [propName: string]: any;
  };
}

/**
 * Defined the Initiative Item as having
 * `type: "Hub Initiative"`
 *
 * @export
 * @interface IInitiativeItem
 * @extends {IItemAdd}
 */
export interface IInitiativeItem extends IItem {
  id: string;
  type: "Hub Initiative";
}

/**
 * Initiative Model
 *
 * @export
 * @interface IInitiativeModel
 * @extends {IModel}
 */
export interface IInitiativeModel extends IModel {
  item: IInitiativeItem;
  data?: {
    [propName: string]: any;
  };
}
