/**
 * Portal Priviledges required to set group access to specific levels
 */
export const GROUP_ACCESS_PRIVS = {
  public: ["portal:user:createGroup", "portal:user:shareGroupToPublic"],
  org: ["portal:user:createGroup", "portal:user:shareGroupToOrg"],
  private: ["portal:user:createGroup"],
};
