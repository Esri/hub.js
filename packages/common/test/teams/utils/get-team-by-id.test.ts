import * as portalModule from "@esri/arcgis-rest-portal";
import { getTeamById } from "../../../src/teams/utils/get-team-by-id";
import { IHubRequestOptions } from "../../../src";
import { UserSession } from "@esri/arcgis-rest-auth";

describe("getTeamById", () => {
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
    const getGroupSpy = spyOn(portalModule, "getGroup").and.returnValue(
      Promise.resolve({})
    );

    const res = await getTeamById(groupId, ro);

    expect(res).toBeTruthy();

    expect(getGroupSpy.calls.argsFor(0)[0]).toEqual(
      groupId,
      "get team spy called with correct group id"
    );
  });
  it("should pass whole hubRequestOptions forward", async () => {
    const groupId = "foobarbaz";
    const getGroupSpy = spyOn(portalModule, "getGroup").and.returnValue(
      Promise.resolve({})
    );
    const unAuthRo = {
      portal: "https://foo.com",
    } as IHubRequestOptions;
    const res = await getTeamById(groupId, unAuthRo);

    expect(res).toBeTruthy();

    expect(getGroupSpy.calls.argsFor(0)[0]).toEqual(
      groupId,
      "get team spy called with correct group id"
    );
    expect(getGroupSpy.calls.argsFor(0)[1]).toEqual(
      unAuthRo,
      "passes through the RO even if not authd"
    );
  });
});
