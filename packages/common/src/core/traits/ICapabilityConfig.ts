import { IHubCatalog } from "../../search/types/IHubCatalog";

export type HubCapability =
  | "events"
  | "content"
  | "projects"
  | "initiatives"
  | "discussions"
  | "pages";

/**
 * Configuration for a capability
 * Typically extended by other interfaces
 */
export interface ICapabilityConfig {
  enabled: boolean;
  catalog: IHubCatalog;
}
/**
 * We intentionally want these interfaces to exist even if they are empty
 * as they are used to determine if a capability can be enabled
 */
/* tslint:disable: no-empty-interface */
export interface IEventsConfig extends ICapabilityConfig {}
export interface IProjectsConfig extends ICapabilityConfig {}
export interface IInitiativesConfig extends ICapabilityConfig {}
export interface IDiscussionsConfig extends ICapabilityConfig {}
export interface IPagesConfig extends ICapabilityConfig {}
/* tslint:enable: no-empty-interface */
export interface IContentConfig extends ICapabilityConfig {
  feeds: any; // TODO: lookup the type as this is defined somewhere
}

export interface IWithEvents {
  events?: IEventsConfig;
}

export interface IWithProjects {
  projects?: IProjectsConfig;
}

export interface IWithInitiatives {
  initiatives?: IInitiativesConfig;
}

export interface IWithPages {
  pages?: IPagesConfig;
}

export interface IWithContent {
  content?: IContentConfig;
}
