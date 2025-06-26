import {
  IUser,
  IUserRequestOptions,
  ArcGISIdentityManager,
} from "@esri/arcgis-rest-request";
import {
  IGetUserOptions,
  IPortal,
  IPortalSettings,
  getUser,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  IHubHistory,
  IHubHistoryEntry,
  addHistoryEntry,
  removeHistoryEntry,
} from "./core/hubHistory";
import { getProp, getWithDefault } from "./objects";
import {
  HubEnvironment,
  HubLicense,
  IFeatureFlags,
  IPermissionAccessResponse,
  Permission,
} from "./permissions/types";
import { IHubRequestOptions, IHubTrustedOrgsResponse } from "./hub-types";
import { getEnvironmentFromPortalUrl } from "./utils/getEnvironmentFromPortalUrl";
import { UserResourceApp } from "./hub-types";
import type { IUserResourceToken } from "./types/IUserResourceToken";
import { updateUserHubSettings } from "./utils/hubUserAppResources";
import { IUserHubSettings } from "./utils/IUserHubSettings";
import { HubServiceStatus } from "./core/types/ISystemStatus";
import { checkPermission } from "./permissions/checkPermission";
import { HubEntity } from "./core/types/HubEntity";
import { getOrgThumbnailUrl } from "./resources/get-org-thumbnail-url";
import type { IArcGISContext } from "./types/IArcGISContext";
import type { IArcGISContextOptions } from "./types/IArcGISContextOptions";

export const ENTERPRISE_SITES_PATH = "/apps/sites";
export const ENTERPRISE_HOME_SUBDOMAIN = "home";

/**
 * Hash of Hub API end points so updates
 * are centralized
 */
const hubApiEndpoints = {
  domains: "/api/v3/domains",
  search: "/api/v3/datasets",
  discussions: "/api/discussions/v1",
  ogcRecords: "/api/search/v1",
};

/**
 * Per-environment Group Ids that contain documents/links to
 * Hub Resources (help docs, blog posts etc)
 */
const HUB_RESOURE_GROUPS: Record<HubEnvironment, string[]> = {
  qaext: [
    "da45c26e67764c79840928cd8d05561a", // owner: dcadminqa
  ],
  devext: [], // EMPTY
  production: ["e3db35f7de63451f8243415445694761"],
  enterprise: [], // EMPTY
  "enterprise-k8s": [], // EMPTY
};

/**
 * Abstraction that holds a `ArcGISIdentityManager`, along with
 * getters to streamline access to various platform
 * urls, and common constructs like `IRequestOptions`,
 * `IUserRequestOptions` etc.
 *
 * Instances are intended to be immutable, but this is not directly enforced.
 *
 * In most circumstances, this class should be created by
 * the ArcGISContextManager class.
 */
export class ArcGISContext implements IArcGISContext {
  /**
   * Unique id from the ArcGISContextManager that created
   * this instance. Primarily useful for debugging possible
   * race-conditions that can result in multiple ArcGISContextManager
   * instances being created.
   */
  public id: number;
  private _authentication: ArcGISIdentityManager;

  private _portalUrl = "https://www.arcgis.com";

  private _hubUrl: string;

  private _hubHomeUrl: string;

  private _portalSelf: IPortal;

  private _portalSettings: IPortalSettings;

  private _currentUser: IUser;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _properties: Record<string, any>;

  private _serviceStatus: HubServiceStatus;

  private _featureFlags: IFeatureFlags = {};

  private _trustedOrgIds: string[];

  private _trustedOrgs: IHubTrustedOrgsResponse[];

  private _userResourceTokens: IUserResourceToken[] = [];

  private _userHubSettings: IUserHubSettings;

