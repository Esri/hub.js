import { saveDraft, SITE_DRAFT_INCLUDE_LIST } from "../../src/drafts";
import * as deleteDraftModule from "../../src/drafts/delete-draft";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as commonModule from "@esri/hub-common";
import { IModel, IHubRequestOptions, getProp } from "@esri/hub-common";

const siteModel = {
  item: {
    id: "ec2591ff77314f9cb3b392de54470bf0",
    owner: "atate_dc",
    orgId: "97KLIFOSt5CxbiRI",
    created: 1595607600000,
    isOrgItem: true,
    modified: 1598380018000,
    guid: null,
    name: null,
    title: "tate-test-5",
    type: "Hub Site Application",
    typeKeywords: [
      "Hub",
      "hubSite",
      "hubSolution",
      "JavaScript",
      "Map",
      "Mapping Site",
      "Online Map",
      "OpenData",
      "Ready To Use",
      "selfConfigured",
      "Web Map",
      "Registered App",
    ],
    description:
      "Create your own initiative by combining existing applications with a custom site. Use this initiative to form teams around a problem and invite your community to participate.",
    tags: ["Hub Site"],
    snippet:
      "Create your own initiative by combining existing applications with a custom site. Use this initiative to form teams around a problem and invite your community to participate.",
    thumbnail: null,
    documentation: null,
    extent: [
      [-77.32808191324128, 38.74173655216708],
      [-76.8191059305754, 39.08220981728297],
    ],
    categories: [],
    spatialReference: null,
    accessInformation: null,
    licenseInfo: null,
    culture: "en-us",
    properties: {
      createdFrom: "premiumDefaultSite Solution Template (embedded)",
      schemaVersion: 1.3,
      hasSeenGlobalNav: true,
      collaborationGroupId: "43260ec215674366a98ffcfab8973a19",
      contentGroupId: "9a1361b7a6924950893017b4df7b58fa",
      followersGroupId: "8bb75d2490f948ab92d1fed36f358aa4",
      parentInitiativeId: "a0dc2b7b41df40d5847444a646bafc35",
      parentId: "embedded-premium-default-site",
      source: "embedded-premium-default-site",
      children: [],
      teams: ["9efdf73400264b6388a71cda080922fc"],
    },
    url: "https://tate-test-5-dc.hubqa.arcgis.com",
    proxyFilter: null,
    access: "public",
    size: 25889,
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
    numViews: 2243,
    itemControl: "admin",
    scoreCompleteness: 28,
    groupDesignations: null,
  },
  data: {
    catalog: {
      groups: ["9a1361b7a6924950893017b4df7b58fa"],
    },
    values: {
      title: "tate-test-56",
      defaultHostname: "tate-test-5-dc.hubqa.arcgis.com",
      subdomain: "tate-test-5",
      public: false,
      faviconUrl: "",
      uiVersion: "2.3",
      map: {
        basemaps: {
          primary: {
            id: "42c841849131429489cb340f171682e0",
            title: "Imagery",
            baseMapLayers: [
              {
                id: "World_Imagery_2017",
                layerType: "ArcGISTiledMapServiceLayer",
                url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                visibility: true,
                opacity: 1,
                title: "World Imagery",
              },
            ],
            operationalLayers: [],
          },
        },
      },
      defaultExtent: {
        xmin: -8608122.702602567,
        ymin: 4684744.77779671,
        xmax: -8551463.755386196,
        ymax: 4733454.274071424,
        spatialReference: {
          wkid: 102100,
        },
      },
      pages: [
        {
          id: "36a1fc3d904e434488e8263b2f14f696",
          title: "New title",
          slug: "boopbeep",
        },
        {
          id: "19c34b88262c4eb8861a0e53f302534f",
          title: "New titl 1",
          slug: "new-titl-1",
        },
      ],
      layout: {
        foo: "bar",
      },
      theme: {
        header: {
          background: "#004da8",
          text: "#a3ff73",
        },
        body: {
          background: "#ffffff",
          text: "#323232",
          link: "#ff00c5",
        },
        button: {
          background: "#0079c1",
          text: "#ffffff",
        },
        logo: {
          small:
            "https://user-images.githubusercontent.com/1218/34112930-11865eba-e3dc-11e7-82d6-4010f818e926.png",
        },
        fonts: {
          base: {
            url: "",
            family: "Avenir Next",
          },
          heading: {
            url: "",
            family: "Avenir Next",
          },
        },
        globalNav: {
          background: "#004da8",
          text: "#a3ff73",
        },
      },
      headerSass:
        ".first-tier {\n  height: 80px;\n  margin-bottom: 0px;\n  background-color: #005e95;\n}\n\n.first-tier .nav > li > a {\n  margin-top: 5px;\n  padding: 3px 6px;\n  color: #fff;\n}\n\n.first-tier .nav > li > a:focus,\n.first-tier .nav>li>a:hover {\n  background-color: #136fbf;\n  color: #fff;\n}\n\n.first-tier .site-logo img {\n  vertical-align: middle;\n}\n\n.first-tier h1 {\n  display: inline;\n  font-size: 25px;\n}\n\n.second-tier {\n  margin-bottom: 0px;\n  background-color: #05466c;\n}\n\n.site-header .navbar-header img {\n  vertical-align: middle;\n  height: 50px;\n  padding: 5px;\n}\n\n@media (max-width: 768px) {\n  .first-tier {\n    height: 100px;\n  }\n}\n\n@media (max-width: 498px) {\n  .navbar-brand {\n    padding: 0px;\n  }\n}\n\n.navbar-inverse .navbar-toggle {\n  border-color: #ffffff;\n}\n\n.navbar-inverse .navbar-toggle:hover {\n  background-color: transparent;\n}\n\n.navbar-inverse .navbar-toggle .icon-bar {\n  background-color: #ffffff;\n}\n\n",
      footerSass:
        "\n  .footer-background {\n    padding-top: 20px;\n    padding-bottom: 20px;\n    background-color: #e7e7e7;\n  }\n\n  .logo, .nav {\n    margin-bottom: 10px;\n  }\n\n  .nav-pills {\n      display: flex;\n      flex-wrap: wrap;\n      justify-content: center;\n  }\n",
      updatedAt: "2020-08-25T18:47:16.762Z",
      updatedBy: "atate_dc",
      capabilities: [
        "api_explorer",
        "pages",
        "my_data",
        "social_logins",
        "json_chart_card",
        "document_iframes",
        "items_view",
        "app_page",
        "globalNav",
        "disableDiscussions",
      ],
      clientId: "jUGHjKmTpOdvZ8mG",
      internalUrl: "tate-test-5-dc.hubqa.arcgis.com",
    },
    source: "embedded-premium-default-site",
  },
} as IModel;

describe("saveDraft", () => {
  it("saves a draft", async () => {
    const deleteSpy = spyOn(deleteDraftModule, "deleteDraft").and.returnValue(
      Promise.resolve()
    );
    const addSpy = spyOn(portalModule, "addItemResource").and.returnValue(
      Promise.resolve()
    );
    const blobSpy = spyOn(commonModule, "objectToJsonBlob").and.returnValue({});

    await saveDraft(siteModel, {} as IHubRequestOptions);

    expect(blobSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();

    const draftResource = blobSpy.calls.argsFor(0)[0];
    SITE_DRAFT_INCLUDE_LIST.forEach((path) => {
      expect(getProp(draftResource, path)).toEqual(
        getProp(siteModel, path),
        `${path} should equal original`
      );
    });
  });
});
