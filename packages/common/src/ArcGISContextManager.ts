import { getSelf, getUser, IPortal } from "@esri/arcgis-rest-portal";
import { IUser, UserSession } from "@esri/arcgis-rest-auth";
import {
  ArcGISContext,
  IArcGISContext,
  IArcGISContextOptions,
} from "./ArcGISContext";

import { getHubApiFromPortalUrl } from "./urls/getHubApiFromPortalUrl";
import { getPortalBaseFromOrgUrl } from "./urls/getPortalBaseFromOrgUrl";
import { Level, Logger } from "./utils/logger";
import { HubService, HubServiceStatus } from "./core";
import { cloneObject } from "./util";
import { base64ToUnicode, unicodeToBase64 } from "./utils/encoding";

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
   * Any additional properties to expose on the context. This allows
   * an application to send additional context into the system.
   * For example, in ArcGIS Hub, many times we want to pass in the
   * active "Hub Site" as additional context, so we will send that in
   * as a node on a properties object.
   */
  properties?: Record<string, any>;

  /**
   * Logging level
   * off > error > warn > info > debug > all
   * defaults to 'error'
   */
  logLevel?: Level;

  /**
   * Option to pass in service status vs fetching it
   */
  serviceStatus?: HubServiceStatus;
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

  private _properties: Record<string, any>;

  private _hubUrl: string;

  private _portalSelf: IPortal;

  private _currentUser: IUser;

  private _logLevel: Level = Level.error;

  private _serviceStatus: HubServiceStatus;

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

    if (opts.properties) {
      this._properties = opts.properties;
    }

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

    if (opts.serviceStatus) {
      this._serviceStatus = opts.serviceStatus;
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
   * Create a new instance of the ArcGISContextManager from a serialized
   * string. This is useful when you want to store the context in a
   * browser's local storage or server side session.
   * @param serializedContext
   * @returns
   */
  public static async deserialize(
    serializedContext: string
  ): Promise<ArcGISContextManager> {
    const decoded = base64ToUnicode(serializedContext);

    const state: Partial<IArcGISContextManagerOptions> & {
      session?: string;
    } = JSON.parse(decoded);

    // create opts and populate from state
    const opts: IArcGISContextManagerOptions = {
      portalUrl: state.portalUrl,
    };
    if (state.session) {
      // re-create the session
      const userSession = UserSession.deserialize(state.session);
      // if the session is still valid, use it and the other properties
      if (userSession.tokenExpires.getTime() > Date.now()) {
        opts.authentication = userSession;

        if (state.portal) {
          opts.portal = state.portal;
        }
        if (state.currentUser) {
          opts.currentUser = state.currentUser;
        }
        if (state.properties) {
          opts.properties = state.properties;
        }
      }
    } else {
      // if the session is expired, we can still carry forward the portalUrl
      // we don't need this when auth is passed b/c it will use that instead
      // of portalUrl
      opts.portalUrl = state.portalUrl;
    }
    // service status is safe to carry forward even if session is expired
    opts.serviceStatus = state.serviceStatus;

    return ArcGISContextManager.create(opts);
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
   * Set the properties hash and re-create the context
   * @param properties
   */
  setProperties(properties: Record<string, any>): void {
    this._properties = properties;
    this._context = new ArcGISContext(this.contextOpts);
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
    this._context = new ArcGISContext(this.contextOpts);
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
   * Serialize the context into a string that can be stored
   * in a browser's local storage or server side session
   *
   * @returns encoded string representation of the context
   */
  serialize(): string {
    const state: Partial<IArcGISContextManagerOptions> & {
      session?: string;
    } = {
      portalUrl: this._portalUrl,
      serviceStatus: this._serviceStatus,
    };

    if (this._authentication) {
      state.session = this._authentication.serialize();
    }
    if (this._portalSelf) {
      state.portal = this._portalSelf;
    }
    if (this._currentUser) {
      state.currentUser = this._currentUser;
    }
    if (this._properties) {
      state.properties = this._properties;
    }

    return unicodeToBase64(JSON.stringify(state));
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
    // get service status
    if (!this._serviceStatus) {
      this._serviceStatus = await getServiceStatus(this._portalUrl);
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
      properties: this._properties,
      serviceStatus: this._serviceStatus,
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

function getServiceStatus(portalUrl: string): Promise<HubServiceStatus> {
  let status = HUB_SERVICE_STATUS;
  const isPortal = portalUrl.indexOf("arcgis.com") === -1;
  // When we move to fetching the system status from the API
  // we can use
  // const hubApiUrl = getHubApiFromPortalUrl(portalUrl);
  if (isPortal) {
    status = ENTERPRISE_SITES_SERVICE_STATUS;
  }

  return Promise.resolve(status);
}

const HUB_SERVICE_STATUS: HubServiceStatus = {
  portal: "online",
  discussions: "online",
  events: "online",
  metrics: "online",
  notifications: "online",
  "hub-search": "online",
  domains: "online",
};

const ENTERPRISE_SITES_SERVICE_STATUS: HubServiceStatus = {
  portal: "online",
  discussions: "not-available",
  events: "not-available",
  metrics: "not-available",
  notifications: "not-available",
  "hub-search": "not-available",
  domains: "not-available",
};
