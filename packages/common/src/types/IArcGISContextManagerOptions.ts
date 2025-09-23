import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IPortal } from "@esri/arcgis-rest-portal";
import type { IPortalSettings, IUser } from "@esri/arcgis-rest-portal";
import { IUserResourceToken } from "./IUserResourceToken";
import { IUserResourceConfig } from "./IUserResourceConfig";
import { HubServiceStatus } from "../core/types/ISystemStatus";
import { IHubTrustedOrgsResponse } from "../hub-types";
import { IUserHubSettings } from "../utils/IUserHubSettings";
import {
  IFeatureFlags,
  IServiceFlags,
} from "../permissions/types/IPermissionPolicy";

/**
 * Options that can be passed into `ArcGISContextManager.create`
 */

export interface IArcGISContextManagerOptions {
  /**
   * Existing user session, which may be created from Identity Manager
   * `const session = ArcGISIdentityManager.fromCredential(idMgr.getCredential());`
   */
  authentication?: ArcGISIdentityManager;

  /**
   * ArcGIS Online or ArcGIS Enterprise portal url.
   * Do not include  `/sharing/rest`
   * Defaults to `https://www.arcgis.com`
   * For ArcGIS Enterprise, you must include the webadaptor name.
   * i.e. https://gis.mytown.gov/portal
   *
   * When Authentication is present, the ArcGISIdentityManager.portal value is
   * used instead of this property.
   */
  portalUrl?: string;

  /**
   * Portal self for the authenticated user. If not passed into `.create`
   * with the ArcGISIdentityManager, it will be fetched
   */
  portal?: IPortal;

  /**
   * Portal settings for the authenticated user. If not passed into `.create`
   * with the ArcGISIdentityManager, it will be fetched
   */
  portalSettings?: IPortalSettings;

  /**
   * Current user as `IUser`. If not passed into `.create` with the ArcGISIdentityManager
   * it will be fetched.
   */
  currentUser?: IUser;

  /**
   * Any additional properties to expose on the context. This allows
   * an application to send additional context into the system.
   * For example, in ArcGIS Hub, many times we want to pass in the
   * active "Hub Site" as additional context, so we will send that in
   * as a node on a properties object.
   */
  properties?: Record<string, any>;

  /**
   * Option to pass in service status vs fetching it
   */
  serviceStatus?: HubServiceStatus;

  /**
   * Optional hash of feature flags
   */
  featureFlags?: IFeatureFlags;

  /**
   * Optional hash of service flags.
   */
  serviceFlags?: IServiceFlags;

  /**
   * Array of Trusted Org Ids
   */
  trustedOrgIds?: string[];

  /**
   * Trusted orgs xhr response
   */
  trustedOrgs?: IHubTrustedOrgsResponse[];

  /**
   * Array of app, clientId's that Context Manager should
   * exchange tokens for
   */
  resourceConfigs?: IUserResourceConfig[];

  /**
   * Array of app, clientId, token objects which Context
   * Manager has exchanged tokens for
   */
  resourceTokens?: IUserResourceToken[];
  /**
   * Hash of user hub settings. These are stored as
   * user-app-resources, associated with the `hubforarcgis` clientId
   */
  userHubSettings?: IUserHubSettings;
}
