import type { IUser } from "@esri/arcgis-rest-portal";
import { addGroupMembers } from "../../src/groups/addGroupMembers";
import * as autoAddUsersModule from "../../src/groups/autoAddUsers";
import * as inviteUsersModule from "../../src/groups/inviteUsers";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("addGroupMembers: ", () => {
  let addGroupUsersSpy: any;
  let inviteGroupUsersSpy: any;

  beforeEach(() => {
    addGroupUsersSpy = vi.spyOn(autoAddUsersModule, "autoAddUsers");
    inviteGroupUsersSpy = vi.spyOn(inviteUsersModule, "inviteUsers");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Adds members to group when autoAdd is true", async () => {
    addGroupUsersSpy.mockResolvedValue({ success: true });
    const result = await addGroupMembers(
      "abc123",
      ["bob", "frank"],
      {
        authentication: MOCK_AUTH,
      },
      true
    );
    expect(addGroupUsersSpy).toHaveBeenCalled();
    expect(inviteGroupUsersSpy).not.toHaveBeenCalled();
    expect(result.added.length).toEqual(2);
    expect(result.notAdded.length).toEqual(0);
    expect(result.responses.length).toEqual(2);
  });

  it("Adds members to group when autoAdd is true and falls back to invite if add fails", async () => {
    addGroupUsersSpy.mockImplementation((groupId: string, users: IUser[]) => {
      if (users[0].username === "bob") {
        return Promise.resolve({ notAdded: ["bob"] });
      }
      return Promise.resolve({ success: true });
    });
    inviteGroupUsersSpy.mockResolvedValue({ success: true });
    const result = await addGroupMembers(
      "abc123",
      ["bob", "frank"],
      {
        authentication: MOCK_AUTH,
      },
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
    inviteGroupUsersSpy.mockImplementation(
      (groupId: string, users: IUser[]) => {
        if (users[0].username === "bob") {
          return Promise.resolve({ notAdded: ["bob"] });
        }
        return Promise.resolve({ success: true });
      }
    );
    const result = await addGroupMembers(
      "abc123",
      ["bob", "frank"],
      {
        authentication: MOCK_AUTH,
      },
      false
    );
    expect(addGroupUsersSpy).not.toHaveBeenCalled();
    expect(inviteGroupUsersSpy).toHaveBeenCalled();
    expect(result.invited.length).toEqual(1);
    expect(result.notInvited.length).toEqual(1);
    expect(result.responses.length).toEqual(2);
  });
});
