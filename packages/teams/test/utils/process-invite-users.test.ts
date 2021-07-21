import { processInviteUsers } from "../../src/utils/process-invite-users";
import { MOCK_AUTH } from "../fixtures";
import * as commonModule from "@esri/hub-common";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { IAddOrInviteContext } from "../../src/types";

describe("processInviteUsers: ", () => {
  let inviteUsersSpy: jasmine.Spy;

  beforeEach(() => {
    inviteUsersSpy = spyOn(commonModule, "inviteUsers");
  });
  afterEach(() => {
    inviteUsersSpy.calls.reset();
  });
  it("flows through happy path...", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [{ username: "bob" }, { username: "frank" }],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: undefined,
      world: [{ username: "bob" }, { username: "frank" }],
      org: [],
      community: [{ username: "bob" }, { username: "frank" }],
    };
    inviteUsersSpy.and.callFake(() => Promise.resolve({ success: true }));
    const result = await processInviteUsers(context, "community");
    expect(inviteUsersSpy).toHaveBeenCalled();
    expect(inviteUsersSpy.calls.count()).toEqual(2);
    expect(result.users.length).toEqual(2);
    expect(result.notInvited.length).toEqual(0);
    expect(result.errors.length).toEqual(0);
  });
  it("handles matters when success is false.", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [{ username: "bob" }, { username: "frank" }],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: undefined,
      world: [{ username: "bob" }, { username: "frank" }],
      org: [],
      community: [{ username: "bob" }, { username: "frank" }],
    };
    inviteUsersSpy.and.callFake(() => Promise.resolve({ success: false }));
    const result = await processInviteUsers(context, "community");
    expect(inviteUsersSpy).toHaveBeenCalled();
    expect(inviteUsersSpy.calls.count()).toEqual(2);
    expect(result.users.length).toEqual(2);
    expect(result.notInvited.length).toEqual(2);
    expect(result.errors.length).toEqual(0);
  });
  it("handles matters when errors are returned.", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [{ username: "bob" }, { username: "frank" }],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: undefined,
      world: [{ username: "bob" }, { username: "frank" }],
      org: [],
      community: [{ username: "bob" }, { username: "frank" }],
    };
    const error = new ArcGISRequestError("Email not sent");
    inviteUsersSpy.and.callFake(() =>
      Promise.resolve({ success: false, errors: [error] })
    );
    const result = await processInviteUsers(context, "community");
    expect(inviteUsersSpy).toHaveBeenCalled();
    expect(inviteUsersSpy.calls.count()).toEqual(2);
    expect(result.users.length).toEqual(2);
    expect(result.notInvited.length).toEqual(2);
    expect(result.errors.length).toEqual(2);
  });
});
