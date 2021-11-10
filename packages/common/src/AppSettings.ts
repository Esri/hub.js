import { getSelf, IPortal } from "@esri/arcgis-rest-portal";
import { IUser, UserSession } from "@esri/arcgis-rest-auth";

import { getProp, getWithDefault } from ".";

export interface IAppOptions extends Record<string, any> {
  authentication?: UserSession;
  portalUrl?: string;
}

export class AppSettings {
  private _authentication: UserSession;
  private _portalUrl: string;
  private _hubUrl: string;
  private _portalSelf: IPortal;
  private _currentUser: IUser;

  private constructor(opts: IAppOptions) {
    if (opts.authentication) {
      this._authentication = opts.authentication;
      this._portalUrl = this._authentication.portal;
      this._hubUrl = getHubApiFromPortalUrl(this._portalUrl);
    } else if (opts.portalUrl) {
      this._portalUrl = opts.portalUrl;
      this._hubUrl = getHubApiFromPortalUrl(this._portalUrl);
    } else {
      opts.env = opts.env || "prod";
      this._portalUrl = getProp(envMap, `${opts.env}.portal`);
      this._hubUrl = getProp(envMap, `${opts.env}.hub`);
    }
  }

  /**
   * Static async Factory
   * @param opts
   * @returns
   */
  public static async create(opts: IAppOptions) {
    const s = new AppSettings(opts);
    await s.initialize();
    return s;
  }

  private async initialize() {
    if (this._authentication) {
      const ps = await getSelf({ authentication: this._authentication });
      this._portalSelf = ps;
      this._currentUser = ps.currentUser;
    }
  }
  // Set authentication after the instance is up and running
  async setAuthentication(auth: UserSession) {
    this._authentication = auth;
    this._portalUrl = auth.portal;
    this.initialize();
  }

  // ==============================
  // Getters / Computed Properties
  // ==============================
  // All these props should derive their values
  // based on other state of the object
  public get portalUrl(): string {
    return this._portalUrl;
  }
  public get sharingApiUrl(): string {
    return `${this._portalUrl}/sharing/rest`;
  }
  public get hubUrl(): string {
    return this._hubUrl;
  }
  // Deprecate isPortal but until we can do that
  // this is a stand-in and will warn in console
  // which will be important if/when we rework
  // session/appSettings service to lean into this class
  public get isPortal(): boolean {
    console.warn(
      `AppSettings.isPortal is deprecated and will be removed at the next major release.`
    );
    if (this._portalSelf) {
      return this._portalSelf.isPortal;
    } else {
      return this._portalUrl.indexOf("arcgis.com") === -1;
    }
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
  // returns `{serviceId: "3ef..", publicViewId: "bc3..."}
  public get eventsConfig() {
    if (this._portalSelf) {
      return getProp(this._portalSelf, "portalProperties.hub.settings.events");
    }
  }

  public get hubEnabled(): boolean {
    return getWithDefault(
      this._portalSelf,
      "portalProperties.hub.enabed",
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
  public get helperServices() {
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

// Mapping from a simple environment name to urls
const envMap = {
  prod: {
    portal: "https://www.arcgis.com",
    hub: "https://hub.arcgis.com",
  },
  qa: {
    portal: "https://qaext.arcgis.com",
    hub: "https://hubqa.arcgis.com",
  },
  dev: {
    portal: "https://devext.arcgis.com",
    hub: "https://hubdev.arcgis.com",
  },
};
