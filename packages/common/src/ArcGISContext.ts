import { getSelf, IPortal } from "@esri/arcgis-rest-portal";
import {
  IUser,
  IUserRequestOptions,
  UserSession,
} from "@esri/arcgis-rest-auth";
import { getProp, getWithDefault, IHubRequestOptions } from ".";
import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Hash of Hub API end points so updates
 * are centralized
 */
const hubApiEndpoints = {
  domains: "/api/v3/domains",
  search: "/api/v3/datasets",
  discussions: "/api/discussions/v1",
};

/**
 * Options that can be passed into `ArcGISContext.create`
 */
export interface IArcGISContextOptions {
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
   * Random identifier useful for debugging issues
   * where race-conditions can result in multiple
   * contexts getting created
   */
  public id: number;

  private _authentication: UserSession;

  private _portalUrl: string = "https://www.arcgis.com";

  private _hubUrl: string;

  private _portalSelf: IPortal;

  private _currentUser: IUser;

  private _debug = false;

  /**
   * Private constructor. Use `ArcGISContext.create(...)` to
   * instantiate an instance
   * @param opts
   */
  private constructor(opts: IArcGISContextOptions) {
    // Having a unique id makes debugging easier
    this.id = new Date().getTime();
    if (opts.debug) {
      this._debug = opts.debug;
    }
    this.log(`ArcGISContext:ctor: Creating ${this.id}`);

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
      this._hubUrl = getHubApiFromPortalUrl(this._portalUrl);
    }
  }

  /**
   * Static async Factory
   * @param opts
   * @returns
   */
  public static async create(
    opts: IArcGISContextOptions = {}
  ): Promise<ArcGISContext> {
    const ctx = new ArcGISContext(opts);
    await ctx.initialize();
    return ctx;
  }

  /**
   * If we have a UserSession, fetch portal/self and
   * store that along with current user
   */
  async initialize(): Promise<void> {
    if (this._authentication) {
      this.log(`ArcGISContext-${this.id}: Initializing`);
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

  /**
   * @internal
   * Log debugging messages to the console
   * @param message
   */
  private log(message: string): void {
    if (this._debug) {
      // tslint:disable-next-line:no-console
      console.info(message);
    }
  }

  /**
   * Return the UserSession if authenticated
   */
  public get session(): UserSession {
    return this._authentication;
  }

  /**
   * Return boolean indicating if authenticatio is present
   */
  public get isAuthenticated(): boolean {
    return !!this._authentication;
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
    };
  }

  // ==============================
  // Getters / Computed Properties
  // ==============================

  /**
   * Return the portal url.
   *
   * If authenticated @ ArcGIS Online, it will return
   * the https://org.env.arcgis.com
   *
   * If authenticated @ ArcGIS Enterprise, it will return
   * https://portalHostname, which includes the web adaptor
   */
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

  /**
   * Returns the url to the sharing api
   * i.e. https://myorg.maps.arcgis.com/sharing/rest
   */
  public get sharingApiUrl(): string {
    return `${this.portalUrl}/sharing/rest`;
  }

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
    );
  }

  /**
   * Return Hub Community Org Id, if defined
   */
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
