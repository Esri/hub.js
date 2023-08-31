import { autoAddUsersAsAdmins } from "../../../src/groups/_internal/autoAddUsersAsAdmins";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as restPortalModule from "@esri/arcgis-rest-portal";

describe("autoAddUsersAsAdmin", function () {
  let addSpy: jasmine.Spy;
  const admins: restPortalModule.IUser[] = [
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
    const result = await autoAddUsersAsAdmins(groupId, admins, MOCK_AUTH);
    expect(result).toEqual({ notAdded: [] });
    expect(addSpy).toHaveBeenCalled();
    const actualArgs = addSpy.calls.first().args;
    const expectedArgs = [
      {
        authentication: MOCK_AUTH,
        id: groupId,
        admins: admins.map((u) => u.username),
      },
    ];
    expect(actualArgs).toEqual(expectedArgs);
  });

  it("Resolves to null when users array is empty", async () => {
    const result = await autoAddUsersAsAdmins(groupId, [], MOCK_AUTH);
    expect(result).toEqual(null);
    expect(addSpy).not.toHaveBeenCalled();
  });
});
