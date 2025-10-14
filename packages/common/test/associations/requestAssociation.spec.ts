import {
  describe,
  it,
  expect,
  vi,
  afterEach,
  beforeEach,
  MockInstance,
} from "vitest";
import { ArcGISContext } from "../../src/ArcGISContext";
import { requestAssociation } from "../../src/associations/requestAssociation";
import { MOCK_CHILD_ENTITY, MOCK_PARENT_ENTITY } from "./fixtures";
import * as RestPortalModule from "@esri/arcgis-rest-portal";
import * as FetchHubEntityModule from "../../src/core/fetchHubEntity";
import * as UpdateHubEntityModule from "../../src/core/updateHubEntity";

vi.mock("@esri/arcgis-rest-portal");

describe("requestAssociation", () => {
  let shareItemWithGroupSpy: MockInstance;
  let fetchHubEntitySpy: MockInstance;
  let updateHubEntitySpy: MockInstance;

  beforeEach(() => {
    shareItemWithGroupSpy = vi
      .spyOn(RestPortalModule, "shareItemWithGroup")
      .mockReturnValue(Promise.resolve() as any);
    fetchHubEntitySpy = vi
      .spyOn(FetchHubEntityModule, "fetchHubEntity")
      .mockReturnValue(Promise.resolve({ owner: "mock-owner" }) as any);
    updateHubEntitySpy = vi
      .spyOn(UpdateHubEntityModule, "updateHubEntity")
      .mockReturnValue(Promise.resolve() as any);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parent perspective: shares the child to its association group", async () => {
    await requestAssociation(MOCK_PARENT_ENTITY, "project", "child-00a", {
      session: {},
    } as ArcGISContext);

    expect(fetchHubEntitySpy).toHaveBeenCalledTimes(1);
    expect(fetchHubEntitySpy).toHaveBeenCalledWith("project", "child-00a", {
      session: {},
    });
    expect(shareItemWithGroupSpy).toHaveBeenCalledTimes(1);
    expect(shareItemWithGroupSpy).toHaveBeenCalledWith({
      id: "child-00a",
      owner: "mock-owner",
      groupId: "group-00a",
      authentication: {},
    });
  });
  it("child perspective: adds a typeKeyword to itself referencing the parent", async () => {
    const mockChild = { ...MOCK_CHILD_ENTITY };
    await requestAssociation(
      mockChild,
      "initiative",
      "parent-00b",
      {} as ArcGISContext
    );

    expect(mockChild.typeKeywords?.length).toBe(2);
    expect(updateHubEntitySpy).toHaveBeenCalledTimes(1);
    expect(updateHubEntitySpy).toHaveBeenCalledWith(
      "project",
      mockChild,
      {} as ArcGISContext
    );
  });
  it("throws an error if there is an issue sharing the item with the association group", async () => {
    shareItemWithGroupSpy.mockReturnValue(Promise.reject("error"));

    try {
      await requestAssociation(
        MOCK_PARENT_ENTITY,
        "project",
        "child-00a",
        {} as ArcGISContext
      );
    } catch (err) {
      expect(err).toEqual(
        new Error(
          "requestAssociation: there was an error sharing child-00a to group-00a: error"
        )
      );
    }
  });
  it("throws an error if the association is not supported", async () => {
    try {
      await requestAssociation(
        MOCK_PARENT_ENTITY,
        "group",
        "group-00a",
        {} as ArcGISContext
      );
    } catch (err) {
      expect(err).toEqual(
        new Error(
          "requestAssociation: Association between initiative and group is not supported."
        )
      );
    }
  });
});
