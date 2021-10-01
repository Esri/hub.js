import { canUserCreateTeam } from "../../../src/teams/utils/can-user-create-team";
import { IHubRequestOptions } from "../../../src";
import { IUser, UserSession } from "@esri/arcgis-rest-auth";
import * as getUserCreatableTeamsModule from "../../../src/teams/utils/get-user-creatable-teams";

describe("Name of the group", () => {
  it("returns false when user belongs to more than 509 groups", () => {
    const ro = {
      portalSelf: {
        id: "some-id",
        isPortal: false,
        name: "some name",
      },
    } as IHubRequestOptions;

    const spy = spyOn(
      getUserCreatableTeamsModule,
      "getUserCreatableTeams"
    ).and.returnValue([{ config: { type: "core" } }]);

    const user = {
      groups: new Array(600).fill("grp"),
    } as IUser;

    expect(canUserCreateTeam(user, "followers", ro)).toBeFalsy();
    expect(spy).not.toHaveBeenCalled();
  });

  it("delegates to getUserCreatableTeams otherwise", () => {
    const ro = {
      isPortal: false,
      hubApiUrl: "",
      portalSelf: {
        id: "some-id",
        isPortal: false,
        name: "some name",
        subscriptionInfo: {
          type: "In House",
        },
      },
      authentication: {} as UserSession,
    } as IHubRequestOptions;

    const spy = spyOn(
      getUserCreatableTeamsModule,
      "getUserCreatableTeams"
    ).and.returnValue([{ config: { type: "core" } }]);

    const user = {} as IUser;

    expect(canUserCreateTeam(user, "core", ro)).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });
});