  /**
   * Create a new instance of `ArcGISContext`.
   *
   * @param opts
   */
  constructor(opts: IArcGISContextOptions) {
    this.id = opts.id;
    this._portalUrl = opts.portalUrl;
    this._hubUrl = opts.hubUrl;
    this._serviceStatus = opts.serviceStatus;
    if (opts.authentication) {
      this._authentication = opts.authentication;
    }

    if (opts.portalSelf) {
      this._portalSelf = opts.portalSelf;
    }

    if (opts.portalSettings) {
      this._portalSettings = opts.portalSettings;
    }

    if (opts.currentUser) {
      this._currentUser = opts.currentUser;
    }
    if (opts.properties) {
      this._properties = opts.properties;
    }

    if (opts.trustedOrgIds) {
      this._trustedOrgIds = opts.trustedOrgIds;
    }

    if (opts.trustedOrgs) {
      this._trustedOrgs = opts.trustedOrgs;
    }

    this._featureFlags = opts.featureFlags || {};
    this._userResourceTokens = opts.userResourceTokens || [];
    this._userHubSettings = opts.userHubSettings || {
      schemaVersion: 1,
    };
  }

  /**
   * Return the ArcGISIdentityManager if authenticated
   */
  public get session(): ArcGISIdentityManager {
    return this._authentication;
  }

  /**
   * Return boolean indicating if authenticatio is present
   */
  public get isAuthenticated(): boolean {
    return !!this._authentication;
  }

  /**
   * Return hash of feature flags passed into constructor.
   * Default is empty object.
   */
  public get featureFlags(): IFeatureFlags {
    return this._featureFlags;
  }

  /**
   * Is the users org in the alpha orgs list?
   * Alpha orgs are passed in via properties.alphaOrgs
   */
  public get isAlphaOrg(): boolean {
    let result = false;
    const orgs: string[] = (this._properties?.alphaOrgs as string[]) || [];
    const orgId = this._portalSelf?.id;
    if (orgs.length && orgId) {
      result = orgs.includes(orgId);
    }
    return result;
  }

  /**
   * Is the users org in the beta orgs list?
   * Beta orgs are passed in via properties.betaOrgs
   */
  public get isBetaOrg(): boolean {
    let result = false;
    const orgs: string[] = (this._properties?.betaOrgs as string[]) || [];
    const orgId = this._portalSelf?.id;
    if (orgs.length && orgId) {
      result = orgs.includes(orgId);
    }
    return result;
  }

  /**
   * Return the HubEnvironment of the current context
   */
  public get environment(): HubEnvironment {
    return getEnvironmentFromPortalUrl(this._portalUrl);
  }

  /**
   * Return `IUserRequestOptions`, which is used for REST-JS
   * functions which require authentication information.
   *
   * If context is not authenticated, this function will throw
   */
  public get userRequestOptions(): IUserRequestOptions {
    if (this.isAuthenticated) {
      return {
        authentication: this._authentication,
        portal: this.sharingApiUrl,
      };
    }
  }

  /**
   * Return `IRequestOptions`, which is used by REST-JS functions
   * which *may* use authentication information if provided.
   *
   * If context is not authenticated, this function just returns
   * the `portal` property, which informs REST-JS what Sharing API
   * instance to use (i.e. AGO, Enterprise etc)
   */
  public get requestOptions(): IRequestOptions {
    let ro: IRequestOptions = {
      portal: this.sharingApiUrl,
    };
    if (this.isAuthenticated) {
      ro = {
        authentication: this._authentication,
        portal: this.sharingApiUrl,
      };
    }
    return ro;
  }

  /**
   * Return a `IHubRequestOptions` object
   */
  public get hubRequestOptions(): IHubRequestOptions {
    // We may add more logic around what is returned in some corner cases

    return {
      authentication: this.session,
      isPortal: this.isPortal,
      portalSelf: this.portal,
      hubApiUrl: this.hubUrl,
      portal: this.sharingApiUrl,
    };
  }

  /**
   * Return the portal url i.e. https://www.arcgis.com
   *
   * If authenticated @ ArcGIS Online, it will return
   * the https://org.env.arcgis.com
   *
   * If authenticated @ ArcGIS Enterprise, it will return
   * https://{portalHostname}/{webadaptor}
   */
  public get portalUrl(): string {
    if (this.isAuthenticated) {
      if (this.isPortal || !this._portalSelf.urlKey) {
        return `https://${this._portalSelf.portalHostname as string}`;
      } else {
        return `https://${this._portalSelf.urlKey as string}.${
          this._portalSelf.customBaseUrl as string
        }`;
      }
    } else {
      return this._portalUrl;
    }
  }

