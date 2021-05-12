import {
  IHubRequestOptions,
  getHubApiUrl,
  getProp,
  getWithDefault,
  includes
} from "@esri/hub-common";
import { IUser, UserSession } from "@esri/arcgis-rest-auth";
import { getSelf, IPortal } from "@esri/arcgis-rest-portal";

export class HubSession implements IHubRequestOptions {
  // Note: can't use a getter for this or we get failures
  // from inside rest-js where object.assign is used frequently
  // and getters are not copied over
  authentication: UserSession;
  private _portalSelf: IPortal;
  private _userSelf: IUser;
  private _hubApiUrl: string;

  /**
   * Creates an instance of HubSession.
   * @param {*} opts
   * @memberof HubSession
   */
  private constructor(userSession: UserSession) {
    this.authentication = userSession;
    this._hubApiUrl = getHubApiUrl(userSession.portal);
  }

  /**
   * Creates an instance of the HubSession
   * but nothing more
   *
   * @static
   * @param {UserSession} userSession
   * @return {*}
   * @memberof HubSession
   */
  static build(userSession: UserSession) {
    return new HubSession(userSession);
  }

  /**
   * Does the initialization work of fetching
   * - portalSelf
   * - userSelf
   * -
   *
   * @return {*}
   * @memberof HubSession
   */
  async init() {
    return Promise.all([
      getSelf({
        authentication: this.authentication
      }),
      this.authentication.getUser()
    ]).then(([portalSelf, userSelf]) => {
      this._portalSelf = portalSelf;
      this._userSelf = userSelf;
      return this;
    });
  }

  /**
   * Flag indicating if the session is associated with
   * ArcGIS Online or Enterprise (aka Portal)
   *
   * @readonly
   * @memberof HubSession
   */
  get isPortal() {
    return getWithDefault(this, "_portalSelf.portal", false);
  }
  /**
   * Hub API Url
   * Will return `null` in Enterprise
   * @readonly
   * @memberof HubSession
   */
  get hubApiUrl() {
    // if portal this should be null
    if (this.isPortal) {
      return null;
    } else {
      return this._hubApiUrl;
    }
  }

  get userGroupCount() {
    return this._userSelf.groups.length;
  }

  get canCreateUpdateGroup() {
    const requiredPrivs = ["portal:admin:createUpdateCapableGroup"];
    return this.canCreateGroup && this.hasAllPrivs(requiredPrivs);
  }

  get canCreateGroup() {
    if (this.userGroupCount < 511) {
      const requiredPrivs = ["portal:user:createGroup"];
      return this.hasAllPrivs(requiredPrivs);
    } else {
      return false;
    }
  }

  hasAllPrivs(privs: string[]): boolean {
    return privs.reduce((acc: boolean, val) => {
      if (acc) {
        acc = includes(this._userSelf.privileges, val);
      }
      return acc;
    }, true);
  }
}
