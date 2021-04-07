import * as portalModule from "@esri/arcgis-rest-portal";
import { getTeamById } from "../../src/utils/get-team-by-id";
import { IHubRequestOptions } from "@esri/hub-common";

describe("getTeamById", () => {
  const ro = {
    authentication: { token: "foobar" }
  } as IHubRequestOptions;

  it("should call with the right group id", async () => {
    const groupId = "foobarbaz";
    const getTeamSpy = spyOn(portalModule, "getGroup").and.returnValue(
      Promise.resolve({})
    );

    const res = await getTeamById(groupId, ro);

    expect(res).toBeTruthy();

    expect(getTeamSpy.calls.argsFor(0)[0]).toEqual(
      groupId,
      "get team spy called with correct group id"
    );
  });
});
