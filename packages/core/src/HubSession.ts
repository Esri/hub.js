import {
  IHubRequestOptions,
  getHubApiUrl,
  getProp,
  getWithDefault,
  includes
} from "@esri/hub-common";
import { IUser, UserSession } from "@esri/arcgis-rest-auth";
import { getSelf, IGroup, IGroupAdd, IPortal } from "@esri/arcgis-rest-portal";

/**
 * HubSession contains information required for any Hub API function
 * that requires `IHubRequestOptions`.
 *
 * If you need an instance of `IHubRequestOptions` but do not have
 * a `UserSession`, use `getDefaultRequestOptions()`
 *
 * @export
 * @class HubSession
 * @implements {IHubRequestOptions}
 */
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
   * @return {Promise<HubSession>}
   * @memberof HubSession
   */
  static build(userSession: UserSession) {
    return new HubSession(userSession);
  }

  /**
   * Does the initialization work of fetching
   * - portalSelf
   * - userSelf
   * - trustedOrgs (REST-JS needs to add a method)
   * @return {Promise<HubSession>}
   * @memberof HubSession
   */
  init() {
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
  /**
   * Get the number of groups the current user is a
   * member of. Used to check if user can join
   * or create additional groups.
   *
   * @readonly
   * @memberof HubSession
   */
  get userGroupCount() {
    return this._userSelf.groups.length;
  }

  /**
   * Can the authenticated user join another group?
   * Just checks that they are members of less then
   * 511 groups
   *
   * @readonly
   * @memberof HubSession
   */
  get canJoinGroup() {
    return this.userGroupCount < 511;
  }

  /**
   * Pass in the group parameters and
   * centralize the logic for priv checks
   *
   * @param {IGroupAdd} group
   * @return {*}  {boolean}
   * @memberof HubSession
   */
  canCreateGroup(group: IGroup): boolean {
    // TODO: move to a free function that is consumed here
    if (this.userGroupCount < 511) {
      // Baseline priv to create a group
      const requiredPrivs = ["portal:user:createGroup"];
      // -----------------
      // UpdateItemControl (aka Shared Edit Groups)
      // -----------------
      let caps = [];
      // depending on exactly when this is called
      // capabilities may be a comma delimited string
      if (typeof group.capabilities === "string") {
        caps = group.capabilities.split(",");
      }
      // but it may also be an array
      if (Array.isArray(group.capabilities)) {
        caps = group.capabilities;
      }
      // we care if updateitemcontrol is in there
      if (includes(caps, "updateitemcontrol")) {
        requiredPrivs.push("portal:admin:createUpdateCapableGroup");
      }
      // -----------------
      // Membership Access
      // -----------------
      // although there are other possible values this is
      // the only one that requires additional privs
      if (group.membershipAccess === "collaboration") {
        requiredPrivs.push("portal:user:addExternalMembersToGroup");
      }

      // Does the user have all the privs
      return this.hasAllPrivs(requiredPrivs);
    } else {
      return false;
    }
  }

  /**
   * Does the current user have all the provided privileges?
   *
   * Used to streamline Group creation checks but is a useful
   * helper method for other scenarios
   *
   * @param {string[]} privs
   * @return {*}  {boolean}
   * @memberof HubSession
   */
  hasAllPrivs(privs: string[]): boolean {
    return privs.every(priv => includes(this._userSelf.privileges, priv));
  }
}
