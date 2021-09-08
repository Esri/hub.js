import { IUser, IItem } from "@esri/arcgis-rest-types";
import * as canUserCreateTeamModule from "../../src/utils/can-user-create-team";
import * as getTeamByIdModule from "../../src/utils/get-team-by-id";
import { IHubRequestOptions } from "@esri/hub-common";
import { getTeamStatus } from "../../src/utils/get-team-status";

describe("get-team-status", function () {
  let canUserCreateTeamSpy: jasmine.Spy;
  let getTeamByIdSpy: jasmine.Spy;
  const item = {
    properties: {
      collaborationGroupId: "123abc",
    },
  } as IItem;
  const user1: IUser = {
    username: "Pinky",
    orgId: "world-domination",
  };

  const ro = { isPortal: false } as IHubRequestOptions;

  beforeEach(() => {
    canUserCreateTeamSpy = spyOn(canUserCreateTeamModule, "canUserCreateTeam");
    getTeamByIdSpy = spyOn(getTeamByIdModule, "getTeamById");
  });
  afterEach(() => {
    canUserCreateTeamSpy.calls.reset();
    getTeamByIdSpy.calls.reset();
  });

  it("Checks status in best case", async () => {
    canUserCreateTeamSpy.and.callFake(() => Promise.resolve(true));
    getTeamByIdSpy.and.callFake(() => Promise.resolve(true));
    const result = await getTeamStatus(item, "core", user1, ro);
    expect(getTeamByIdSpy).toHaveBeenCalled();
    expect(canUserCreateTeamSpy).not.toHaveBeenCalled();
    expect(result.isOk).toBeTruthy();
    expect(result.id).toEqual("123abc");
  });
  it("Checks if can fix if there is no id", async () => {
    canUserCreateTeamSpy.and.callFake(() => Promise.resolve(true));
    getTeamByIdSpy.and.callFake(() => Promise.resolve(true));
    const result = await getTeamStatus(
      {
        properties: {
          followersGroupId: "123abc",
        },
      } as IItem,
      "core",
      user1,
      ro
    );
    expect(getTeamByIdSpy).not.toHaveBeenCalled();
    expect(canUserCreateTeamSpy).toHaveBeenCalled();
    expect(result.canFix).toBeTruthy();
  });
  it("Checks if can fix if group cant be fetched by id", async () => {
    canUserCreateTeamSpy.and.callFake(() => Promise.resolve(true));
    getTeamByIdSpy.and.callFake(() => Promise.resolve(false));
    const result = await getTeamStatus(item, "core", user1, ro);
    expect(getTeamByIdSpy).toHaveBeenCalled();
    expect(canUserCreateTeamSpy).toHaveBeenCalled();
    expect(result.canFix).toBeTruthy();
  });
  it("Checks if can fix if group fetch by id errors out", async () => {
    canUserCreateTeamSpy.and.callFake(() => Promise.resolve(true));
    getTeamByIdSpy.and.callFake(() => Promise.reject());
    const result = await getTeamStatus(item, "core", user1, ro);
    expect(getTeamByIdSpy).toHaveBeenCalled();
    expect(canUserCreateTeamSpy).toHaveBeenCalled();
    expect(result.canFix).toBeTruthy();
  });
});
