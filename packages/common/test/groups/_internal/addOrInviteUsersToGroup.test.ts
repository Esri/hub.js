import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import {
  IAddOrInviteEmail,
  IAddOrInviteResponse,
  IUserWithOrgType,
} from "../../../src/groups/types";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { addOrInviteUsersToGroup } from "../../../src/groups/_internal/addOrInviteUsersToGroup";
import * as utilsModule from "../../../src/groups/_internal/AddOrInviteUsersToGroupUtils";

describe("addOrInviteUsersToGroup: ", () => {
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
    const users: IUserWithOrgType[] = [
      { orgType: "world", username: "bob" },
      { orgType: "world", username: "bobb" },
      { orgType: "world", username: "bobbb" },
      { orgType: "org", username: "frank" },
      { orgType: "org", username: "frankk" },
      { orgType: "community", username: "dobby" },
    ];
    const error = new ArcGISRequestError("error in addOrInviteUsersToGroup");
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
    const response = await addOrInviteUsersToGroup(
      "abc123",
      users,
      MOCK_AUTH,
      false,
      false,
      undefined as unknown as IAddOrInviteEmail
    );
    expect(addOrInviteCommunityUsersSpy).toHaveBeenCalled();
    expect(addOrInviteOrgUsersSpy).toHaveBeenCalled();
    expect(addOrInviteWorldUsersSpy).toHaveBeenCalled();
    expect(response.notAdded.length).toEqual(2);
    expect(response.notInvited.length).toEqual(2);
    expect(response.notEmailed.length).toEqual(1);
    expect(response.errors.length).toEqual(4);
    expect(response.groupId).toEqual("abc123");
  });
});
