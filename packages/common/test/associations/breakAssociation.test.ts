import { ArcGISContext, cloneObject } from "../../src";
import { breakAssociation } from "../../src/associations/breakAssociation";
import { MOCK_CHILD_ENTITY, MOCK_PARENT_ENTITY } from "./fixtures";
import * as RestPortalModule from "@esri/arcgis-rest-portal";
import * as CoreModule from "../../src/core";
import * as UpdateHubEntityModule from "../../src/core/updateHubEntity";

describe("breakAssociation", () => {
  let unshareItemWithGroupSpy: jasmine.Spy;
  let fetchHubEntitySpy: jasmine.Spy;
  let updateHubEntitySpy: jasmine.Spy;

  beforeEach(() => {
    unshareItemWithGroupSpy = spyOn(
      RestPortalModule,
      "unshareItemWithGroup"
    ).and.returnValue(Promise.resolve());
    fetchHubEntitySpy = spyOn(CoreModule, "fetchHubEntity").and.returnValue(
      Promise.resolve({ owner: "mock-owner" })
    );
    updateHubEntitySpy = spyOn(
      UpdateHubEntityModule,
      "updateHubEntity"
    ).and.returnValue(Promise.resolve());
  });
  afterEach(() => {
    unshareItemWithGroupSpy.calls.reset();
    fetchHubEntitySpy.calls.reset();
    updateHubEntitySpy.calls.reset();
  });

  it("parent perspective: unshares the child from its association group", async () => {
    await breakAssociation(MOCK_PARENT_ENTITY, "project", "child-00a", {
      session: {},
    } as ArcGISContext);

    expect(fetchHubEntitySpy).toHaveBeenCalledTimes(1);
    expect(fetchHubEntitySpy).toHaveBeenCalledWith("project", "child-00a", {
      session: {},
    });
    expect(unshareItemWithGroupSpy).toHaveBeenCalledTimes(1);
    expect(unshareItemWithGroupSpy).toHaveBeenCalledWith({
      id: "child-00a",
      owner: "mock-owner",
      groupId: "group-00a",
      authentication: {},
    });
  });
  it("child perspective: removes the typeKeyword referencing the specified parent", async () => {
    const mockChild = cloneObject(MOCK_CHILD_ENTITY);
    await breakAssociation(
      mockChild,
      "initiative",
      "parent-00a",
      {} as ArcGISContext
    );

    expect(mockChild.typeKeywords?.length).toBe(0);
    expect(updateHubEntitySpy).toHaveBeenCalledTimes(1);
    expect(updateHubEntitySpy).toHaveBeenCalledWith(
      "project",
      mockChild,
      {} as ArcGISContext
    );
  });
  it("throws an error if there is an issue unsharing the item from the association group", async () => {
    unshareItemWithGroupSpy.and.returnValue(Promise.reject("unshare error"));

    try {
      await breakAssociation(MOCK_PARENT_ENTITY, "project", "child-00a", {
        session: {},
      } as ArcGISContext);
    } catch (err) {
      expect(err).toEqual(
        new Error(
          "breakAssociation: there was an error unsharing child-00a from group-00a: unshare error"
        )
      );
    }
  });
  it("throws an error if the association is not supported", async () => {
    try {
      await breakAssociation(
        MOCK_PARENT_ENTITY,
        "group",
        "group-00a",
        {} as ArcGISContext
      );
    } catch (err) {
      expect(err).toEqual(
        new Error(
          "breakAssociation: Association between initiative and group is not supported."
        )
      );
    }
  });
});
