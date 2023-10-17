import { updateUserMembership } from "../../src/groups/updateUserMembership";
import * as restPortalModule from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";

const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

const MOCK_USER_SESSION = new UserSession({
  username: "casey",
  password: "123456",
  token: "fake-token",
  tokenExpires: TOMORROW,
});

describe("update-user-membership", function () {
  let updateMembershipSpy: jasmine.Spy;

  beforeEach(() => {
    updateMembershipSpy = spyOn(restPortalModule, "updateUserMemberships");
  });
  afterEach(() => {
    updateMembershipSpy.calls.reset();
  });

  it("Properly delegates to updateUserMemberships in arcgis-rest-portal", async () => {
    updateMembershipSpy.and.callFake(() =>
      Promise.resolve({ results: [{ username: "bob", success: true }] })
    );
    const result = await updateUserMembership(
      "1234",
      ["bob"],
      "member",
      MOCK_USER_SESSION
    );
    expect(result).toEqual({ results: [{ username: "bob", success: true }] });
    expect(updateMembershipSpy).toHaveBeenCalled();
  });
});
