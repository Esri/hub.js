import { getUserCreatableTeams } from "../../src/utils/get-user-creatable-teams";

describe("getUserCreatableTeams", () => {
  it("respects product and privs", () => {
    const user = {
      privileges: [
        "portal:user:createGroup",
        "portal:admin:updateGroups",
        "portal:admin:createUpdateCapableGroup",
        "opendata:user:designateGroup"
      ]
    };
    expect(getUserCreatableTeams(user, "premium", "8.4").length).toBe(
      5,
      "Premium, all privs, should be 5 creatable team types"
    );
    expect(getUserCreatableTeams(user, "basic", "8.4").length).toBe(
      3,
      "Basic, all privs, should be 3 creatable team types"
    );
    expect(getUserCreatableTeams(user, "portal", "8.4").length).toBe(
      3,
      "Portal, all privs, should be 3 creatable team types"
    );

    // remove updateGroups...
    user.privileges = [
      "portal:user:createGroup",
      "opendata:user:designateGroup"
    ];
    expect(getUserCreatableTeams(user, "premium", "8.4").length).toBe(
      4,
      "Premium, all privs, should be 5 creatable team types"
    );
    expect(getUserCreatableTeams(user, "basic", "8.4").length).toBe(
      2,
      "Basic, all privs, should be 3 creatable team types"
    );
    expect(getUserCreatableTeams(user, "portal", "8.4").length).toBe(
      2,
      "Portal, all privs, should be 3 creatable team types"
    );

    // clear all privs and we should not get any groups back...
    user.privileges = [];
    expect(getUserCreatableTeams(user, "premium", "8.4").length).toBe(
      0,
      "no groups should be created if user lacks all privs"
    );
    expect(getUserCreatableTeams(user, "basic", "8.4").length).toBe(
      0,
      "no groups should be created if user lacks all privs"
    );
    expect(getUserCreatableTeams(user, "portal", "8.4").length).toBe(
      0,
      "no groups should be created if user lacks all privs"
    );
  });
});
