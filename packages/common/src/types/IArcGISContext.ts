import { UserSession, IUserRequestOptions } from "@esri/arcgis-rest-auth";
import type { IPortal } from "@esri/arcgis-rest-portal";
import type { IRequestOptions } from "@esri/arcgis-rest-request";
import type { IUser } from "../rest/types";
import { HubServiceStatus, HubEntity } from "../core";
import type { IHubHistory, IHubHistoryEntry } from "../core/hubHistory";
import type {
  HubLicense,
  HubEnvironment,
  IFeatureFlags,
  Permission,
  IPermissionAccessResponse,
} from "../permissions";
import type {
  IHubRequestOptions,
  IHubTrustedOrgsResponse,
  UserResourceApp,
} from "../hub-types";
import type { IUserResourceToken } from "./IUserResourceToken";
import type { IUserHubSettings } from "../utils/IUserHubSettings";

/**
 * Defines the properties of the ArcGISContext.
 * Typically components or functions will get an instance
 * of `ArcGISContext` from `ArcGISContetManager`.
 *
 * `ArcGISContext` implements this interface, and uses
 * getters to simplify the derivation of various complex properties.
 *
 */

export interface IArcGISContext {
  /**
   * Unique id from the ArcGISContextManager that created
   * this instance. Primarily useful for debugging possible
   * race-conditions that can result in multiple ArcGISContextManager
   * instances being created.
   */
  id: number;
  /**
   * Return the UserSession if authenticated
   */
  session: UserSession;
  /**
   * Return boolean indicating if authenticatio is present
   */
  isAuthenticated: boolean;
  /**
   * Return `IUserRequestOptions`, which is used for REST-JS
   * functions which require authentication information.
   *
   * If context is not authenticated, this function will return `undefined`
   */
  userRequestOptions: IUserRequestOptions;
  /**
   * Return `IRequestOptions`, which is used by REST-JS functions
   * which *may* use authentication information if provided.
   *
   * If context is not authenticated, this function just returns
   * the `portal` property, which informs REST-JS what Sharing API
   * instance to use (i.e. AGO, Enterprise etc)
   */
  requestOptions: IRequestOptions;
  /**
   * Return a `IHubRequestOptions` object
   *
   * If context is not authenticated, this function will return `undefined`
   */
  hubRequestOptions: IHubRequestOptions;
  /**
   * Return the portal url.
   *
   * If authenticated @ ArcGIS Online, it will return
   * the https://org.env.arcgis.com
   *
   * If authenticated @ ArcGIS Enterprise, it will return
   * https://{portalHostname}/{webadaptor}
   */
  portalUrl: string;
  /**
   * Returns the url to the sharing api composed from portalUrl
   * i.e. https://myorg.maps.arcgis.com/sharing/rest
   */
  sharingApiUrl: string;
  /**
   * Returns the Hub url, based on the portalUrl
   *
   * For ArcGIS Enterprise this will return `undefined`
   */
  hubUrl: string;
  /**
   * Url for the Hub OGC API
   */
  ogcApiUrl: string;
  /**
   * Returns the current user's hub-home url. If not authenticated,
   * returns the Hub Url. If portal, returns undefined
   */
  hubHomeUrl: string;
  /**
   * Returns boolean indicating if the backing system
   * is ArcGIS Enterprise (formerly ArcGIS Portal) or not
   */
  isPortal: boolean;
  /**
   * Returns the discussions API URL
   */
  discussionsServiceUrl: string;

  /**
   * Returns the Hub Search API URL
   */
  hubSearchServiceUrl: string;
  /**
   * Returns Hub Domain Service URL
   */
  domainServiceUrl: string;
  /**
   * Returns the Events configuration object from portal/self
   *
   * `{serviceId: '3ef..', publicViewId: 'bc3...'}`
   */
  eventsConfig: any;
  /**
   * Returns boolean indicating if the current user
   * belongs to an organization that has licensed
   * ArcGIS Hub
   */
  hubEnabled: boolean;
  /**
   * Return Hub Community Org Id, if defined
   */
  communityOrgId: string;
  /**
   * If we are in a community org with an associated e-org Return the Hub Enterprise Org Id, if defined
   */
  enterpriseOrgId: string;
  /**
   * Returns the Community Org Hostname, if defined
   */
  communityOrgHostname: string;
  /**
   * Returns the Hub Community Org url
   *
   * i.e. https://c-org.maps.arcgis.com
   */
  communityOrgUrl: string;
  /**
   * Returns the hash of helper services from portal self
   */
  helperServices: any;
  /**
   * Returns the current user
   */
  currentUser: IUser;
  /**
   * Returns the portal object
   */
  portal: IPortal;

  /**
   * What is the current user's hub license level?
   */
  hubLicense: HubLicense;

  /**
   * Additional app-specific context
   */
  properties: Record<string, any>;

  /**
   * Hub Service Status
   */
  serviceStatus: HubServiceStatus;

  /**
   * Is this user in a Hub Alpha org?
   * Derived from properties.alphaOrgs
   */
  isAlphaOrg: boolean;
  /**
   * Is this user in a Hub Beta org?
   * Derived from properties.betaOrgs
   */
  isBetaOrg: boolean;

  /**
   * What environment is this running in?
   */
  environment: HubEnvironment;

  /**
   * Hash of feature flags
   */
  featureFlags: IFeatureFlags;

  /**
   * Array of Trusted Org Ids
   */
  trustedOrgIds: string[];

  /**
   * Trusted orgs xhr response
   */
  trustedOrgs: IHubTrustedOrgsResponse[];
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

  /**
   * Return the user's history
   * @returns
   */
  history: IHubHistory;

  /**
   * Return the portal thumbnail url
   */
  orgThumbnailUrl: string;

  /**
   * Return the Survey123 url
   */
  survey123Url: string;

  /**
   * Is the current users org type a community org?
   */
  isCommunityOrg: boolean;

  /**
   * Is the current user an org admin and not in a custom role?
   */
  isOrgAdmin: boolean;

  /**
   * Groups that contain Hub Resources (linkable documents etc)
   * that are tagged to appear in different areas of the appliation.
   * Default platform groups are defined per-environment in the
   * "HUB_RESOURE_GROUPS" const..
   */
  resourceGroupIDs: string[];

  /**
   * Return the token for a given app, if defined
   * @param app
   */
  tokenFor(app: UserResourceApp): string;

  /**
   * Refresh the current user, including their groups
   */
  refreshUser(): Promise<void>;

  /**
   * Add an entry to the user's history
   * If not authenticated, this function will no-op
   * @param entry
   */
  addToHistory(entry: IHubHistoryEntry): Promise<void>;

  /**
   * Remove a specific entry from the user's history
   * @param entry
   */
  removeFromHistory(entry: IHubHistoryEntry): Promise<void>;

  /**
   * Simple clear of the all of the user's history
   */
  clearHistory(): Promise<void>;

  /**
   * Check specific permission for the current user, and optionally an entity
   * @param permission
   * @param entity
   */
  checkPermission(
    permission: Permission,
    entity?: HubEntity
  ): IPermissionAccessResponse;

  /**
   * Update the user's hub settings directly from the Context
   * @param settings
   */
  updateUserHubSettings(settings: IUserHubSettings): Promise<void>;
}
