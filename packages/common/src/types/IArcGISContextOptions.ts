import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import type { IPortal, IPortalSettings } from "@esri/arcgis-rest-portal";
import type { IUser } from "@esri/arcgis-rest-portal";
import type { IUserResourceToken } from "./IUserResourceToken";
import type { HubServiceStatus } from "../core/types/ISystemStatus";
import type { IHubTrustedOrgsResponse } from "../hub-types";
import type { IUserHubSettings } from "../utils/IUserHubSettings";
import { IFeatureFlags } from "../permissions/types/IPermissionPolicy";

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
   * The current ArcGISIdentityManager
   */
  authentication?: ArcGISIdentityManager;
  /**
   * If the user is authenticated, the portal should be passed in
   * so various getters can work as expected.
   *
   * ArcGISContextManager handles this internally
   */
  portalSelf?: IPortal;

  /**
   * If the user is authenticated, the portal settings should be passed in
   * so various getters can work as expected.
   *
   * ArcGISContextManager handles this internally
   */
  portalSettings?: IPortalSettings;

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
