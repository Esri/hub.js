import { applyDraft } from "../../src/drafts/apply-draft";
import { IModel, getProp } from "@esri/hub-common";
import { PAGE_DRAFT_INCLUDE_LIST } from "../../src/drafts";
import { IDraft } from "@esri/hub-types";

const pageModel = ({
  item: {
    id: "36a1fc3d904e434488e8263b2f14f696",
    owner: "atate_dc",
    created: 1597340803000,
    isOrgItem: true,
    modified: 1598399896000,
    guid: null,
    name: null,
    title: "New title",
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
      "state:hasUnpublishedChanges",
      "Web Map"
    ],
    description:
      "DO NOT DELETE OR MODIFY THIS ITEM. This item is managed by the ArcGIS Hub application. To make changes to this page, please visit https://dc.hubqa.arcgis.com:/overview/edit.",
    tags: [""],
    snippet: null,
    thumbnail: null,
    documentation: null,
    extent: [],
    categories: [],
    spatialReference: null,
    accessInformation: null,
    licenseInfo: null,
    culture: "en-us",
    properties: null,
    url: "",
    proxyFilter: null,
    access: "shared",
    size: 7879,
    appCategories: [],
    industries: [],
    languages: [],
    largeThumbnail: null,
    banner: null,
    screenshots: [],
    listed: false,
    ownerFolder: null,
    protected: true,
    commentsEnabled: true,
    numComments: 0,
    numRatings: 0,
    avgRating: 0,
    numViews: 117,
    itemControl: "admin",
    scoreCompleteness: 26,
    groupDesignations: null
  },
  data: {
    source: "PAGEEDITOR",
    folderId: null,
    values: {
      sites: [
        {
          id: "ec2591ff77314f9cb3b392de54470bf0",
          title: "tate-test-56"
        }
      ],
      layout: "page layout",
      updatedAt: "2020-08-25T23:57:20.809Z",
      updatedBy: "atate_dc"
    }
  }
} as unknown) as IModel;

const pageDraft = ({
  item: {
    title: "NEW NEW TITLE",
    snippet: "This is my page"
  },
  data: {
    values: {
      layout: "draft layout"
    }
  }
} as unknown) as IDraft;

describe("applyDraft", () => {
  it("applies a draft resource to a site or page model", async () => {
    const chk = applyDraft(pageModel, pageDraft, false);

    PAGE_DRAFT_INCLUDE_LIST.forEach(path => {
      expect(getProp(chk, path)).toEqual(
        getProp(pageDraft, path),
        `${path} should be same as draft`
      );
    });
  });

  it("returns model if no draft", async () => {
    const chk = applyDraft(pageModel, null, false);
    expect(chk).toBe(pageModel);
  });
});
