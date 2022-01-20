import { getSelf, IPortal } from "@esri/arcgis-rest-portal";
import {
  IUser,
  IUserRequestOptions,
  UserSession,
} from "@esri/arcgis-rest-auth";
import { getProp, getWithDefault, IHubRequestOptions } from ".";
import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Options that can be passed into `ArcGISContext.create`
 */
export interface IArcGISContextOptions {
  /**
   * ClientId for use with oAuth. Although this is optional,
   * it is required to use ArcGISContext with an oAuth flow
   */
  clientId?: string;

  /**
   * Existing user session, which may be created from Identity Manager
   * `const session = UserSession.fromCredential(idMgr.getCredential());`
   */
  authentication?: UserSession;

  /**
   * ArcGIS Online or ArcGIS Enterprise portal url.
   * Do not include  `/sharing/rest`
   * Defaults to `https://www.arcgis.com`
   * For ArcGIS Enterprise, you must include the webadaptor name.
   * i.e. https://gis.mytown.gov/portal
   *
   * When Authentication is present, the UserSession.portal value is
   * used instead of this property.
   */
  portalUrl?: string;

  /**
   * If set to `true` additional logging will be sent to the console
   * Defaults to false.
   */
  debug?: boolean;
}

/**
 * Application Context Object
 *
 * Abstraction that combines a `UserSession` with
 * the `portal/self` and `user/self` responses to
 * provide a central lookup of platform information.
 *
 * This is a work-in-progress, and will likely expand over time.
 *
 * `ArcGISContext` is used in conjuction with the `arcgis-app-identity`
 * component to orchestrate oAuth.
 */
export class ArcGISContext {
  /**
   * When a session is persisted to local storage,
   * the storage key is the combination of the client id
   * and the SESSION_KEY
   */
  private SESSION_KEY = "__CONTEXT_";

  private _authentication: UserSession;

  private _portalUrl: string;

  private _hubUrl: string;

  private _portalSelf: IPortal;

  private _currentUser: IUser;

  private _clientId: string;

  private _debug = false;

  /**
   * Random identifier useful for debugging issues where race-conditions
   */
  public id: number;

  private constructor(opts: IArcGISContextOptions) {
    // Having a unique id makes debugging easier
    this.id = new Date().getTime();
    if (opts.debug) {
      this._debug = opts.debug;
    }
    this.log(`ArcGISContext:ctor: Creating ${this.id}`);
    // If not passed in, the clientId defaults to arcgisonline
    // NOTE: this clientid only works for applications hosted by Esri on the arcgis.com domain
    // Custom applications *must* provide a valid clientId associated with
    // an Application Item stored in the portal you are connecting to
    this._clientId = opts.clientId || "arcgisonline";
    if (opts.authentication) {
      this._authentication = opts.authentication;
      this._portalUrl = this._authentication.portal.replace(
        "/sharing/rest",
        ""
      );
      this._hubUrl = getHubApiFromPortalUrl(this._portalUrl);
    } else if (opts.portalUrl) {
      this._portalUrl = opts.portalUrl;
      this._hubUrl = getHubApiFromPortalUrl(this._portalUrl);
    } else {
      this._portalUrl = "https://www.arcgis.com";
      this._hubUrl = getHubApiFromPortalUrl(this._portalUrl);
    }
  }

  /**
   * @internal
   * Log debugging messages to the console
   * @param message
   */
  private log(message: string): void {
    if (this._debug) {
      console.info(message);
    }
  }

  /**
   * Static async Factory
   * @param opts
   * @returns
   */
  public static async create(
    opts: IArcGISContextOptions,
    win: any = window
  ): Promise<ArcGISContext> {
    const ctx = new ArcGISContext(opts);
    // if auth was not passed in, but we have a clientId, and we have access
    // to localStorage (i.e. we're in a browser) see if we can re-hydrate an existing session
    if (!opts.authentication && opts.clientId && win.localStorage) {
      const serializedSession = win.localStorage.getItem(ctx.sessionKey);
      if (serializedSession) {
        if (opts.debug) {
          console.info(
            `ArcGISContext-${ctx.id}: Loaded session from localStorage`
          );
        }
        await ctx.setAuthentication(UserSession.deserialize(serializedSession));
      }
    }
    if (opts.debug) {
      console.info(`ArcGISContext-${ctx.id}: Initializing`);
    }
    await ctx.initialize();
    return ctx;
  }

  /**
   * If we have a UserSession, fetch portal/self and
   * store that along with current user
   */
  async initialize(): Promise<void> {
    if (this._authentication) {
      const ps = await getSelf({ authentication: this._authentication });
      this._portalSelf = ps;
      this._currentUser = ps.user;
    }
  }

  // Set authentication after the instance is up and running
  async setAuthentication(auth: UserSession): Promise<void> {
    this._authentication = auth;
    this._portalUrl = auth.portal.replace("/sharing/rest", "");
    await this.initialize();
  }

