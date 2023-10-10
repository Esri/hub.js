import { getSelf, getUser, IPortal } from "@esri/arcgis-rest-portal";
import { exchangeToken, IUser, UserSession } from "@esri/arcgis-rest-auth";
import {
  ArcGISContext,
  IArcGISContext,
  IArcGISContextOptions,
} from "./ArcGISContext";

import { getHubApiFromPortalUrl } from "./urls/getHubApiFromPortalUrl";
import { getPortalBaseFromOrgUrl } from "./urls/getPortalBaseFromOrgUrl";
import { Level, Logger } from "./utils/logger";
import { HubServiceStatus } from "./core";
import { cloneObject } from "./util";
import { base64ToUnicode, unicodeToBase64 } from "./utils/encoding";
import { IFeatureFlags } from "./permissions";
import { IHubTrustedOrgsResponse } from "./types";
import { request } from "@esri/arcgis-rest-request";
import { failSafe } from "./utils/fail-safe";

export type UserResourceApp = "self" | "hubforarcgis" | "arcgisonline";

// Passed into ContextManager, specifying what exchangeToken calls
// should be made
export interface IUserResourceConfig {
  app: UserResourceApp;
  clientId: string;
}

// After exchangeToken call is successful, this is the structure
// stored in the context.userResourceTokens prop
export interface IUserResourceToken extends IUserResourceConfig {
  token: string;
}

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

  /**
   * Optional hash of feature flags
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
   * Array of app, clientId's that Context Manager should
   * exchange tokens for
   */
  resourceConfigs?: IUserResourceConfig[];

  /**
   * Array of app, clientId, token objects which Context
   * Manager has exchanged tokens for
   */
  resourceTokens?: IUserResourceToken[];
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

  private _properties: Record<string, any> = {};

  private _hubUrl: string;

  private _portalSelf: IPortal;

  private _currentUser: IUser;

  private _logLevel: Level = Level.error;

  private _serviceStatus: HubServiceStatus;

  private _featureFlags: IFeatureFlags = {};

  private _trustedOrgIds: string[];

  private _trustedOrgs: IHubTrustedOrgsResponse[];

  private _resourceConfigs: IUserResourceConfig[] = [];

  private _resourceTokens: IUserResourceToken[] = [];

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
    // Default to the Alpha orgs defined in Hub.js unless
    // other values are passed in
    if (!this._properties.alphaOrgs) {
      this._properties.alphaOrgs = [...ALPHA_ORGS];
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

    if (opts.featureFlags) {
      this._featureFlags = cloneObject(opts.featureFlags);
    }

    if (opts.trustedOrgIds) {
      this._trustedOrgIds = cloneObject(opts.trustedOrgIds);
    }

    if (opts.trustedOrgs) {
      this._trustedOrgs = cloneObject(opts.trustedOrgs);
    }

    if (opts.resourceConfigs) {
      this._resourceConfigs = opts.resourceConfigs;
    }
    if (opts.resourceTokens) {
      this._resourceTokens = opts.resourceTokens;
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
        if (state.trustedOrgIds) {
          opts.trustedOrgIds = state.trustedOrgIds;
        }
        if (state.trustedOrgs) {
          opts.trustedOrgs = state.trustedOrgs;
        }
      }
    } else {
      // if the session is expired, we can still carry forward the portalUrl
      // we don't need this when auth is passed b/c it will use that instead
      // of portalUrl
      opts.portalUrl = state.portalUrl;
    }
    // service status and feature flags are safe to carry forward even if session is expired
    opts.serviceStatus = state.serviceStatus;
    opts.featureFlags = state.featureFlags;

    opts.resourceConfigs = state.resourceConfigs;
    opts.resourceTokens = state.resourceTokens;

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
    // Clear the auth related props
    this._authentication = null;
    this._portalSelf = null;
    this._currentUser = null;
    this._resourceTokens = [];
    // re-create the context
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
      featureFlags: this._featureFlags,
      properties: this._properties,
      resourceConfigs: this._resourceConfigs,
      resourceTokens: this._resourceTokens,
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

    if (this._trustedOrgIds) {
      state.trustedOrgIds = this._trustedOrgIds;
    }
    if (this._trustedOrgs) {
      state.trustedOrgs = this._trustedOrgs;
    }

    return unicodeToBase64(JSON.stringify(state));
  }

  /**
   * If we have a UserSession, fetch portal/self and
   * store that along with current user
   */
  private async initialize(): Promise<void> {
    // setup array to hold promises and one to track promise index
    const promises: Array<Promise<any>> = [];
    const promiseKeys: string[] = [];
    // We always want service status if it's not passed in
    if (!this._serviceStatus) {
      promises.push(getServiceStatus(this._portalUrl));
      promiseKeys.push("serviceStatus");
    }
    // Other info is only relevant if we have authentication
    // and we only want to fetch the info, if it was not passed in
    if (this._authentication) {
      const token = await this._authentication.getToken(
        this._authentication.portal
      );

      if (!this._portalSelf) {
        promises.push(getSelf({ authentication: this._authentication }));
        promiseKeys.push("portal");
      }
      if (!this._currentUser) {
        const username = this._authentication.username;
        promises.push(
          getUser({ username, authentication: this._authentication })
        );
        promiseKeys.push("user");
      }
      if (!this._trustedOrgs) {
        promises.push(getTrustedOrgs(this._portalUrl, this._authentication));
        promiseKeys.push("trustedOrgs");
      }
      if (!this._resourceTokens.length && this._resourceConfigs.length) {
        promises.push(
          getUserResourceTokens(
            this._resourceConfigs,
            token,
            this._portalUrl + "/sharing/rest"
          )
        );
        promiseKeys.push("tokens");
      }
      // always add "self" to resourceTokens
      this._resourceTokens.push({
        app: "self",
        token,
        clientId: this._authentication.clientId || "self",
      });
    }
    // Await promises
    let results: any[];
    try {
      results = await Promise.all(promises);
    } catch (ex) {
      const msg = `ArcGISContextManager failed while initializing for "${this._authentication.username}" using ${this._authentication.portal}.`;
      Logger.error(msg);
      // tslint:disable-next-line:no-console
      console.error(msg);
      throw ex;
    }

    // iterate the keys, assigning values into private fields
    promiseKeys.forEach((key: string, idx: number) => {
      const result = results[idx];
      switch (key) {
        case "portal":
          this._portalSelf = result as IPortal;
          break;
        case "user":
          this._currentUser = result as IUser;
          break;
        case "trustedOrgs":
          this._trustedOrgs = result as IHubTrustedOrgsResponse[];
          this._trustedOrgIds = getTrustedOrgIds(this._trustedOrgs);
          break;
        case "tokens":
          this._resourceTokens = [
            ...this._resourceTokens,
            ...(result as IUserResourceToken[]),
          ];
          break;
        case "serviceStatus":
          this._serviceStatus = result as HubServiceStatus;
          break;
      }
    });

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
      featureFlags: this._featureFlags,
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
    if (this._trustedOrgIds) {
      contextOpts.trustedOrgIds = this._trustedOrgIds;
    }
    if (this._trustedOrgs) {
      contextOpts.trustedOrgs = this._trustedOrgs;
    }

    contextOpts.userResourceTokens = this._resourceTokens;

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

/**
 * Get trusted orgs w/ a failSafe to return an empty array
 */
async function getTrustedOrgs(
  _portalUrl: string,
  _authentication: UserSession
): Promise<IHubTrustedOrgsResponse[]> {
  const failSafeTrustedOrgs = failSafe(request, { trustedOrgs: [] });
  const trustedOrgs = await failSafeTrustedOrgs(
    `${_portalUrl}/sharing/rest/portals/self/trustedOrgs?f=json`,
    {
      params: {
        token: _authentication.token,
      },
    }
  );
  return trustedOrgs.trustedOrgs;
}

/**
 * Extract trustedOrg ids from trustedOrgs response
 */
function getTrustedOrgIds(trustedOrgs: IHubTrustedOrgsResponse[]): string[] {
  return trustedOrgs.map((org) => org.to.orgId);
}

async function getUserResourceTokens(
  configs: IUserResourceConfig[],
  currentToken: string,
  portalUrl: string
): Promise<IUserResourceToken[]> {
  // failSafe exchangeToken so we don't have to catch
  const failSafeExchange = failSafe(exchangeToken, null);
  const promises = configs.map((cfg) => {
    return failSafeExchange(currentToken, cfg.clientId, portalUrl).then(
      (token) => {
        if (token) {
          return { ...cfg, token } as IUserResourceToken;
        }
      }
    );
  });
  return Promise.all(promises);
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

const DEV_ALPHA_ORGS = [
  "LjjARY1mkhxulWPq",
  "q2ikdtW0bkt5EgtQ",
  "yHYVvboBBOdmcKci",
];
const QA_ALPHA_ORGS = [
  "97KLIFOSt5CxbiRI",
  "MiFBHFxEZWumnKCx",
  "8HRYeOqprj872mxP",
  "Xj56SBi2udA78cC9",
];
const PROD_ALPHA_ORGS = [
  "gGHDlz6USftL5Pau",
  "CrA5hYOKgL3Vwan8",
  "zj227gjeSqEyG4HF",
  "bkrWlSKcjUDFDtgw",
];

export const ALPHA_ORGS = [
  ...PROD_ALPHA_ORGS,
  ...QA_ALPHA_ORGS,
  ...DEV_ALPHA_ORGS,
];
