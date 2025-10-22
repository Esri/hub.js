import { IUser } from "@esri/arcgis-rest-portal";
import * as _getInviteUsersModule from "../../../../src/groups/add-users-workflow/utils/_get-invite-users";
import { _getEmailUsers } from "../../../../src/groups/add-users-workflow/utils/_get-email-users";
import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";

describe("_get_email_users", () => {
  const requestingUser: IUser = {
    username: "Doc Ock",
    orgId: "sinister-six",
    cOrgId: "avengers",
  };
  const users: IUser[] = [
    {
      username: "Vulture",
      orgId: "sinister-six",
    },
    {
      username: "Mysterio",
      orgId: "sinister-six",
    },
    {
      username: "Spider-Man",
      orgId: "avengers",
    },
  ];

  let inviteSpy: any;
  beforeEach(() => {
    inviteSpy = vi.spyOn(_getInviteUsersModule, "_getInviteUsers");
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Properly calls _getInviteUsers", () => {
    inviteSpy.mockImplementation((): IUser[] => []);
    _getEmailUsers(users, requestingUser);
    expect(inviteSpy).toHaveBeenCalledWith(users, requestingUser);
  });

  it("Returns invite users that are part of the same org", () => {
    inviteSpy.mockImplementation(() => users);
    const actual = _getEmailUsers(users, requestingUser);
    const expected = [
      {
        username: "Vulture",
        orgId: "sinister-six",
      },
      {
        username: "Mysterio",
        orgId: "sinister-six",
      },
    ];
    expect(actual).toEqual(expected);
  });

  it("Appends calling user if includeSelf is true", () => {
    inviteSpy.mockImplementation((): IUser[] => []);
    const actual = _getEmailUsers(users, requestingUser, true);
    const expected = [requestingUser];
    expect(actual).toEqual(expected);
  });
});
