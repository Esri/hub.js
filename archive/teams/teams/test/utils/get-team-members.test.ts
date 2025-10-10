import * as portalModule from "@esri/arcgis-rest-portal";
import { getTeamMembers } from "../../src/utils/get-team-members";
import { IHubRequestOptions } from "@esri/hub-common";

describe("getTeamMembers", () => {
  const authentication = {
    username: "portal-user",
    portal: "http://portal.com/sharing/rest",
    token: "123",
  } as any;
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
