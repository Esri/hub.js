import { searchTeamMembers } from "../../src/utils/search-team-members";
import { IHubRequestOptions } from "@esri/hub-common";

describe("searchTeamMembers", () => {
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
    const groupId = "3ef";
    const searchGroupUsersSpy = (ro.request = jasmine
      .createSpy()
      .and.returnValue(Promise.resolve({})));
    const res = await searchTeamMembers(groupId, ro);

    expect(res).toBeTruthy();

    expect(searchGroupUsersSpy.calls.argsFor(0)[0]).toContain(
      `/groups/${groupId}`,
      "search group users spy called with correct group id"
    );
  });
});
