import { getSelf, getUser, IPortal } from "@esri/arcgis-rest-portal";
import { IUser, UserSession } from "@esri/arcgis-rest-auth";
import {
  ArcGISContext,
  IArcGISContext,
  IArcGISContextOptions,
} from "./ArcGISContext";
import { cloneObject, Logger, Level } from ".";
import { getHubApiFromPortalUrl } from "./urls/getHubApiFromPortalUrl";
import { getPortalBaseFromOrgUrl } from "./urls/getPortalBaseFromOrgUrl";

/**
 * Options that can be passed into `ArcGISContextManager.create`
 */
export interface IArcGISContextManagerOptions {
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
   * Portal self for the authenticated user. If not passed into `.create`
   * with the UserSession, it will be fetched
   */
  portal?: IPortal;

  /**
   * Current user as `IUser`. If not passed into `.create` with the UserSession
   * it will be fetched.
   */
  currentUser?: IUser;

  /**
   * Logging level
   * off > error > warn > info > debug > all
   * defaults to 'error'
   */
  logLevel?: Level;
}

/**
 * The manager exposes context (`IArcGISContext`), which combines a `UserSession` with
 * the `portal/self` and `user/self` responses to provide a central lookup for platform
 * information, api urls, and other useful properties for developers such as IRequestOptions
 * IUserRequestOptions, IHubRequestOptions etc.
 *
 * The context is exposed on gthe `.context` property, and as the authentication changes
 * the `.context` is re-created. This is done to allow web frameworks to watch for
 * changes on that single property, instead of having to leverage observers or events
 * for change detection.
 *
 * Please see the [ArcGISContext Guide](/hub.js/guides/context) for additional information.
 *
 */
export class ArcGISContextManager {
  /**
   * Random identifier useful for debugging issues
   * where race-conditions can result in multiple
   * contexts getting created
   */
  public id: number;

  private _context: IArcGISContext;

  private _authentication: UserSession;

  private _portalUrl: string = "https://www.arcgis.com";

  private _hubUrl: string;

  private _portalSelf: IPortal;

  private _currentUser: IUser;

  private _logLevel: Level = Level.error;

  /**
   * Private constructor. Use `ArcGISContextManager.create(...)` to
   * instantiate an instance
   * @param opts
   */
  private constructor(opts: IArcGISContextManagerOptions) {
    // Having a unique id makes debugging easier
    this.id = new Date().getTime();
    if (opts.logLevel) {
      this._logLevel = opts.logLevel;
    }
    Logger.setLogLevel(this._logLevel);
    Logger.debug(`ArcGISContextManager:ctor: Creating ${this.id}`);

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

    if (opts.portal) {
      this._portalSelf = cloneObject(opts.portal);
    }
    if (opts.currentUser) {
      this._currentUser = cloneObject(opts.currentUser);
    }
  }

  /**
   * Used to create a new instance of the ArcGISContext class.
   *
   * ```js
   * const ctxMgr = await ArcGISContextManager.create();
   * ```
   *
   * @param opts
   * @returns
   */
  public static async create(
    opts: IArcGISContextManagerOptions = {}
  ): Promise<ArcGISContextManager> {
    const ctx = new ArcGISContextManager(opts);
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
    if (!this._context.isPortal) {
      this._portalUrl = getPortalBaseFromOrgUrl(this._portalUrl);
    }
    // Clear the auth, portalSelf and currentUser props
    this._authentication = null;
    this._portalSelf = null;
    this._currentUser = null;
    this._context = new ArcGISContext({
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
  get context(): IArcGISContext {
    return this._context;
  }

  /**
   * If we have a UserSession, fetch portal/self and
   * store that along with current user
   */
  private async initialize(): Promise<void> {
    // if we have auth, and don't have portalSelf or currentUser, fetch them
    if (this._authentication && (!this._portalSelf || !this._currentUser)) {
      Logger.debug(`ArcGISContextManager-${this.id}: Initializing`);
      const username = this._authentication.username;
      const requests: [Promise<IPortal>, Promise<IUser>] = [
        getSelf({ authentication: this._authentication }),
        getUser({ username, authentication: this._authentication }),
      ];
      try {
        const [portal, user] = await Promise.all(requests);
        this._portalSelf = portal;
        this._currentUser = user;
        Logger.debug(
          `ArcGISContextManager-${this.id}: received portalSelf and currentUser`
        );
      } catch (ex) {
        const msg = `ArcGISContextManager could not fetch portal & user for "${this._authentication.username}" using ${this._authentication.portal}.`;
        Logger.error(msg);
        // tslint:disable-next-line:no-console
        console.error(msg);
        throw ex;
      }
    }
    Logger.debug(`ArcGISContextManager-${this.id}: updating context`);
    // update the context
    this._context = new ArcGISContext(this.contextOpts);
  }

  /**
   * Getter to streamline the creation of updated Context instances
   */
  private get contextOpts(): IArcGISContextOptions {
    const contextOpts: IArcGISContextOptions = {
      id: this.id,
      portalUrl: this._portalUrl,
      hubUrl: this._hubUrl,
    };
    if (this._authentication) {
      contextOpts.authentication = this._authentication;
    }
    if (this._portalSelf) {
      contextOpts.portalSelf = this._portalSelf;
    }
    if (this._currentUser) {
      contextOpts.currentUser = this._currentUser;
    }
    return contextOpts;
  }
}
