import { addOrInviteUsersToTeam } from "../src/add-or-invite-users-to-team";
import { MOCK_AUTH } from "./fixtures";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { IAddOrInviteResponse } from "../src/types";
import * as utilsModule from "../src/utils";

describe("addOrInviteUsersToTeam: ", () => {
  let addOrInviteCommunityUsersSpy: jasmine.Spy;
  let addOrInviteOrgUsersSpy: jasmine.Spy;
  let addOrInviteWorldUsersSpy: jasmine.Spy;

  beforeEach(() => {
    addOrInviteCommunityUsersSpy = spyOn(
      utilsModule,
      "addOrInviteCommunityUsers"
    );
    addOrInviteOrgUsersSpy = spyOn(utilsModule, "addOrInviteOrgUsers");
    addOrInviteWorldUsersSpy = spyOn(utilsModule, "addOrInviteWorldUsers");
  });

  afterEach(() => {
    addOrInviteCommunityUsersSpy.calls.reset();
    addOrInviteOrgUsersSpy.calls.reset();
    addOrInviteWorldUsersSpy.calls.reset();
  });

  it("all works...", async () => {
    const users = [
      { modelType: "world", username: "bob" },
      { modelType: "world", username: "bobb" },
      { modelType: "world", username: "bobbb" },
      { modelType: "org", username: "frank" },
      { modelType: "org", username: "frankk" },
      { modelType: "community", username: "dobby" },
    ];
    const error = new ArcGISRequestError("error in addOrInviteUsersToTeam");
    addOrInviteCommunityUsersSpy.and.callFake(() => {
      const result: IAddOrInviteResponse = {
        users: [],
        notInvited: [],
        notAdded: ["dobby"],
        notEmailed: ["dobby"],
        errors: [error, error],
      };
      return Promise.resolve(result);
    });
    addOrInviteOrgUsersSpy.and.callFake(() => {
      const result: IAddOrInviteResponse = {
        users: [],
        notInvited: [],
        notAdded: ["frank"],
        notEmailed: [],
        errors: [],
      };
      return Promise.resolve(result);
    });
    addOrInviteWorldUsersSpy.and.callFake(() => {
      const result: IAddOrInviteResponse = {
        users: [],
        notInvited: ["bob", "bobb"],
        notAdded: [],
        notEmailed: [],
        errors: [error, error],
      };
      return Promise.resolve(result);
    });
    const response = await addOrInviteUsersToTeam(
      "abc123",
      users,
      MOCK_AUTH,
      false,
      false,
      undefined
    );
    expect(addOrInviteCommunityUsersSpy).toHaveBeenCalled();
    expect(addOrInviteOrgUsersSpy).toHaveBeenCalled();
    expect(addOrInviteWorldUsersSpy).toHaveBeenCalled();
    expect(response.notAdded.length).toEqual(2);
    expect(response.notInvited.length).toEqual(2);
    expect(response.notEmailed.length).toEqual(1);
    expect(response.errors.length).toEqual(4);
  });
});
