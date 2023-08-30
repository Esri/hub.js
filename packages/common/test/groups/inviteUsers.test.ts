import * as restPortalModule from "@esri/arcgis-rest-portal";
import { inviteUsers } from "../../src/groups/inviteUsers";
import { MOCK_AUTH } from "./add-users-workflow/fixtures";

describe("invite-users", function () {
  let invitationSpy: jasmine.Spy;
  const users: restPortalModule.IUser[] = [
    { username: "harry" },
    { username: "ron" },
    { username: "hermione" },
  ];
  const groupId = "gryffindor";

  beforeEach(() => {
    invitationSpy = spyOn(restPortalModule, "inviteGroupUsers");
  });
  afterEach(() => {
    invitationSpy.calls.reset();
  });

  it("Properly delegates to inviteGroupUsers", async () => {
    invitationSpy.and.callFake(() => Promise.resolve({ success: true }));
    const result = await inviteUsers(groupId, users, MOCK_AUTH);
    expect(result).toEqual({ success: true });
    expect(invitationSpy).toHaveBeenCalled();
    const actualArgs = invitationSpy.calls.first().args;
    const expectedArgs = [
      {
        authentication: MOCK_AUTH,
        id: groupId,
        users: users.map((u) => u.username),
        role: "group_member",
        expiration: 20160,
      },
    ];
    expect(actualArgs).toEqual(expectedArgs);
  });

  it("Respects expiration overrides", async () => {
    invitationSpy.and.callFake(() => Promise.resolve({ success: true }));
    const result = await inviteUsers(groupId, users, MOCK_AUTH, 9001);
    expect(result).toEqual({ success: true });
    expect(invitationSpy).toHaveBeenCalled();
    const actualArgs = invitationSpy.calls.first().args;
    const expectedArgs = [
      {
        authentication: MOCK_AUTH,
        id: groupId,
        users: users.map((u) => u.username),
        role: "group_member",
        expiration: 9001,
      },
    ];
    expect(actualArgs).toEqual(expectedArgs);
  });

  it("Resolves to null when users array is empty", async () => {
    const result = await inviteUsers(groupId, [], MOCK_AUTH);
    expect(result).toEqual(null);
    expect(invitationSpy).not.toHaveBeenCalled();
  });
});