  /**
   * Returns the current user's hub-home url. If not authenticated,
   * returns the Hub Url.
   */
  public get hubHomeUrl(): string {
    if (this.isPortal) {
      return `${this.portalUrl}${ENTERPRISE_SITES_PATH}/#/${ENTERPRISE_HOME_SUBDOMAIN}`;
    } else {
      if (this.isAuthenticated) {
        const hubHostname = this._hubUrl.replace("https://", "");
        return `https://${this._portalSelf.urlKey as string}.${hubHostname}`;
      } else {
        return this._hubUrl;
      }
    }
  }

  /**
   * Returns the current user's Hub License
   */
  get hubLicense(): HubLicense {
    if (this.isPortal) {
      return "enterprise-sites";
    } else {
      if (this.hubEnabled) {
        return "hub-premium";
      } else {
        return "hub-basic";
      }
    }
  }

  /**
   * Returns the current hub service status information
   */
  get serviceStatus(): HubServiceStatus {
    return this._serviceStatus;
  }

  /**
   * Returns the url to the sharing api composed from portalUrl
   * i.e. https://myorg.maps.arcgis.com/sharing/rest
   */
  public get sharingApiUrl(): string {
    return `${this.portalUrl}/sharing/rest`;
  }

  /**
   * Returns the Hub url, based on the portalUrl
   *
   * For ArcGIS Enterprise this will return `undefined`
   */
  public get hubUrl(): string {
    return this._hubUrl;
  }

  /**
   * Returns boolean indicating if the backing system
   * is ArcGIS Enterprise (formerly ArcGIS Portal) or not
   */
  public get isPortal(): boolean {
    return this._portalSelf
      ? this._portalSelf.isPortal
      : this._portalUrl.indexOf("arcgis.com") === -1;
  }

  /**
   * Returns the discussions API URL
   */
  public get discussionsServiceUrl(): string {
    if (this._hubUrl) {
      return `${this._hubUrl}${hubApiEndpoints.discussions}`;
    }
  }

  /**
   * Returns the Hub Search API URL
   */
  public get hubSearchServiceUrl(): string {
    if (this._hubUrl) {
      return `${this._hubUrl}${hubApiEndpoints.search}`;
    }
  }

  /**
   * Returns Hub Domain Service URL
   */
  public get domainServiceUrl(): string {
    if (this._hubUrl) {
      return `${this._hubUrl}${hubApiEndpoints.domains}`;
    }
  }

  /**
   * Returns Hub OGCAPI Service URL
   */
  public get ogcApiUrl(): string {
    if (this._hubUrl) {
      // NOTE: In the future, we will be able to use _hubUrl directly
      // but for now, we swap "hub" to "opendata" in _hubUrl so we end
      // up with urls like https://opendataqa.arcgis.com/api/search/v1
      const opendataUrl = this._hubUrl.replace("hub", "opendata");
      return `${opendataUrl}${hubApiEndpoints.ogcRecords}`;
    }
  }

  /**
   * Returns the Events configuration object from portal/self
   *
   * `{serviceId: '3ef..', publicViewId: 'bc3...'}`
   */
  public get eventsConfig(): Record<string, unknown> {
    if (this._portalSelf) {
      return getProp(
        this._portalSelf,
        "portalProperties.hub.settings.events"
      ) as Record<string, unknown>;
    }
  }

  /**
   * Returns boolean indicating if the current user
   * belongs to an organization that has licensed
   * ArcGIS Hub
   */
  public get hubEnabled(): boolean {
    return getWithDefault(
      this._portalSelf,
      "portalProperties.hub.enabled",
      false
    ) as boolean;
  }

