/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export * from "./domains";
export * from "./drafts";
export * from "./layout";
export * from "./pages";

export * from "./get-domain";
export * from "./_remove-site-groups";
export * from "./_remove-parent-initiative";
export * from "./_remove-site-from-index";
export * from "./_remove-site-domains";
export * from "./_get-portal-domain-type-keyword";
export * from "./_ensure-optional-groups-templating";
export * from "./_ensure-type-and-tags";
export * from "./get-site-item-type";
export * from "./_ensure-portal-domain-keyword";
export * from "./get-site-edit-url";
export * from "./update-site-application-uris";
export * from "./update-app-redirect-uris";
export * from "./unlink-site-and-page";
export * from "./link-site-and-page";
export * from "./unlink-pages-from-site";
export * from "./get-site-dependencies";
export * from "./ensure-optional-groups-templating";
export * from "./remove-site";
export * from "./ensure-required-site-properties";
export * from "./update-site";
export * from "./create-site";
export * from "./get-portal-site-url";
export * from "./get-portal-site-hostname";
export * from "./_create-site-initiative";
export * from "./_update-team-tags";
export * from "./create-site-model-from-template";
export * from "./convert-site-to-template";
export * from "./_get-site-data-by-id";
export * from "./_get-second-pass-sharing-options";
export * from "./share-items-to-site-groups";
export * from "./_second-pass-adlib-pages";
export * from "./_update-pages";
export * from "./site-second-pass";
export * from "./get-data-for-site-item";
export * from "./is-site";
export * from "./is-site-type";
export * from "./get-members";
export * from "./interpolate-site";

// Re-exports to avoid breaking changes
export {
  /* istanbul ignore next */
  upgradeSiteSchema,
  /* istanbul ignore next */
  getSiteById,
  /* istanbul ignore next */
  IHubSiteTheme,
  /* istanbul ignore next */
  DEFAULT_THEME,
} from "@esri/hub-common";
