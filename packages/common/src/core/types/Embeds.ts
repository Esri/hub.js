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
  kind?: EmbedKind.app;
  id?: string;
  isScrollable?: boolean;
  viewportMobile?: IHubEmbedAppViewportMobile;
  viewportTablet?: IHubEmbedAppViewportTablet;
  viewportDesktop?: IHubEmbedAppViewportDesktop;
}
export type IHubEmbedAppViewportMobile = Omit<
  IHubEmbedApp,
  "key" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
export type IHubEmbedAppViewportTablet = Omit<
  IHubEmbedApp,
  "key" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
export type IHubEmbedAppViewportDesktop = Omit<
  IHubEmbedApp,
  "key" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;

/** map-specific embeds */
export interface IHubEmbedMap extends IHubEmbedBase {
  kind?: EmbedKind.map;
  /** web map/scene id */
  id?: string;
  viewportMobile?: IHubEmbedMapViewportMobile;
  viewportTablet?: IHubEmbedMapViewportTablet;
  viewportDesktop?: IHubEmbedMapViewportDesktop;
}
export type IHubEmbedMapViewportMobile = Omit<
  IHubEmbedMap,
  "key" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
export type IHubEmbedMapViewportTablet = Omit<
  IHubEmbedMap,
  "key" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
export type IHubEmbedMapViewportDesktop = Omit<
  IHubEmbedMap,
  "key" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;

/** external embed */
export interface IHubEmbedExternal extends IHubEmbedBase {
  kind?: EmbedKind.external;
  /** embed url */
  url?: string;
  viewportMobile?: IHubEmbedExternalViewportMobile;
  viewportTablet?: IHubEmbedExternalViewportTablet;
  viewportDesktop?: IHubEmbedExternalViewportDesktop;
}
export type IHubEmbedExternalViewportMobile = Omit<
  IHubEmbedExternal,
  "key" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
export type IHubEmbedExternalViewportTablet = Omit<
  IHubEmbedExternal,
  "key" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
export type IHubEmbedExternalViewportDesktop = Omit<
  IHubEmbedExternal,
  "key" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;

/** survey-specific embeds */
export interface IHubEmbedSurvey extends IHubEmbedBase {
  kind?: EmbedKind.feedback;
  /** survey123 id */
  id?: string;
  viewportMobile?: IHubEmbedSurveyViewportMobile;
  viewportTablet?: IHubEmbedSurveyViewportTablet;
  viewportDesktop?: IHubEmbedSurveyViewportDesktop;
}
export type IHubEmbedSurveyViewportMobile = Omit<
  IHubEmbedSurvey,
  "key" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
export type IHubEmbedSurveyViewportTablet = Omit<
  IHubEmbedSurvey,
  "key" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
export type IHubEmbedSurveyViewportDesktop = Omit<
  IHubEmbedSurvey,
  "key" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
>;
