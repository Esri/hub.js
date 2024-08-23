/** enum to discriminate between embed union members */
export enum EmbedKind {
  app = "app",
  map = "map",
  feedback = "feedback",
  external = "external",
}

/** Interface to represent a Hub embed */
export interface IHubEmbed {
  /** unique identifier */
  key: string;
  /** settings applied to all screen sizes -- only applies when specific viewport sizes are not set */
  viewportAll?: HubEmbed;
  /** settings applied to screens 360px wide and above */
  viewportMobile?: HubEmbed;
  /** settings applied to screens 560px wide and above */
  viewportTablet?: HubEmbed;
  /** settings applied to screens 980px wide and above */
  viewportDesktop?: HubEmbed;
}

/**
 * Type to represent a Hub embed. This is a discrminated
 * union between app, map, survey, external, etc. embeds.
 */
export type HubEmbed =
  | IHubEmbedApp
  | IHubEmbedMap
  | IHubEmbedSurvey
  | IHubEmbedExternal;

/** app-specific embed */
export interface IHubEmbedApp {
  kind: EmbedKind.app;
  /** application id */
  id: string;
  /** embed height */
  height?: number;
  /** whether the embed can scroll or not */
  isScrollable?: boolean;
}

/** map-specific embed */
export interface IHubEmbedMap {
  kind: EmbedKind.map;
  /** web map/scene id */
  id: string;
  /** embed height */
  height?: number;
}

/** external embed */
export interface IHubEmbedExternal {
  kind: EmbedKind.external;
  /** embed url */
  url: string;
  /** embed height */
  height?: number;
}

/** survey-specific embed */
export interface IHubEmbedSurvey {
  kind: EmbedKind.feedback;
  /** survey123 id */
  id: string;
  /** embed height */
  height?: number;
}
