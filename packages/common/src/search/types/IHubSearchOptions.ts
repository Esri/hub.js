import { UserSession } from "@esri/arcgis-rest-auth";
import { IModel } from "../..";
import { NamedApis, IApiDefinition } from "./types";

/**
 * Requestable Enrichments
 */
export type Enrichments = "data" | "metadata" | "org" | "service" | "layers";

/**
 * Search Options
 */
export interface IHubSearchOptions {
  aggFields?: string[];
  aggLimit?: number;
  api?: NamedApis | IApiDefinition;
  authentication?: UserSession;
  bbox?: string;
  enrichments?: Enrichments[];
  fields?: string;
  num?: number;
  page?: string;
  sortField?: string;
  sortOrder?: "desc" | "asc";
  start?: number;
  // DEPRECATION
  aggregations?: string[];
  site?: IModel;
}
