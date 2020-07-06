import { canUserCreateTeam } from "../../src";
import { IHubRequestOptions } from "@esri/hub-common";
import { IUser } from "@esri/arcgis-rest-auth";
import * as getUserCreatableTeamsModule from "../../src/teams/get-user-creatable-teams";

describe("Name of the group", () => {
  it("returns false when user belongs to more than 509 groups", () => {
    const ro = {
      portalSelf: {
        id: "some-id",
        isPortal: false,
        name: "some name"
      }
    } as IHubRequestOptions;

    const spy = spyOn(
      getUserCreatableTeamsModule,
      "getUserCreatableTeams"
    ).and.returnValue([{ config: { type: "core" } }]);

    const user = {
      groups: new Array(600).fill("grp")
    } as IUser;

    expect(canUserCreateTeam(user, "followers", ro)).toBeFalsy();
    expect(spy).not.toHaveBeenCalled();
  });

  it("delegates to getUserCreatableTeams otherwise", () => {
    const ro = {
      portalSelf: {
        id: "some-id",
        isPortal: false,
        name: "some name"
      }
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