  private get sessionKey(): string {
    return `${this.SESSION_KEY}${this._clientId}`;
  }

  public saveSession(win: any = window): void {
    if (win.localStorage) {
      win.localStorage.setItem(
        this.sessionKey,
        this._authentication.serialize()
      );
    }
  }

  public async clearSession(win: any = window): Promise<void> {
    // const localStorage = ArcGISContext._getLocalStorage();
    if (win.localStorage) {
      win.localStorage.removeItem(this.sessionKey);
    }
    this._authentication = null;
    this._currentUser = null;
    this._portalSelf = null;
    this.initialize();
  }

  public get session(): UserSession {
    return this._authentication;
  }

  public get isAuthenticated(): boolean {
    return !!this._authentication;
  }

  public get clientId(): string {
    return this._clientId;
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
    let ro: any = {
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

  public get hubRequestOptions(): IHubRequestOptions {
    // We may add more logic around what is returned in some corner cases
    return {
      authentication: this.session,
      isPortal: this.isPortal,
      portalSelf: this.portal,
      hubApiUrl: this.hubUrl,
    };
  }

  // ==============================
  // Getters / Computed Properties
  // ==============================
  // All these props should derive their values
  // based on other state of the object
  public get portalUrl(): string {
    if (this.isAuthenticated) {
      if (this.isPortal) {
        return `https://${this._portalSelf.portalHostname}`;
      } else {
        return `https://${this._portalSelf.urlKey}.${this._portalSelf.customBaseUrl}`;
      }
    } else {
      return this._portalUrl;
    }
  }

  public get sharingApiUrl(): string {
    return `${this.portalUrl}/sharing/rest`;
  }

  public get hubUrl(): string {
    return this._hubUrl;
  }

  // Deprecate isPortal but until we can do that
  // this is a stand-in and will warn in console
  // which will be important if/when we rework
  // session/ArcGISContext service to lean into this class
  public get isPortal(): boolean {
    return this._portalSelf
      ? this._portalSelf.isPortal
      : this._portalUrl.indexOf("arcgis.com") === -1;
  }

  // Hub APIs
  // ----------
  // Discussions
  public get discussionsServiceUrl(): string {
    if (this._hubUrl) {
      return `${this._hubUrl}${hubApiEndpoints.discussions}`;
    }
  }

  // Hub Search
  public get hubSearchServiceUrl(): string {
    if (this._hubUrl) {
      return `${this._hubUrl}${hubApiEndpoints.search}`;
    }
  }

  // Domain
  public get domainServiceUrl(): string {
    if (this._hubUrl) {
      return `${this._hubUrl}${hubApiEndpoints.domains}`;
    }
  }

  // Events
  // returns `{serviceId: '3ef..', publicViewId: 'bc3...'}
  public get eventsConfig(): any {
    if (this._portalSelf) {
      return getProp(this._portalSelf, "portalProperties.hub.settings.events");
    }
  }

  public get hubEnabled(): boolean {
    return getWithDefault(
      this._portalSelf,
      "portalProperties.hub.enabled",
      false
    );
  }

  public get communityOrgId(): string {
    if (this._portalSelf) {
      return getProp(
        this._portalSelf,
        "portalProperties.hub.settings.communityOrg.orgId"
      );
    }
  }

  public get communityOrgHostname(): string {
    if (this._portalSelf) {
      return getProp(
        this._portalSelf,
        "portalProperties.hub.settings.communityOrg.portalHostname"
      );
    }
  }

  public get communityOrgUrl(): string {
    if (this.communityOrgHostname) {
      return `https://${this.communityOrgHostname}`;
    }
  }

  // Platform API service urls are all in helperServices
  // and not consistent to expose as urls
  public get helperServices(): any {
    if (this._portalSelf) {
      return this._portalSelf.helperServices;
    }
  }

  public get currentUser(): IUser {
    return this._currentUser;
  }

  public get portal(): IPortal {
    return this._portalSelf;
  }
}

/**
 * Cross-walk from a portalUrl to the corresponding Hub.
 *
 * If the passed url is not recognized, then this will return `undefined`
 * @param portalUrl
 * @returns
 */
function getHubApiFromPortalUrl(portalUrl: string): string {
  let result;

  if (portalUrl.match(/(qaext|\.mapsqa)\.arcgis.com/)) {
    result = "https://hubqa.arcgis.com";
  } else if (portalUrl.match(/(devext|\.mapsdevext)\.arcgis.com/)) {
    result = "https://hubdev.arcgis.com";
  } else if (portalUrl.match(/(www|\.maps)\.arcgis.com/)) {
    result = "https://hub.arcgis.com";
  }

  return result;
}

const hubApiEndpoints = {
  domains: "/api/v3/domains",
  search: "/api/v3/datasets",
  discussions: "/api/discussions/v1",
};
