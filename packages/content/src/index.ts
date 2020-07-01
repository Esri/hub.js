/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IModel } from "@esri/hub-common";

/**
 * Content Model
 * Temporary here to make discussion easier
 * See README.md for outline of full content model
 *
 * @export
 * @interface IContentModel
 * @extends {IModel}
 */
export interface IContentModel extends IModel {
  id: string; 
  type: string; // Content type [dataset, map, document, app]
  owner: { username: string };
  title: string;
  summary: string;
  description: string;

  metadata?: any;
}


export * from "./get";
