import { IPortal } from "@esri/arcgis-rest-portal";
import { IHubEntityBase } from "./IHubEntityBase";
import { AccessLevel } from "./types";
import { IWithViewSettings } from "../traits/IWithViewSettings";
import { IHubLocation } from "./IHubLocation";

/**
 * read-only interface for a subset of the IPortal object
 * This is not meant to be a complete representation of the
 * IPortal object, but rather a subset of properties that
 * are useful for display in the arcgu-hub-entity-card
 */
export interface IHubOrganization extends IHubEntityBase {
  /**
   * Access level of the org - only public or private
   */
  access: AccessLevel;
  /**
   * Access to the whole Portal object
   */
  portal: IPortal;
  /**
   * URL to the thumbnail image
   */
  thumbnailUrl?: string;
  /**
   * URL to the org
   */
  url: string;
  /**
   * ID of the org, same as the id property
   */
  orgId?: string;
  /**
   * thumbnail image w/o URL
   */
  thumbnail?: string;
  /**
   * description of the org
   */
  description?: string;
  // PROPS THAT ARE NEEDED TO BE A HUBENTITY BUT DON'T APPLY TO A PORTAL
  /**
   * owner. Always null for an org
   */
  owner?: string;
  /**
   * typeKeywords. Always empty for an org
   */
  typeKeywords: string[];
  /**
   * tags. Always empty for an org
   */
  tags: string[];
  /**
   * view settings - always null for an org
   */
  view?: IWithViewSettings;
  /**
   * location - always null for an org
   */
  location?: IHubLocation;
}
