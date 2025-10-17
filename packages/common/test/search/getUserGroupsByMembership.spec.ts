import type { IUser } from "@esri/arcgis-rest-portal";
import { getUserGroupsByMembership } from "../../src/search/getUserGroupsByMembership";

describe("getUserGroupsByMembership:", () => {
  it("returns empty groups when user has no groups", () => {
    const user: IUser = {
      username: "user1",
      groups: [],
    } as unknown as IUser;

    const result = getUserGroupsByMembership(user);

    expect(result).toEqual({
      owner: [],
      member: [],
      admin: [],
    });
  });

  it("categorizes groups correctly when user has groups with roles", () => {
    const user: IUser = {
      username: "user1",
      groups: [
        { id: "o00", userMembership: { memberType: "owner" } },
        { id: "m00", userMembership: { memberType: "member" } },
        { id: "a00", userMembership: { memberType: "admin" } },
      ],
    } as unknown as IUser;

    const result = getUserGroupsByMembership(user);

    expect(result).toEqual({
      owner: ["o00"],
      member: ["m00"],
      admin: ["a00"],
    });
  });

  it("handles users with mixed roles and unknown membership types", () => {
    const user: IUser = {
      username: "user1",
      groups: [
        { id: "o00", userMembership: { memberType: "owner" } },
        { id: "m00", userMembership: { memberType: "member" } },
        { id: "a00", userMembership: { memberType: "admin" } },
        { id: "unknown", userMembership: { memberType: "unknown" } },
      ],
    } as unknown as IUser;

    const result = getUserGroupsByMembership(user);

    expect(result).toEqual({
      owner: ["o00"],
      member: ["m00"],
      admin: ["a00"],
    });
  });

  it("returns empty groups when userMembership is undefined", () => {
    const user: IUser = {
      username: "user1",
      groups: [
        { id: "o00", userMembership: undefined },
        { id: "m00", userMembership: undefined },
      ],
    } as unknown as IUser;

    const result = getUserGroupsByMembership(user);

    expect(result).toEqual({
      owner: [],
      member: [],
      admin: [],
    });
  });

  it("returns empty groups when user has no groups", () => {
    const user: IUser = {
      username: "user1",
    } as unknown as IUser;

    const result = getUserGroupsByMembership(user);

    expect(result).toEqual({
      owner: [],
      member: [],
      admin: [],
    });
  });
});
