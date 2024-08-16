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
  viewportMobile?:
    | HubEmbedAppViewportMobile
    | HubEmbedMapViewportMobile
    | HubEmbedExternalViewportMobile
    | HubEmbedSurveyViewportMobile;
  viewportTablet?:
    | HubEmbedAppViewportTablet
    | HubEmbedMapViewportTablet
    | HubEmbedExternalViewportTablet
    | HubEmbedSurveyViewportTablet;
  viewportDesktop?:
    | HubEmbedAppViewportDesktop
    | HubEmbedMapViewportDesktop
    | HubEmbedExternalViewportDesktop
    | HubEmbedSurveyViewportDesktop;
}

/** app-specific embeds */
export interface IHubEmbedApp extends IHubEmbedBase {
  kind?: EmbedKind.app;
  id?: string;
  isScrollable?: boolean;
}
export type HubEmbedAppViewportMobile = Omit<
  IHubEmbedApp,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
> & { kind: EmbedKind.app };
export type HubEmbedAppViewportTablet = Omit<
  IHubEmbedApp,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
> & { kind: EmbedKind.app };
export type HubEmbedAppViewportDesktop = Omit<
  IHubEmbedApp,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
> & { kind: EmbedKind.app };

/** map-specific embeds */
export interface IHubEmbedMap extends IHubEmbedBase {
  kind?: EmbedKind.map;
  /** web map/scene id */
  id?: string;
}
export type HubEmbedMapViewportMobile = Omit<
  IHubEmbedMap,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
> & { kind: EmbedKind.map };
export type HubEmbedMapViewportTablet = Omit<
  IHubEmbedMap,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
> & { kind: EmbedKind.map };
export type HubEmbedMapViewportDesktop = Omit<
  IHubEmbedMap,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
> & { kind: EmbedKind.map };

/** external embed */
export interface IHubEmbedExternal extends IHubEmbedBase {
  kind?: EmbedKind.external;
  /** embed url */
  url?: string;
}
export type HubEmbedExternalViewportMobile = Omit<
  IHubEmbedExternal,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
> & { kind: EmbedKind.external };
export type HubEmbedExternalViewportTablet = Omit<
  IHubEmbedExternal,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
> & { kind: EmbedKind.external };
export type HubEmbedExternalViewportDesktop = Omit<
  IHubEmbedExternal,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
> & { kind: EmbedKind.external };

/** survey-specific embeds */
export interface IHubEmbedSurvey extends IHubEmbedBase {
  kind?: EmbedKind.feedback;
  /** survey123 id */
  id?: string;
}
export type HubEmbedSurveyViewportMobile = Omit<
  IHubEmbedSurvey,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
> & { kind: EmbedKind.feedback };
export type HubEmbedSurveyViewportTablet = Omit<
  IHubEmbedSurvey,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
> & { kind: EmbedKind.feedback };
export type HubEmbedSurveyViewportDesktop = Omit<
  IHubEmbedSurvey,
  "key" | "kind" | "viewportMobile" | "viewportTablet" | "viewportDesktop"
> & { kind: EmbedKind.feedback };
