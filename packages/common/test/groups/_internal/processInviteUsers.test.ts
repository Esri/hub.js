import {
  IAddOrInviteContext,
  IAddOrInviteEmail,
} from "../../../src/groups/types";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as inviteUsersModule from "../../../src/groups/inviteUsers";
import { processInviteUsers } from "../../../src/groups/_internal/processInviteUsers";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";

describe("processInviteUsers: ", () => {
  let inviteUsersSpy: jasmine.Spy;

  beforeEach(() => {
    inviteUsersSpy = spyOn(inviteUsersModule, "inviteUsers");
  });
  afterEach(() => {
    inviteUsersSpy.calls.reset();
  });
  it("flows through happy path...", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [
        { orgType: "world", username: "bob" },
        { orgType: "world", username: "frank" },
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: undefined as unknown as IAddOrInviteEmail,
      world: [
        { orgType: "world", username: "bob" },
        { orgType: "world", username: "frank" },
      ],
      org: [],
      community: [
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      partnered: [],
      collaborationCoordinator: [],
    };
    inviteUsersSpy.and.callFake(() => Promise.resolve({ success: true }));
    const result = await processInviteUsers(context, "community");
    expect(inviteUsersSpy).toHaveBeenCalled();
    expect(inviteUsersSpy.calls.count()).toEqual(2);
    expect(inviteUsersSpy.calls.argsFor(0)[4]).toEqual("group_member");
    expect(inviteUsersSpy.calls.argsFor(1)[4]).toEqual("group_member");
    expect(result.users.length).toEqual(2);
    expect(result.notInvited.length).toEqual(0);
    expect(result.errors.length).toEqual(0);
  });
  it("flows through happy path...when inviting as admin", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [
        { orgType: "world", username: "bob" },
        { orgType: "world", username: "frank" },
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      canAutoAddUser: false,
      addUserAsGroupAdmin: true,
      email: undefined as unknown as IAddOrInviteEmail,
      world: [
        { orgType: "world", username: "bob" },
        { orgType: "world", username: "frank" },
      ],
      org: [],
      community: [
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      partnered: [],
      collaborationCoordinator: [],
    };
    inviteUsersSpy.and.callFake(() => Promise.resolve({ success: true }));
    const result = await processInviteUsers(context, "community");
    expect(inviteUsersSpy).toHaveBeenCalled();
    expect(inviteUsersSpy.calls.count()).toEqual(2);
    expect(inviteUsersSpy.calls.argsFor(0)[4]).toEqual("group_admin");
    expect(inviteUsersSpy.calls.argsFor(1)[4]).toEqual("group_admin");
    expect(result.users.length).toEqual(2);
    expect(result.notInvited.length).toEqual(0);
    expect(result.errors.length).toEqual(0);
  });
  it("handles matters when success is false.", async () => {
    const context: IAddOrInviteContext = {
      groupId: "abc123",
      primaryRO: MOCK_AUTH,
      allUsers: [
        { orgType: "world", username: "bob" },
        { orgType: "world", username: "frank" },
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: undefined as unknown as IAddOrInviteEmail,
      world: [
        { orgType: "world", username: "bob" },
        { orgType: "world", username: "frank" },
      ],
      org: [],
      community: [
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      partnered: [],
      collaborationCoordinator: [],
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
      allUsers: [
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
        { orgType: "world", username: "bob" },
        { orgType: "world", username: "frank" },
      ],
      canAutoAddUser: false,
      addUserAsGroupAdmin: false,
      email: undefined as unknown as IAddOrInviteEmail,
      world: [
        { orgType: "world", username: "bob" },
        { orgType: "world", username: "frank" },
      ],
      org: [],
      community: [
        { orgType: "community", username: "bob" },
        { orgType: "community", username: "frank" },
      ],
      partnered: [],
      collaborationCoordinator: [],
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
