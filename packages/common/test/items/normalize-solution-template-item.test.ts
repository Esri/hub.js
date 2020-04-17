import {
  normalizeSolutionTemplateItem,
  itemPropsNotInTemplates
} from "../../src";
import { IItem } from "@esri/arcgis-rest-types";

describe("normalizeSolutionTemplateItem", function() {
  it("removes the right attributes and templatizes extent", function() {
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
        "Web Map"
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
        parentId: "2d964e35474c45eb89f84e0252a656f3"
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
      groupDesignations: null
    };

    const template = normalizeSolutionTemplateItem(item);

    itemPropsNotInTemplates.forEach(prop => {
      expect(template[prop]).toBeUndefined(`${prop} was deleted`);
    });
    expect(template.extent).toBe("{{initiative.extent}}", "templatizes extent");
  });
});