  /**
   * Return the Hub Community Org Id, if defined
   */
  public get communityOrgId(): string {
    if (this._portalSelf) {
      return getProp(
        this._portalSelf,
        "portalProperties.hub.settings.communityOrg.orgId"
      ) as string;
    }
  }

  /**
   * If we are in a community org with an associated e-org
   * Return the Hub Enterprise Org Id, if defined
   */
  public get enterpriseOrgId(): string {
    if (this._portalSelf) {
      return getProp(
        this._portalSelf,
        "portalProperties.hub.settings.enterpriseOrg.orgId"
      ) as string;
    }
  }

  /**
   * Returns the Hub Community Org Hostname, if defined
   *
   * i.e. c-org.maps.arcgis.com
   */
  public get communityOrgHostname(): string {
    if (this._portalSelf) {
      return getProp(
        this._portalSelf,
        "portalProperties.hub.settings.communityOrg.portalHostname"
      ) as string;
    }
  }

  /**
   * Returns the Hub Community Org url
   *
   * i.e. https://c-org.maps.arcgis.com
   */
  public get communityOrgUrl(): string {
    if (this.communityOrgHostname) {
      return `https://${this.communityOrgHostname}`;
    }
  }

  /**
   * Returns the hash of helper services from portal self
   */
  public get helperServices(): Array<unknown> {
    if (this._portalSelf) {
      return this._portalSelf.helperServices as Array<unknown>;
    }
  }

  /**
   * Returns the current user as IUser
   */
  public get currentUser(): IUser {
    return this._currentUser;
  }

  /**
   * Returns the portal object as IPortal
   */
  public get portal(): IPortal {
    return this._portalSelf;
  }

  public get portalSettings(): IPortalSettings {
    return this._portalSettings;
  }

  /**
   * Return the properties hash that was passed in.
   * Useful for app-specific context such as the active
   * Site for ArcGIS Hub
   */
  public get properties(): Record<string, unknown> {
    return this._properties;
  }

  /**
   * Returns the array of Trusted Org Ids
   */
  public get trustedOrgIds(): string[] {
    return this._trustedOrgIds;
  }

  /**
   * Returns the array of Trusted Orgs
   */
  public get trustedOrgs(): IHubTrustedOrgsResponse[] {
    return this._trustedOrgs;
  }

  /**
   * Returns whether the current user's org type is a community org
   */
  public get isCommunityOrg(): boolean {
    let result = false;
    if (this._portalSelf) {
      const orgType = getProp(
        this._portalSelf,
        "portalProperties.hub.settings.orgType"
      ) as string;
      result = orgType === "community";
    }
    return result;
  }

  /**
   * Returns whether the current user is an org admin and not in a custom role.
   */
  public get isOrgAdmin(): boolean {
    const { _currentUser } = this;
    let result = false;
    if (_currentUser) {
      result = _currentUser.role === "org_admin" && !_currentUser.roleId;
    }
    return result;
  }

  /**
   * Return the whole array of user resource tokens
   */
  public get userResourceTokens(): IUserResourceToken[] {
    return this._userResourceTokens;
  }

  /**
   * Return the user hub settings.
   * Updates must be done via `contextManager.updateUserHubSettings`
   */
  public get userHubSettings(): IUserHubSettings {
    return this._userHubSettings;
  }

  public get orgThumbnailUrl(): string {
    return getOrgThumbnailUrl(this.portal, this.session?.token);
  }

  /**
   * Return the survey123 url
   */
  public get survey123Url(): string {
    const suffixes: Partial<Record<HubEnvironment, string>> = {
      qaext: "qa",
      devext: "dev",
    };
    const suffix = suffixes[this.environment] ?? "";
    return `https://survey123${suffix}.arcgis.com`;
  }

  /**
   * Return a token for a specific app
   * @param app
   * @returns
   */
  public tokenFor(app: UserResourceApp): string {
    const entry = this._userResourceTokens.find((e) => e.app === app);
    if (entry) {
      return entry.token;
    }
  }

