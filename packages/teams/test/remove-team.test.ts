import * as restPortalModule from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import { removeTeam } from "../src/remove-team";

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

describe("remove-team", function () {
  let unprotectGroupSpy: jasmine.Spy;
  let removeGroupSpy: jasmine.Spy;

  beforeEach(() => {
    unprotectGroupSpy = spyOn(restPortalModule, "unprotectGroup");
    removeGroupSpy = spyOn(restPortalModule, "removeGroup");
  });
  afterEach(() => {
    unprotectGroupSpy.calls.reset();
    removeGroupSpy.calls.reset();
  });

  it("Properly delegates to unprotectGroup and removeGroup arcgis-rest-portal", async () => {
    unprotectGroupSpy.and.callFake(() => Promise.resolve({ success: true }));
    removeGroupSpy.and.callFake(() => Promise.resolve());
    const result = await removeTeam("1234", MOCK_USER_SESSION);
    expect(unprotectGroupSpy).toHaveBeenCalled();
    expect(removeGroupSpy).toHaveBeenCalled();
  });
  it("Does not remove group if unprotext call fails", async () => {
    unprotectGroupSpy.and.callFake(() => Promise.resolve({ success: false }));
    removeGroupSpy.and.callFake(() => Promise.resolve());
    const result = await removeTeam("1234", MOCK_USER_SESSION);
    expect(unprotectGroupSpy).toHaveBeenCalled();
    expect(removeGroupSpy).not.toHaveBeenCalled();
  });
});
