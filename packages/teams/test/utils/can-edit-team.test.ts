import { canEditTeam } from "../../src/utils/can-edit-team";
import { IGroup, IUser } from "@esri/arcgis-rest-types";

describe("canEditTeam", function () {
  it("returns true if user is an admin or owner of the team", function () {
    const groupId = "foo";
    let group = {
      id: groupId,
      userMembership: {
        memberType: "owner",
        username: "scooby-doo",
      },
    } as IGroup;

    const user = {
      groups: [group],
      username: "scooby-doo",
    } as IUser;
    let result = canEditTeam(group, user);
    expect(result).toBe(true);
    group = {
      id: groupId,
      userMembership: {
        memberType: "admin",
        username: "scooby-doo",
      },
    } as IGroup;
    result = canEditTeam(group, user);
    expect(result).toBe(true);
  });

  it("returns false if user is a member of the team", function () {
    const groupId = "foo";
    const group = {
      id: groupId,
      userMembership: {
        memberType: "member",
        username: "scooby-doo",
      },
    } as IGroup;
    const user = {
      groups: [group],
      username: "scooby-doo",
    } as IUser;
    const result = canEditTeam(group, user);
    expect(result).toBe(false);
  });

  it("handles case where Group was not fetched in context of the user", function () {
    const group = {
      id: "00c",
      userMembership: {
        memberType: "admin",
        username: "scooby-doo",
      },
    } as IGroup;
    const user = {
      groups: [group],
      username: "bing-bong",
    } as IUser;
    const result = canEditTeam(group, user);
    expect(result).toBe(false);
  });

  it("handles group w/o userMembership", () => {
    const group = {
      id: "00c",
    } as IGroup;
    const user = {
      groups: [group],
      username: "bing-bong",
    } as IUser;
    const result = canEditTeam(group, user);
    expect(result).toBe(false);
  });
});
