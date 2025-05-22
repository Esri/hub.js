import * as restPortalModule from "@esri/arcgis-rest-portal";
import { buildEventAssociations } from "../../../src/events/_internal/buildEventAssociations";
import { IHubRequestOptions } from "../../../src/hub-types";
import { ICreateEventAssociation } from "../../../src/events/api/orval/api/orval-events";

describe("buildEventAssociations", () => {
  const hubRequestOptions = { authentication: {} } as IHubRequestOptions;
  let searchItemsSpy: jasmine.Spy;

  beforeEach(() => {
    searchItemsSpy = spyOn(restPortalModule, "searchItems").and.returnValue(
      Promise.resolve({
        results: [
          {
            id: "31c",
            type: "Hub Site Application",
          },
          {
            id: "53e",
            type: "Hub Initiative",
          },
        ],
      })
    );
  });

  it("should purge associations not included in featuredContentIds", async () => {
    const existingAssociations = [
      {
        entityId: "31c",
        entityType: "Hub Site Application",
      },
      {
        entityId: "42d",
        entityType: "Hub Project",
      },
      {
        entityId: "53e",
        entityType: "Hub Initiative",
      },
    ];
    const updatedFeaturedContentIds = ["31c", "53e"];
    const results = await buildEventAssociations(
      existingAssociations,
      updatedFeaturedContentIds,
      hubRequestOptions
    );
    expect(searchItemsSpy).not.toHaveBeenCalled();
    expect(results).toEqual([
      {
        entityId: "31c",
        entityType: "Hub Site Application",
      },
      {
        entityId: "53e",
        entityType: "Hub Initiative",
      },
    ] as ICreateEventAssociation[]);
  });

  it("should resolve the existing associations when none are added or removed", async () => {
    const existingAssociations = [
      {
        entityId: "31c",
        entityType: "Hub Site Application",
      },
      {
        entityId: "42d",
        entityType: "Hub Project",
      },
      {
        entityId: "53e",
        entityType: "Hub Initiative",
      },
    ];
    const updatedFeaturedContentIds = ["31c", "42d", "53e"];
    const results = await buildEventAssociations(
      existingAssociations,
      updatedFeaturedContentIds,
      hubRequestOptions
    );
    expect(searchItemsSpy).not.toHaveBeenCalled();
    expect(results).toEqual(existingAssociations as ICreateEventAssociation[]);
  });

  it("should fetch and add new associations", async () => {
    const existingAssociations = [
      {
        entityId: "42d",
        entityType: "Hub Project",
      },
    ];
    const updatedFeaturedContentIds = ["31c", "42d", "53e"];
    const results = await buildEventAssociations(
      existingAssociations,
      updatedFeaturedContentIds,
      hubRequestOptions
    );
    expect(searchItemsSpy).toHaveBeenCalledTimes(1);
    expect(searchItemsSpy).toHaveBeenCalledWith({
      q: "id:31c OR id:53e",
      num: 2,
      authentication: hubRequestOptions.authentication,
    });
    expect(results).toEqual([
      {
        entityId: "42d",
        entityType: "Hub Project",
      },
      {
        entityId: "31c",
        entityType: "Hub Site Application",
      },
      {
        entityId: "53e",
        entityType: "Hub Initiative",
      },
    ] as ICreateEventAssociation[]);
  });
});
