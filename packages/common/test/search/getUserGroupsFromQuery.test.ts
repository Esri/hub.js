import { IQuery } from "../../src";
import { IUser } from "../../src/events/api";
import { getUserGroupsFromQuery } from "../../src/search/getUserGroupsFromQuery";
import * as GetUserGroupsByMembershipModule from "../../src/search/getUserGroupsByMembership";

describe("getUserGroupsFromQuery:", () => {
  it("returns all user groups by membership if query lacks group predicate", () => {
    const query: IQuery = {
      targetEntity: "item",
      filters: [],
    };
    const user: IUser = {
      username: "user1",
    } as unknown as IUser;

    const getUserGroupsByMembershipSpy = spyOn(
      GetUserGroupsByMembershipModule,
      "getUserGroupsByMembership"
    ).and.callFake(() => {
      return {
        owner: ["o00"],
        member: ["m00"],
        admin: ["a00"],
      };
    });

    const result = getUserGroupsFromQuery(query, user);
    expect(result).toEqual({
      owner: ["o00"],
      member: ["m00"],
      admin: ["a00"],
    });
    expect(getUserGroupsByMembershipSpy).toHaveBeenCalled();
  });

  it("returns only groups user is a member of, from groups in query", () => {
    const query: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              group: "m00",
            },
          ],
        },
      ],
    };
    const user: IUser = {
      username: "user1",
    } as unknown as IUser;

    const getUserGroupsByMembershipSpy = spyOn(
      GetUserGroupsByMembershipModule,
      "getUserGroupsByMembership"
    ).and.callFake(() => {
      return {
        owner: ["o00"],
        member: ["m00"],
        admin: ["a00"],
      };
    });
    const result = getUserGroupsFromQuery(query, user);
    expect(result).toEqual({
      owner: [],
      member: ["m00"],
      admin: [],
    });
    expect(getUserGroupsByMembershipSpy).toHaveBeenCalled();
  });
});
