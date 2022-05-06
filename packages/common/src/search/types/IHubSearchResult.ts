import { HubFamily, IHubGeography } from "../..";
import { AccessLevel, IHubEntityBase } from "../../core";

/**
 * Standardized light-weight search result structure, applicable to all
 * types of search results - users, groups, content, events etc
 */
export interface IHubSearchResult extends IHubEntityBase {
  /**
   * Access level of the backing entity
   */
  access: AccessLevel;

  /**
   * Hub Family
   */
  family: HubFamily;

  /**
   * Owner; Applies to Items and Groups
   */
  owner: string;

  /**
   * Fully qualified thumbnail url for items, groups, users
   * Will not have the token appended. Consuming app needs to
   * check the value of `access` and apply the token as needed
   */
  thumbnailUrl: string;
  /**
   * Hash of pre-computed urls
   */
  urls: {
    /**
     * Canononical ArcGIS Online Url for this entity (if applicable)
     */
    portalHome?: string;
    /**
     * Relative url, which can be appended to a Site's root Url
     * e.g. /datasets/3ef8c7a, or /events/june-meeting
     * This is much easier than passing a Site into the search
     * system so the full url can be computed
     */
    relative: string;

    /**
     * Allow for arbitrary other urls, including `.customUrl` which
     * can ben generated client-side in the gallery via a callback
     */
    [key: string]: string;
  };

  /**
   * Geometry connected to this entity
   * For items, it will default to the extent,
   * but may be derived from a boundary resource
   * or the extent of a layer
   */
  geometry?: IHubGeography;
  /**
   * Generic hash of type-specific properties
   * that will be shown in the results card
   */
  metadata?: IMetadataElement[];
}

/**
 * Entry in the metadata hash
 */
export interface IMetadataElement {
  /**
   * Key that maps to the source of the information
   * i.e. `data.values.status`
   */
  key: string;
  /**
   * Value of the field
   */
  value: number | string | Date;
  /**
   * Optional Label that will be displayed in the UI
   * If not provided, the UI will attempt to use the
   * key to look up a translated string. If not found
   * the key will be displayed.
   * This also supports future customization of meta information
   * allowing customers to specify a label
   */
  label?: string;
  /**
   * Optional formatting information. This is a placeholder
   * that will allow future customization of how values
   * are displayed via the Intl formatting functions for
   * currencies, dates etc. If not provided, the UI layer
   * will apply default localization based on the value type
   * string: display value as-is
   * number: default localization via `Intl.NumberFormat()`
   * Date: default localization via `Intl.DateTimeFormat()`
   */
  format?: Record<string, any>;
}
