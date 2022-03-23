import { IExtent } from "@esri/arcgis-rest-feature-layer";
import { IWithSlug } from "..";
import { IWithLayout } from "../traits/WithLayout";
import { IHubItemEntity } from "./IHubItemEntity";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubSite extends IHubItemEntity, IWithSlug, IWithLayout {
  /**
   * Array of minimal page objects
   */
  pages: Array<{ title: string; id: string; slug: string }>;
  /**
   * Site Theme as json
   */
  theme: Record<string, any>;
  // TODO: Type this based on the actual site capabilities
  /**
   * Array of capabilities enabled for the site
   */
  capabilities: string[];
  /**
   * Currently not an actual ICatalog
   */
  catalog: {
    groups: string[];
    [key: string]: any;
  };
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
}
