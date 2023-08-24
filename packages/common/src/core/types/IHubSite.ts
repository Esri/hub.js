import { IExtent } from "@esri/arcgis-rest-feature-layer";
import { IWithVersioningBehavior } from "../behaviors";
import {
  IWithCatalog,
  IWithLayout,
  IWithPermissions,
  IWithSlug,
} from "../traits/index";
import { IHubItemEntity } from "./IHubItemEntity";
import { IWithFollowers } from "../traits/IWithFollowers";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubSite
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithLayout,
    IWithPermissions,
    IWithVersioningBehavior,
    IWithFollowers {
  /**
   * Array of minimal page objects
   */
  pages: Array<{ title: string; id: string; slug: string }>;
  /**
   * Site Theme as json
   */
  theme: Record<string, any>;

  /**
   * Subdomain of the site
   * Will be prepended to `<org-key>.hub.arcgis.com`
   */
  subdomain: string;
  /**
   * Full hostname
   * Looks like`<subdomain>-<org-key>.hub.arcgis.com`
   */
  defaultHostname: string;
  /**
   * Custom Domain Name
   */
  customHostname: string;
  /**
   * oAuth Client Id for the Site
   */
  clientId: string;
  /**
   * Feed configurations
   */
  feeds: Record<string, any>;
  /**
   * Default extent used when loading maps on the site
   */
  defaultExtent: IExtent;
  /**
   * Default map configuration for the site
   */
  map: Record<string, any>;
  /**
   * Content Views settings
   */
  contentViews: Record<string, any>;
  /**
   * Site Telemetry Settings
   */
  telemetry: Record<string, any>;
  /**
   * Header CSS
   */
  headerSass: string;

  /**
   * Legacy capabilities
   * @internal
   */
  legacyCapabilities: string[];
}

export type IHubSiteEditor = Omit<IHubSite, "extent"> & {
  /**
   * Thumbnail image. This is only used on the Editor and is
   * persisted in the fromEditor method on the Class
   */
  _thumbnail?: any;
};
