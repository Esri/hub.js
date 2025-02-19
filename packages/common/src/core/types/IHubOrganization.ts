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
  access: AccessLevel;
  portal: IPortal;
  thumbnailUrl?: string;
  url: string;
  orgId?: string;
  thumbnail?: string;
  description?: string;
  // PROPS THAT ARE NEEDED TO BE A HUBENTITY BUT DON'T APPLY TO A PORTAL
  owner?: string;
  typeKeywords: string[];
  tags: string[];
  view?: IWithViewSettings;
  location?: IHubLocation;
}
