import { UserSession } from "@esri/arcgis-rest-auth";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IUser } from "@esri/arcgis-rest-types";
import { IUserResourceToken } from "./IUserResourceToken";
import { HubServiceStatus } from "./core";
import { IFeatureFlags } from "./permissions";
import { IHubTrustedOrgsResponse } from "./types";
import { IUserHubSettings } from "./utils/IUserHubSettings";

/**
 * Options for the ArcGISContext constructor
 */

export interface IArcGISContextOptions {
  /**
   * Unique id from the ArcGISContextManager that created
   * this instance. Primarily useful for debugging possible
   * race-conditions that can result in multiple ArcGISContextManager
   * instances being created.
   */
  id: number;
  /**
   * Portal base url
   * For ArcGIS Online - https://org.env.arcgis.com
   * For ArcGIS Enterprise - https://{portalHostname}/{webadaptor}
   */
  portalUrl: string;
  /**
   * Hub Url that corresponds to the portal url is appropritate
   */
  hubUrl?: string;
  /**
   * The current UserSession
   */
  authentication?: UserSession;
  /**
   * If the user is authenticated, the portal should be passed in
   * so various getters can work as expected.
   *
   * ArcGISContextManager handles this internally
   */
  portalSelf?: IPortal;

  /**
   * If the user is authenticated, the user should be passed in
   * so various getters can work as expected.
   *
   * ArcGISContextManager handles this internally
   */
  currentUser?: IUser;

  /**
   * Optional hash of additional context
   */
  properties?: Record<string, any>;

  /**
   * Option to pass in service status vs fetching it
   */
  serviceStatus?: HubServiceStatus;

  /**
   * Hash of feature flags
   */
  featureFlags?: IFeatureFlags;

  /**
   * Array of Trusted Org Ids
   */
  trustedOrgIds?: string[];

  /**
   * Trusted orgs xhr response
   */
  trustedOrgs?: IHubTrustedOrgsResponse[];

  /**
   * Array of exchanged tokens for use
   * with user-app-resources
   */
  userResourceTokens?: IUserResourceToken[];

  /**
   * Hash of user hub settings. These are stored as
   * user-app-resources, associated with the `hubforarcgis` clientId
   */
  userHubSettings?: IUserHubSettings;
}
