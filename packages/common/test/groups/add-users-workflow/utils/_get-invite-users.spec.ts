import { IUser } from "@esri/arcgis-rest-portal";
import * as _getAutoAddUsersModule from "../../../../src/groups/add-users-workflow/utils/_get-auto-add-users";
import { _getInviteUsers } from "../../../../src/groups/add-users-workflow/utils/_get-invite-users";
import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";

describe("_get_invite_users", () => {
  const requestingUser: IUser = {
    username: "Doc Ock",
    orgId: "sinister-six",
    cOrgId: "avengers",
  };
  const users: IUser[] = [
    {
      username: "Mysterio",
      orgId: "sinister-six",
    },
    {
      username: "Venom",
      orgId: "symbiotes",
    },
    {
      username: "Spider-Man",
      orgId: "avengers",
    },
  ];

  let addSpy: any;
  beforeEach(() => {
    addSpy = vi.spyOn(_getAutoAddUsersModule, "_getAutoAddUsers");
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Properly calls _getAutoAddUsers", () => {
    addSpy.mockImplementation((): IUser[] => []);
    _getInviteUsers(users, requestingUser);
    expect(addSpy).toHaveBeenCalledWith(users, requestingUser);
  });

  it("Returns users that will not be autoAdded", () => {
    addSpy.mockImplementation(() => [
      {
        username: "Mysterio",
        orgId: "sinister-six",
      },
    ]);

    const actual = _getInviteUsers(users, requestingUser);
    const expected = [
      {
        username: "Venom",
        orgId: "symbiotes",
      },
      {
        username: "Spider-Man",
        orgId: "avengers",
      },
    ];

    expect(actual).toEqual(expected);
  });
});
