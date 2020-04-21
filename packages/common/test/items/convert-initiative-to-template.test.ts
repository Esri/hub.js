import * as portal from "@esri/arcgis-rest-portal";
import {
  cloneObject,
  convertInitiativeToTemplate,
  IInitiativeModel,
  IHubRequestOptions
} from "../../src";
import { getProp } from "../../src";

describe("convertInitiativeToTemplate", function() {
  const defaultModel = {
    item: {
      id: "8e68c8621fe449cfaf566a49c329042",
      owner: "dbouwman_dc",
      created: 1551282352000,
      isOrgItem: true,
      modified: 1585242175000,
      guid: null,
      name: null,
      title: "00 Super Dave Initiative",
      type: "Hub Initiative",
      typeKeywords: ["Hub", "hubInitiativeTemplate", "OpenData"],
      description:
        "Create your own initiative by combining existing applications with a custom site.",
      tags: [],
      snippet:
        "Create your own initiative by combining existing applications with a custom site. a test",
      thumbnail: null,
      documentation: null,
      extent: [],
      categories: [],
      spatialReference: null,
      accessInformation: null,
      licenseInfo: "CC-BY-SA",
      culture: "en-us",
      properties: {
        schemaVersion: 2.1,
        demoUrl: "foo.com",
        previewUrl: "https://blank-roob-dc.hubqa.arcgis.com",
        followersGroupId: "4e6726e5478b41eb90045ba07f715737",
        collaborationGroupId: "ef3",
        groupId: "bc3",
        contentGroupId: "ff3"
      },
      url:
        "https://hubqa.arcgis.com/admin/initiatives/8e68c8621fe449cfaf566a49c4329042",
      proxyFilter: null,
      access: "shared",
      size: -1,
      appCategories: [],
      industries: [],
      languages: [],
      largeThumbnail: null,
      banner: null,
      screenshots: [],
      listed: false,
      ownerFolder: null,
      protected: false,
      numComments: 0,
      numRatings: 0,
      avgRating: 0,
      numViews: 2328,
      scoreCompleteness: 58,
      groupDesignations: null
    },
    data: {
      assets: [],
      steps: [
        {
          id: "informTools",
          title: "Inform the Public",
          description:
            "Share data about your initiative with the public so people can easily find, download and use your data in different formats.",
          templateIds: ["786a5ed8426041e8a6ecf89f862a7480"],
          itemIds: [],
          templateItems: [],
          configuredItems: []
        },
        {
          id: "listenTools",
          title: "Listen to the Public",
          description:
            "Create ways to gather citizen feedback to help inform your city officials.",
          templateIds: ["746b012cf4fc4576978fca2ab1d82580"],
          itemIds: [],
          templateItems: [],
          configuredItems: []
        },
        {
          id: "monitorTools",
          title: "Monitor Progress",
          description:
            "Establish performance measures that incorporate the publics perspective.",
          templateIds: ["db1782a739434238a3082137c2bdf477"],
          itemIds: [],
          templateItems: [],
          configuredItems: []
        }
      ],
      indicators: [],
      values: {
        collaborationGroupId: "NOTSET",
        openDataGroupId: "NOTSET",
        followerGroups: [],
        bannerImage: {
          source: "bannerImage",
          display: {
            position: {
              x: "center",
              y: "center"
            }
          }
        },
        followersGroupId: "4e6726e5478b41eb90045ba07f715737"
      },
      recommendedTemplates: [
        "786a5ed8426041e8a6ecf89f862a7480",
        "746b012cf4fc4576978fca2ab1d82580",
        "db1782a739434238a3082137c2bdf477"
      ]
    }
  } as IInitiativeModel;

  const ro = ({} as any) as IHubRequestOptions;

  it("basic conversion logic", async function() {
    // mock the resources call
    spyOn(portal, "getItemResources").and.returnValue(
      Promise.resolve({ resources: [] })
    );
    const model = cloneObject(defaultModel) as IInitiativeModel;

    const tmpl = await convertInitiativeToTemplate(model, ro);

    // top level props
    ["item", "data", "itemId", "key"].forEach(prop => {
      expect(tmpl[prop]).toBeTruthy(`should have ${prop} top level property`);
    });
    // verify the item is stripped
    expect(tmpl.item.url).toBeUndefined("url should be stripped");
    expect(tmpl.resources).toBeDefined("should have resources array");
    expect(tmpl.resources.length).toBe(0, "should have 0 resources");
  });

  it("converts steps", async function() {
    // mock the resources call
    spyOn(portal, "getItemResources").and.returnValue(
      Promise.resolve({ resources: [] })
    );

    const model = cloneObject(defaultModel);
    // kill the recommendedTemplates
    delete model.data.recommendedTemplates;

    const tmpl = await convertInitiativeToTemplate(model, ro);
    // const tmpl = await Promise.resolve(model) as any;
    expect(tmpl.resources).toBeDefined("should have resources array");
    expect(tmpl.resources.length).toBe(0, "should have 0 resources");
    expect(getProp(tmpl, "data.recommendedTemplates")).toBeDefined(
      "should create the rec tmpls array"
    );
    expect(getProp(tmpl, "data.recommendedTemplates.length")).toBe(
      defaultModel.data.recommendedTemplates.length,
      "should have correct rec tmpls entries"
    );
    defaultModel.data.recommendedTemplates.forEach((tmplId: string) => {
      expect(getProp(tmpl, "data.recommendedTemplates")).toContain(
        tmplId,
        `recommended should include ${tmplId} but does not`
      );
    });
    expect(tmpl.data.steps).toBeDefined("data.steps not removed from template");
  });

  it("keeps recommended", async function() {
    // mock the resources call
    spyOn(portal, "getItemResources").and.returnValue(
      Promise.resolve({ resources: [] })
    );

    const model = cloneObject(defaultModel);
    // kill the steps
    delete model.data.steps;

    const tmpl = await convertInitiativeToTemplate(model, ro);
    expect(tmpl.resources).toBeDefined("should have resources array");
    expect(tmpl.resources.length).toBe(0, "should have 0 resources");
    expect(tmpl.data.recommendedTemplates).toBeDefined(
      "should keep the rec tmpls array"
    );
    expect(tmpl.data.recommendedTemplates.length).toBe(
      model.data.recommendedTemplates.length,
      "should keep the rec tmpls entries"
    );
  });

  it("attaches resources", async function() {
    // mock the resources call
    spyOn(portal, "getItemResources").and.returnValue(
      Promise.resolve({
        resources: [
          {
            resource: "some resource"
          },
          {
            resource: "another resource"
          }
        ]
      })
    );

    const model = cloneObject(defaultModel);

    const tmpl = await convertInitiativeToTemplate(model, ro);
    // assert all the things
    expect(tmpl.resources).toBeDefined("should have resources array");
    expect(tmpl.resources.length).toBe(2, "should have 2 resources");
  });
});
