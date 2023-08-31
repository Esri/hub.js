import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import {
  IAddOrInviteToGroupResult,
  IUserWithOrgType,
} from "../../src/groups/types";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as addOrInviteUsersToGroupModule from "../../src/groups/addOrInviteUsersToGroup";
import { addOrInviteUsersToGroups } from "../../src/groups/addOrInviteUsersToGroups";

describe("addOrInviteUsersToGroups: ", () => {
  it("all works...", async () => {
    const users: IUserWithOrgType[] = [
      { orgType: "world", username: "bob" },
      { orgType: "world", username: "bobb" },
      { orgType: "world", username: "bobbb" },
      { orgType: "org", username: "frank" },
      { orgType: "org", username: "frankk" },
      { orgType: "community", username: "dobby" },
      { orgType: "partnered", username: "randy" },
      { orgType: "partnered", username: "jupe" },
      { orgType: "collaborationCoordinator", username: "freddy" },
    ];
    const error = new ArcGISRequestError("error in addOrInviteUsersToGroups");
    const addOrInviteUsersToGroupSpy = spyOn(
      addOrInviteUsersToGroupModule,
      "addOrInviteUsersToGroup"
    ).and.callFake(() => {
      const response: IAddOrInviteToGroupResult = {
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
        partnered: {
          users: ["randy", "jupe"],
          notInvited: [],
          notAdded: [],
          notEmailed: [],
          errors: [],
        },
        collaborationCoordinator: {
          users: ["freddy"],
          notInvited: [],
          notAdded: [],
          notEmailed: [],
          errors: [],
        },
      };
      return Promise.resolve(response);
    });
    const result = await addOrInviteUsersToGroups(
      ["abc123", "def456", "ghi789"],
      users,
      MOCK_AUTH
    );
    expect(addOrInviteUsersToGroupSpy).toHaveBeenCalled();
    expect(addOrInviteUsersToGroupSpy.calls.count()).toEqual(3);
    expect(result.responses.length).toEqual(3);
    expect(result.notAdded.length).toEqual(6);
    expect(result.notInvited.length).toEqual(6);
    expect(result.notEmailed.length).toEqual(3);
    expect(result.errors.length).toEqual(12);
  });
});
