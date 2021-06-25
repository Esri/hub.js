import { canEditTeam } from "../../src/utils/can-edit-team";
import { IGroup, IUser } from "@esri/arcgis-rest-types";

describe("canEditTeam", function () {
  const getUser = (props: any = {}) => props as IUser;
  const getGroup = (props: any) => props as IGroup;

  it("returns true if user is an admin or owner of the team", function () {
    const groupId = "foo";
    let group = getGroup({
      id: groupId,
      userMembership: {
        memberType: "owner",
        username: "scooby-doo",
      },
    });
    const user = getUser({
      groups: [group],
      username: "scooby-doo",
    });
    let result = canEditTeam(group, user);
    expect(result).toBe(true);
    group = getGroup({
      id: groupId,
      userMembership: {
        memberType: "admin",
        username: "scooby-doo",
      },
    });
    result = canEditTeam(group, user);
    expect(result).toBe(true);
  });

  it("returns false if user is a member of the team", function () {
    const groupId = "foo";
    const group = getGroup({
      id: groupId,
      userMembership: {
        memberType: "member",
        username: "scooby-doo",
      },
    });
    const user = getUser({
      groups: [group],
      username: "scooby-doo",
    });
    const result = canEditTeam(group, user);
    expect(result).toBe(false);
  });

  it("returns false if the user does not belong to the team", function () {
    const groupId = "foo";
    const group = getGroup({
      id: groupId,
      userMembership: {
        memberType: "admin",
        username: "scooby-doo",
      },
    });
    const user = getUser({
      groups: [group],
      username: "bing-bong",
    });
    const result = canEditTeam(group, user);
    expect(result).toBe(false);
  });
});
