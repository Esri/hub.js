import {
  IUser,
  IUserRequestOptions,
  UserSession,
} from "@esri/arcgis-rest-auth";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getProp, getWithDefault, IHubRequestOptions } from ".";

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
 * Defined the properties of the ArcGISContext.state
 * object. This wll be a class instance, and when authentication
 * changes, the instance will be replaced. This is done to allow
 * frameworks like React or Ember to bind into the .state property
 * and react when it changes.
 */
export interface IArcGISContextState {
  id: number;
  session: UserSession;
  isAuthenticated: boolean;
  userRequestOptions: IUserRequestOptions;
  requestOptions: IRequestOptions;
  hubRequestOptions: IHubRequestOptions;
  portalUrl: string;
  sharingApiUrl: string;
  hubUrl: string;
  isPortal: boolean;
  discussionsServiceUrl: string;
  hubSearchServiceUrl: string;
  domainServiceUrl: string;
  eventsConfig: any;
  hubEnabled: boolean;
  communityOrgId: string;
  communityOrgHostname: string;
  communityOrgUrl: string;
  helperServices: any;
  currentUser: IUser;
  portal: IPortal;
}

/**
 * @internal
 */
export interface IArcGISContextStateOptions {
  id: number;
  portalUrl: string;
  hubUrl: string;
  authentication?: UserSession;
  portalSelf?: IPortal;
  currentUser?: IUser;
}

/**
 * @internal
 * Thin class just used to enable getters
 *
 * This class should not be used by anything other than
 * the ArcGISContext class
 */
export class ArcGISContextState implements IArcGISContextState {
  public id: number;
  private _authentication: UserSession;

  private _portalUrl: string = "https://www.arcgis.com";

  private _hubUrl: string;

  private _portalSelf: IPortal;

  private _currentUser: IUser;

  constructor(opts: IArcGISContextStateOptions) {
    this.id = opts.id;
    this._portalUrl = opts.portalUrl;
    this._hubUrl = opts.hubUrl;
    if (opts.authentication) {
      this._authentication = opts.authentication;
    }

    if (opts.portalSelf) {
      this._portalSelf = opts.portalSelf;
    }

    if (opts.currentUser) {
      this._currentUser = opts.currentUser;
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
