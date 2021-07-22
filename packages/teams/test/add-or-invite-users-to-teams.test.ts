import { addOrInviteUsersToTeams } from "../src/add-or-invite-users-to-teams";
import { MOCK_AUTH } from "./fixtures";
import * as addOrInviteUsersToTeamModule from "../src/add-or-invite-users-to-team";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { IAddOrInviteToTeamResult, IUserWithOrgType } from "../src/types";

describe("addOrInviteUsersToTeams: ", () => {
  it("all works...", async () => {
    const users: IUserWithOrgType[] = [
      { orgType: "world", username: "bob" },
      { orgType: "world", username: "bobb" },
      { orgType: "world", username: "bobbb" },
      { orgType: "org", username: "frank" },
      { orgType: "org", username: "frankk" },
      { orgType: "community", username: "dobby" },
    ];
    const error = new ArcGISRequestError("error in addOrInviteUsersToTeams");
    const addOrInviteUsersToTeamSpy = spyOn(
      addOrInviteUsersToTeamModule,
      "addOrInviteUsersToTeam"
    ).and.callFake(() => {
      const response: IAddOrInviteToTeamResult = {
        groupId: "abc123",
        notAdded: ["dobby", "frank"],
        notInvited: ["bob", "bobb"],
        notEmailed: ["dobby"],
        errors: [error, error, error, error],
        community: {
          users: [],
          notInvited: [],
          notAdded: ["dobby"],
          notEmailed: ["dobby"],
          errors: [error, error],
        },
        org: {
          users: [],
          notInvited: [],
          notAdded: ["frank"],
          notEmailed: [],
          errors: [],
        },
        world: {
          users: [],
          notInvited: ["bob", "bobb"],
          notAdded: [],
          notEmailed: [],
          errors: [error, error],
        },
      };
      return Promise.resolve(response);
    });
    const result = await addOrInviteUsersToTeams(
      ["abc123", "def456", "ghi789"],
      users,
      MOCK_AUTH
    );
    expect(addOrInviteUsersToTeamSpy).toHaveBeenCalled();
    expect(addOrInviteUsersToTeamSpy.calls.count()).toEqual(3);
    expect(result.responses.length).toEqual(3);
    expect(result.notAdded.length).toEqual(6);
    expect(result.notInvited.length).toEqual(6);
    expect(result.notEmailed.length).toEqual(3);
    expect(result.errors.length).toEqual(12);
  });
});
