import { IExtent } from "@esri/arcgis-rest-feature-layer";
import { IWithVersioningBehavior } from "../behaviors";
import {
  IWithCatalog,
  IWithCatalogs,
  IWithLayout,
  IWithPermissions,
  IWithSlug,
} from "../traits/index";
import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubSite
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog, // DEPRECATED: Use IWithCatalogs instead
    IWithCatalogs,
    IWithLayout,
    IWithPermissions,
    IWithVersioningBehavior {
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

  /** Legacy teams - list of ids */
  legacyTeams: string[];

  /**
   * True when the site is a "Hub Home" site
   */
  isHubHome: boolean;
}

export type IHubSiteEditor = IHubItemEntityEditor<IHubSite> & {
  _discussions?: boolean;
};
