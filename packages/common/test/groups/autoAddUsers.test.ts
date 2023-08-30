import * as restPortalModule from "@esri/arcgis-rest-portal";
import { autoAddUsers } from "../../src/groups/autoAddUsers";
import { MOCK_AUTH } from "./add-users-workflow/fixtures";

describe("auto-add-users", function () {
  let addSpy: jasmine.Spy;
  const users: restPortalModule.IUser[] = [
    { username: "luke" },
    { username: "leia" },
    { username: "han" },
  ];
  const groupId = "rebel_alliance";

  beforeEach(() => {
    addSpy = spyOn(restPortalModule, "addGroupUsers");
  });
  afterEach(() => {
    addSpy.calls.reset();
  });

  it("Properly delegates to addGroupUsers", async () => {
    addSpy.and.callFake(() => Promise.resolve({ notAdded: [] }));
    const result = await autoAddUsers(groupId, users, MOCK_AUTH);
    expect(result).toEqual({ notAdded: [] });
    expect(addSpy).toHaveBeenCalled();
    const actualArgs = addSpy.calls.first().args;
    const expectedArgs = [
      {
        authentication: MOCK_AUTH,
        id: groupId,
        users: users.map((u) => u.username),
      },
    ];
    expect(actualArgs).toEqual(expectedArgs);
  });

  it("Resolves to null when users array is empty", async () => {
    const result = await autoAddUsers(groupId, [], MOCK_AUTH);
    expect(result).toEqual(null);
    expect(addSpy).not.toHaveBeenCalled();
  });
});
