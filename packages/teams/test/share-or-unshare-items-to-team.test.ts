import { shareOrUnshareItemsToTeam } from "../src";
import * as commonModule from "@esri/hub-common";
import { IHubRequestOptions } from "@esri/hub-common";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";
describe("shareOrUnshareItemsToTeam: ", () => {
  const item: IItem = {
    id: "c9929fca0892406da79f38fe4efcc116",
    owner: "dcadminqa",
    created: 1515535996000,
    isOrgItem: true,
    modified: 1582903809000,
    guid: null,
    name: null,
    title: " non vz event",
    type: "Hub Page",
    typeKeywords: [
      "Hub",
      "hubPage",
      "JavaScript",
      "Map",
      "Mapping Site",
      "Online Map",
      "OpenData",
      "selfConfigured",
      "Web Map",
    ],
    description:
      "DO NOT DELETE OR MODIFY THIS ITEM. This item is managed by the Hub application. To make changes to this Page, please visit https://hub.arcgis.com/admin/",
    tags: [],
    snippet: "null",
    thumbnail: "thumbnail/ago_downloaded.png",
    documentation: null,
    extent: [],
    categories: [],
    spatialReference: null,
    accessInformation: "null",
    licenseInfo: "null",
    culture: "en-us",
    properties: {
      demoUrl: "https://hub.arcgis.com/admin/",
      source: "2d964e35474c45eb89f84e0252a656f3",
      parentInitiativeId: "a7c9f77c7b564f309ef88dfbcdce80a8",
      parentId: "2d964e35474c45eb89f84e0252a656f3",
    },
    url: "https://opendataqa.arcgis.com/admin/",
    proxyFilter: null,
    access: "private",
    size: -1,
    appCategories: [],
    industries: [],
    languages: [],
    largeThumbnail: null,
    banner: null,
    screenshots: [],
    listed: false,
    ownerFolder: null,
    protected: true,
    numComments: 0,
    numRatings: 0,
    avgRating: 0,
    numViews: 56,
    scoreCompleteness: 61,
    groupDesignations: null,
  };
  const auth: IHubRequestOptions = {
    isPortal: false,
    hubApiUrl: "a-url",
    authentication: null,
  };
  it("properly shares items to a group", async () => {
    let count = 0;
    const shareItemToGroupsSpy = spyOn(
      commonModule,
      "shareItemToGroups"
    ).and.callFake((itemId: string) => {
      if (count !== 1) {
        count += 1;
        return Promise.resolve({
          notSharedWith: [],
          itemId,
        });
      } else {
        count += 1;
        return Promise.reject(new ArcGISRequestError(`Content not shared`));
      }
    });
    const response = await shareOrUnshareItemsToTeam(
      "abc123",
      [item, item, item, item],
      auth
    );
    expect(shareItemToGroupsSpy.calls.count()).toEqual(4);
    expect(response.successes.length).toEqual(3);
    expect(response.failures.length).toEqual(1);
    expect(response.errors.length).toEqual(1);
  });
  it("properly unshares items from a group", async () => {
    let count = 0;
    const unshareItemFromGroupsSpy = spyOn(
      commonModule,
      "unshareItemFromGroups"
    ).and.callFake((itemId: string) => {
      if (count !== 1) {
        count += 1;
        return Promise.resolve({
          notSharedWith: [],
          itemId,
        });
      } else {
        count += 1;
        return Promise.reject(
          new ArcGISRequestError(`Content not unsharedshared`)
        );
      }
    });
    const response = await shareOrUnshareItemsToTeam(
      "abc123",
      [item, item, item, item],
      auth,
      "unshare"
    );
    expect(unshareItemFromGroupsSpy.calls.count()).toEqual(4);
    expect(response.successes.length).toEqual(3);
    expect(response.failures.length).toEqual(1);
    expect(response.errors.length).toEqual(1);
  });
});