  /**
   * Re-fetch the current user, including their groups
   * @returns
   */
  public refreshUser(): Promise<void> {
    const opts: IGetUserOptions = {
      authentication: this.session,
      portal: this.sharingApiUrl,
      username: this.session.username,
    };

    return getUser(opts).then((user) => {
      this._currentUser = user;
    });
  }

  /**
   * Return the user's history
   * @returns
   */
  public get history(): IHubHistory {
    return this._userHubSettings.history || ({ entries: [] } as IHubHistory);
  }

  /**
   * Return an array of GroupIds, per-environment, that contain
   * Hub Resources (linkable documents etc) that are tagged to appear
   * in different areas of the appliation.
   */
  public get resourceGroupIDs(): string[] {
    return HUB_RESOURE_GROUPS[this.environment];
  }

  /**
   * Check specific permission for the current user, and optionally an entity
   * @param permission
   * @param entity
   * @returns
   */
  checkPermission(
    permission: Permission,
    entity?: HubEntity
  ): IPermissionAccessResponse {
    return checkPermission(permission, this, entity);
  }

  /**
   * Add an entry to the user's history
   * @param entry
   * @param win
   * @returns
   */
  public async addToHistory(entry: IHubHistoryEntry): Promise<void> {
    // No-op if not authenticated
    if (!this.isAuthenticated) {
      return;
    }

    // No-op if the user doesn't have the permission
    const chk = this.checkPermission("hub:feature:history");
    if (!chk.access) {
      return;
    }

    // add the entry to the history
    const updated = addHistoryEntry(entry, this.history);
    // The getter reads from this, so just re-assign
    this._userHubSettings.history = updated;
    // update the user-app-resource
    return this.updateUserHubSettings(this._userHubSettings);

    // --------------------------------------------------------------------
    // Turns out that integrating this with LocalStorage will involve
    // a lot of syncronization as auth'd user moves between sites
    // which may have different history states in localStorage
    // So let's start with just tracking the history
    // in workspaces and see how that goes.
    // --------------------------------------------------------------------
  }

  /**
   * Clear the entire history
   * @returns
   */
  public async clearHistory(): Promise<void> {
    // No-op if not authenticated
    if (!this.isAuthenticated) {
      return;
    }
    // No-op if the user doesn't have the permission
    const chk = this.checkPermission("hub:feature:history");
    if (!chk.access) {
      return;
    }
    // create a new history object
    const history: IHubHistory = {
      entries: [],
    };
    // assign into the user-app-resource
    this._userHubSettings.history = history;
    // update the user-app-resource
    return this.updateUserHubSettings(this._userHubSettings);
  }

  /**
   * Remove a specific entry from the user's history
   * @param entry
   * @returns
   */
  public async removeFromHistory(entry: IHubHistoryEntry): Promise<void> {
    // No-op if not authenticated
    if (!this.isAuthenticated) {
      return;
    }
    // No-op if the user doesn't have the permission
    const chk = this.checkPermission("hub:feature:history");
    if (!chk.access) {
      return;
    }
    // remove the entry from the history
    const updated = removeHistoryEntry(entry, this.history);
    this._userHubSettings.history = updated;
    // update the user-app-resource
    return this.updateUserHubSettings(this._userHubSettings);
  }

  /**
   * Update the user's hub settings
   *
   * Possible issue here is that we're not updating the contextManager
   * so the contextManager will be out of sync with this instance of
   * ArcGISContext. Unclear if this will be an actual problem.
   * @param settings
   */
  public async updateUserHubSettings(
    settings: IUserHubSettings
  ): Promise<void> {
    if (!this._authentication) {
      throw new Error(
        "Cannot update user hub settings without an authenticated user"
      );
    }
    // update the user-app-resource replacing it instead of extending
    // changes onto it. This ensures that migrations are applied.
    await updateUserHubSettings(settings, this, true);
    // update the context
    this._userHubSettings = settings;
    // iterate the props in the features object
    Object.keys(getWithDefault(settings, "features", {})).forEach((key) => {
      const val = getProp(settings, `features.${key}`) as boolean;
      this._featureFlags[`hub:feature:${key}`] = val;
    });
  }
}
