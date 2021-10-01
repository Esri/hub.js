import * as portalModule from "@esri/arcgis-rest-portal";
import { getTeamMembers } from "../../../src/teams/utils/get-team-members";
import { IHubRequestOptions } from "../../../src";
import { UserSession } from "@esri/arcgis-rest-auth";

describe("getTeamMembers", () => {
  const authentication = new UserSession({
    username: "portal-user",
    portal: "http://portal.com/sharing/rest",
    token: "123",
  });
  authentication.getToken = () =>
    new Promise((resolve) => {
      resolve("123");
    });
  const ro = {
    authentication,
  } as IHubRequestOptions;

  it("should call with the right group id", async () => {
    const groupId = "foobarbaz";
    const getGroupUsersSpy = spyOn(
      portalModule,
      "getGroupUsers"
    ).and.returnValue(Promise.resolve({}));

    const res = await getTeamMembers(groupId, ro);

    expect(res).toBeTruthy();

    expect(getGroupUsersSpy.calls.argsFor(0)[0]).toEqual(
      groupId,
      "get group users spy called with correct group id"
    );
    expect(getGroupUsersSpy.calls.argsFor(0)[1]).toEqual(
      ro,
      "passes whole hubRo forward"
    );
  });
});
