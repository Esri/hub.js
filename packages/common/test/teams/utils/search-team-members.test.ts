import * as portalModule from "@esri/arcgis-rest-portal";
import { searchTeamMembers } from "../../../src/teams/utils/search-team-members";
import { IHubRequestOptions } from "../../../src";
import { UserSession } from "@esri/arcgis-rest-auth";

describe("searchTeamMembers", () => {
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
    const groupId = "3ef";
    const searchGroupUsersSpy = spyOn(
      portalModule,
      "searchGroupUsers"
    ).and.returnValue(Promise.resolve({}));

    const res = await searchTeamMembers(groupId, ro);

    expect(res).toBeTruthy();

    expect(searchGroupUsersSpy.calls.argsFor(0)[0]).toEqual(
      groupId,
      "search group users spy called with correct group id"
    );
  });
});
