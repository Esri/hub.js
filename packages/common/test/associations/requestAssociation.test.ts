import { ArcGISContext, cloneObject } from "../../src";
import { requestAssociation } from "../../src/associations/requestAssociation";
import { MOCK_CHILD_ENTITY, MOCK_PARENT_ENTITY } from "./fixtures";
import * as RestPortalModule from "@esri/arcgis-rest-portal";
import * as FetchHubEntityModule from "../../src/core/fetchHubEntity";
import * as UpdateHubEntityModule from "../../src/core/updateHubEntity";

describe("requestAssociation", () => {
  let shareItemWithGroupSpy: jasmine.Spy;
  let fetchHubEntitySpy: jasmine.Spy;
  let updateHubEntitySpy: jasmine.Spy;

  beforeEach(() => {
    shareItemWithGroupSpy = spyOn(
      RestPortalModule,
      "shareItemWithGroup"
    ).and.returnValue(Promise.resolve());
    fetchHubEntitySpy = spyOn(
      FetchHubEntityModule,
      "fetchHubEntity"
    ).and.returnValue(Promise.resolve({ owner: "mock-owner" }));
    updateHubEntitySpy = spyOn(
      UpdateHubEntityModule,
      "updateHubEntity"
    ).and.returnValue(Promise.resolve());
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
    const mockChild = cloneObject(MOCK_CHILD_ENTITY);
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
