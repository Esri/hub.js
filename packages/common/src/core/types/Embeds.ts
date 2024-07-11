/**
 * Type to represent a Hub embed. This is a discrminated
 * union between app, map, survey, external, etc. embeds.
 */
export type HubEmbed =
  | IHubEmbedApp
  | IHubEmbedMap
  | IHubEmbedSurvey
  | IHubEmbedExternal;

/** enum to discriminate between embed union members */
export enum EmbedKind {
  app = "app",
  map = "map",
  feedback = "feedback",
  external = "external",
}

/** base embed */
interface IHubEmbedBase {
  /** embed height */
  height?: number;
}

/** app-specific embed */
export interface IHubEmbedApp extends IHubEmbedBase {
  kind: EmbedKind.app;
  /** application id */
  id: string;
}

/** map-specific embed */
export interface IHubEmbedMap extends IHubEmbedBase {
  kind: EmbedKind.map;
  /** web map/scene id */
  id: string;
}

/** external embed */
export interface IHubEmbedExternal extends IHubEmbedBase {
  kind: EmbedKind.external;
  /** embed url */
  url: string;
}

/** survey-specific embed */
export interface IHubEmbedSurvey extends IHubEmbedBase {
  kind: EmbedKind.feedback;
  /** survey123 id */
  id: string;
}
