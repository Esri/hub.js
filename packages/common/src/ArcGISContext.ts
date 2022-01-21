import { getSelf, IPortal } from "@esri/arcgis-rest-portal";
import { IUser, UserSession } from "@esri/arcgis-rest-auth";
import {
  ArcGISContextState,
  IArcGISContextState,
  IArcGISContextStateOptions,
} from "./ArcGISContextState";

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
 * ArcGIS Context Object
 *
 * Abstraction that combines a `UserSession` with
 * the `IPortal` and `IUser` objects to
 * provide a central lookup of platform information.
 *
 * An instance of this class will expose many properties
 * via the `.state` property. When the context changes
 * the `.state` will be updated with a new instance of `ArcGISContextState`.
 * This is done so that frameworks that rely on object equality change
 * detection (i.e. most modern frameworks) will have something to react to.
 *
 * **Note: This is a work-in-progress, and will likely expand over time**
 *
 * ```js
 * import {ArcGISContext} from '@esri/hub-common';
 * import { UserSession } from '@esri/arcgis-rest-auth';
 *
 * const auth = new UserSession({
 *   username: "jsmith",
 *   password: "123456"
 * });
 * const ctx = await new ArcGISContext({
 *  authentication: auth,
 *  portalUrl: 'https://myserver.com/gis'
 * });
 *
 * ctx.state.sharingApiUrl; //==> https://myserver.com/gis/sharing/rest
 * ctx.state.user; //=> IUser for jsmith
 * ctx.state.portal; //=> IPortal for jsmith's org
 *
 * // short cuts for the various request options needed in REST-JS functions:
 * ctx.state.requestOptions; //=> IRequestOptions
 * ctx.state.userRequestOptions; //=> IUserRequestOptions
 * ```
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

  private _state: IArcGISContextState;

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
   * Set the Authentication (UserSession) for the context.
   * This should be called when a user signs into a running
   * application.
   * @param auth
   */
  async setAuthentication(auth: UserSession): Promise<void> {
    this._authentication = auth;
    this._portalUrl = auth.portal.replace("/sharing/rest", "");
    await this.initialize();
  }

  /**
   * Clear the Authentication (UserSession). This should be
   * called when a user signs out of an application, but
   * the application continues running
   */
  clearAuthentication(): void {
    // Reset the portalUrl from the org url to the base url
    // for ArcGIS Enterprise, we just leave the _portalUrl as-is
    if (!this._state.isPortal) {
      this._portalUrl = getPortalBaseFromOrgUrl(this._portalUrl);
    }
    // Clear the auth, portalSelf and currentUser props
    this._authentication = null;
    this._portalSelf = null;
    this._currentUser = null;
    this._state = new ArcGISContextState({
      id: this.id,
      portalUrl: this._portalUrl,
      hubUrl: this._hubUrl,
    });
  }

  /**
   * Return a reference to the current state.
   * When `.setAuthentication()` or `.clearAuthenentication()` are
   * called, the state will be re-created. This is done so frameworks
   * like React or Ember can detect changes.
   */
  get state(): IArcGISContextState {
    return this._state;
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
   * If we have a UserSession, fetch portal/self and
   * store that along with current user
   */
  private async initialize(): Promise<void> {
    let stateOpts: IArcGISContextStateOptions = {
      id: this.id,
      portalUrl: this._portalUrl,
      hubUrl: this._hubUrl,
    };
    if (this._authentication) {
      this.log(`ArcGISContext-${this.id}: Initializing`);
      const ps = await getSelf({ authentication: this._authentication });
      this._portalSelf = ps;
      this._currentUser = ps.user;
      stateOpts = {
        id: this.id,
        portalUrl: this._portalUrl,
        hubUrl: this._hubUrl,
        portalSelf: this._portalSelf,
        currentUser: this._currentUser,
        authentication: this._authentication,
      };
    }
    // update the state
    this._state = new ArcGISContextState(stateOpts);
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

function getPortalBaseFromOrgUrl(orgUrl: string): string {
  let result;

  if (orgUrl.match(/(qaext|\.mapsqa)\.arcgis.com/)) {
    result = "https://qaext.arcgis.com";
  } else if (orgUrl.match(/(devext|\.mapsdevext)\.arcgis.com/)) {
    result = "https://devext.arcgis.com";
  } else {
    /* istanbul ignore else */
    if (orgUrl.match(/(www|\.maps)\.arcgis.com/)) {
      result = "https://www.arcgis.com";
    }
  }

  return result;
}
