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
  /** unique identifier */
  key: string;
  /** embed height */
  height?: number;
}

/** app-specific embeds */
export interface IHubEmbedApp extends IHubEmbedBase {
  kind: EmbedKind.app;
  id: string;
  isScrollable?: boolean;
  viewportMobile?: IHubEmbedAppViewportMobile;
  viewportTablet?: IHubEmbedAppViewportTablet;
  viewportDesktop?: IHubEmbedAppViewportDesktop;
}
type IHubEmbedAppViewportMobile = Omit<
  IHubEmbedApp,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
type IHubEmbedAppViewportTablet = Omit<
  IHubEmbedApp,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
type IHubEmbedAppViewportDesktop = Omit<
  IHubEmbedApp,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;

/** map-specific embeds */
export interface IHubEmbedMap extends IHubEmbedBase {
  kind: EmbedKind.map;
  /** web map/scene id */
  id: string;
  viewportMobile?: IHubEmbedMapViewportMobile;
  viewportTablet?: IHubEmbedMapViewportTablet;
  viewportDesktop?: IHubEmbedMapViewportDesktop;
}
type IHubEmbedMapViewportMobile = Omit<
  IHubEmbedMap,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
type IHubEmbedMapViewportTablet = Omit<
  IHubEmbedMap,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
type IHubEmbedMapViewportDesktop = Omit<
  IHubEmbedMap,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;

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
