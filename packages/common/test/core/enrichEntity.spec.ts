import { vi } from "vitest";
// make getGroup spyable on the ESM module
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  getGroup: vi.fn(),
}));
import { enrichEntity } from "../../src/core/enrichEntity";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { HubEntity } from "../../src/core/types/HubEntity";
import { getProp } from "../../src/objects/get-prop";

describe("enrichEntity", () => {
  // Use a minimal mock requestOptions object instead of ArcGISContextManager
  const requestOptions = { authentication: MOCK_AUTH } as any;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("doesn't add anything to the entity if no enrichments are requested", async () => {
    const chk = await enrichEntity({} as HubEntity, [], requestOptions);

    expect(chk).toEqual({} as HubEntity);
  });
  it("enriches the entity based on the enrichment spec", async () => {
    // cast to any to avoid needing to construct a full IGroup
    (PortalModule.getGroup as unknown as any).mockResolvedValue({
      id: "00c",
      access: "public",
    } as any);

    const chk = await enrichEntity(
      { followersGroupId: "followers_00c" } as HubEntity,
      ["followersGroup.access AS _followersGroup.access"],
      requestOptions
    );

    expect(getProp(chk, "_followersGroup.access")).toBe("public");
  });

  describe("followersGroup enrichment", () => {
    let getGroupSpy: any;
    afterEach(() => {
      getGroupSpy && getGroupSpy.mockReset();
    });
    it("enriches the entity with the followers group", async () => {
      const mockFollowersGroup = {
        id: "00c",
        access: "public",
      };
      getGroupSpy = vi
        .spyOn(PortalModule, "getGroup")
        .mockResolvedValue(mockFollowersGroup as any);

      const chk = await enrichEntity(
        { followersGroupId: "followers_00c" } as HubEntity,
        ["followersGroup AS _followersGroup"],
        requestOptions
      );

      expect(getGroupSpy).toHaveBeenCalledTimes(1);
      expect(getGroupSpy).toHaveBeenCalledWith("followers_00c", requestOptions);
      expect(getProp(chk, "_followersGroup")).toBe(mockFollowersGroup);
    });
    it("returns an empty object if there isn't a followersGroupId defined on the entity", async () => {
      getGroupSpy = vi.spyOn(PortalModule, "getGroup");
      const chk = await enrichEntity(
        {} as HubEntity,
        ["followersGroup AS _followersGroup"],
        requestOptions
      );
      expect(getGroupSpy).not.toHaveBeenCalled();
      expect(getProp(chk, "_followersGroup")).toEqual({});
    });
    it("returns an empty object and handles the error if there's an issue fetching the followers group", async () => {
      getGroupSpy = vi
        .spyOn(PortalModule, "getGroup")
        .mockRejectedValue(undefined);

      const chk = await enrichEntity(
        { followersGroupId: "followers_00c" } as HubEntity,
        ["followersGroup AS _followersGroup"],
        requestOptions
      );

      expect(getGroupSpy).toHaveBeenCalledTimes(1);
      expect(getGroupSpy).toHaveBeenCalledWith("followers_00c", requestOptions);
      expect(getProp(chk, "_followersGroup")).toEqual({});
    });
  });
});
