import { createPageModelFromTemplate } from "../../src";
import {
  IHubRequestOptions,
  IModelTemplate,
  ITemplateAsset,
  cloneObject,
  deepSet
} from "@esri/hub-common";

describe("createPageModelFromTemplate", () => {
  const template = ({
    item: {
      title: "{{pageTitle}}",
      type: "Hub Page",
      typeKeywords: [
        "Hub",
        "hubPage",
        "hubSolution",
        "JavaScript",
        "Map",
        "Mapping Site",
        "Online Map",
        "OpenData",
        "Ready To Use",
        "selfConfigured",
        "Web Map",
        "Registered App"
      ],
      description: "{{initiative.snippet}}",
      tags: [],
      snippet: "{{initiative.snippet}}",
      thumbnail: null,
      documentation: null,
      categories: [],
      accessInformation: "",
      licenseInfo: "",
      culture: "en-us",
      url: null,
      appCategories: [],
      industries: [],
      languages: [],
      largeThumbnail: null
    },
    data: {
      source: "PAGEEDITOR",
      folderId: null,
      values: {
        layout: {},
        sites: []
      }
    },
    assets: [
      {
        mimeType: "image/png",
        name: "Asset Name",
        url: "foobar.com"
      }
    ] as ITemplateAsset[]
  } as unknown) as IModelTemplate;

  const settings = {
    pageTitle: "Page Title",
    initiative: {
      snippet: "init-snippet"
    }
  } as any;

  const ro = {} as IHubRequestOptions;

  it("creates model from template", async () => {
    const chk = await createPageModelFromTemplate(
      cloneObject(template),
      settings,
      {},
      ro
    );

    expect(chk.item.properties).toEqual({}, "added properties");

    expect(chk.item.snippet).toBe("init-snippet");
    expect(chk.item.description).toBe("init-snippet");
    expect(chk.item.title).toBe("Page Title");
    expect(chk.data.values.slug).toBe("page-title");
  });

  it("handles parentInitiativeId and sites", async () => {
    const localTemplate = cloneObject(template);
    deepSet(localTemplate, "data.values.sites", [
      { id: "template_key_12312" },
      { id: "c9929fca0892406da79f38fe4efcc116" }
    ]);
    deepSet(localTemplate, "item.properties.foo", "bar");

    const localSettings = cloneObject(settings);
    localSettings.initiative.id = "parent-init-id";

    const chk = await createPageModelFromTemplate(
      localTemplate,
      localSettings,
      {},
      ro
    );

    // TODO CHANGE THIS
    expect(chk.data.values.sites).toEqual([
      { id: "c9929fca0892406da79f38fe4efcc116" }
    ]);
    expect(chk.item.properties.parentInitiativeId).toBe("parent-init-id");
    expect(chk.item.properties.foo).toBe("bar", "preserved other properties");
  });
});
