import { IUser } from "@esri/arcgis-rest-types";
import { addGroupMembers } from "../../src/groups/addGroupMembers";
import * as autoAddUsersModule from "../../src/groups/autoAddUsers";
import * as inviteUsersModule from "../../src/groups/inviteUsers";
import { MOCK_AUTH } from "../mocks/mock-auth";

describe("addGroupMembers: ", () => {
  let addGroupUsersSpy: jasmine.Spy;
  let inviteGroupUsersSpy: jasmine.Spy;

  beforeEach(() => {
    addGroupUsersSpy = spyOn(autoAddUsersModule, "autoAddUsers");
    inviteGroupUsersSpy = spyOn(inviteUsersModule, "inviteUsers");
  });

  afterEach(() => {
    addGroupUsersSpy.calls.reset();
    inviteGroupUsersSpy.calls.reset();
  });

  it("Adds members to group when autoAdd is true", async () => {
    addGroupUsersSpy.and.callFake(() => Promise.resolve({ success: true }));
    const result = await addGroupMembers(
      "abc123",
      ["bob", "frank"],
      MOCK_AUTH,
      true
    );
    expect(addGroupUsersSpy).toHaveBeenCalled();
    expect(inviteGroupUsersSpy).not.toHaveBeenCalled();
    expect(result.added.length).toEqual(2);
    expect(result.notAdded.length).toEqual(0);
    expect(result.responses.length).toEqual(2);
  });

  it("Adds members to group when autoAdd is true and falls back to invite if add fails", async () => {
    addGroupUsersSpy.and.callFake((groupId: string, users: IUser[]) => {
      if (users[0].username === "bob") {
        return Promise.resolve({ notAdded: ["bob"] });
      }
      return Promise.resolve({ success: true });
    });
    inviteGroupUsersSpy.and.callFake(() => Promise.resolve({ success: true }));
    const result = await addGroupMembers(
      "abc123",
      ["bob", "frank"],
      MOCK_AUTH,
      true
    );
    expect(addGroupUsersSpy).toHaveBeenCalled();
    expect(inviteGroupUsersSpy).toHaveBeenCalled();
    expect(result.added.length).toEqual(1);
    expect(result.notAdded.length).toEqual(1);
    expect(result.invited.length).toEqual(1);
    expect(result.responses.length).toEqual(2);
  });

  it("Invites members to group when autoAdd is false", async () => {
    inviteGroupUsersSpy.and.callFake((groupId: string, users: IUser[]) => {
      if (users[0].username === "bob") {
        return Promise.resolve({ notAdded: ["bob"] });
      }
      return Promise.resolve({ success: true });
    });
    const result = await addGroupMembers(
      "abc123",
      ["bob", "frank"],
      MOCK_AUTH,
      false
    );
    expect(addGroupUsersSpy).not.toHaveBeenCalled();
    expect(inviteGroupUsersSpy).toHaveBeenCalled();
    expect(result.invited.length).toEqual(1);
    expect(result.notInvited.length).toEqual(1);
    expect(result.responses.length).toEqual(2);
  });
});
