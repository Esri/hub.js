import { IItem } from "@esri/arcgis-rest-types";
import { getContentEditUrl } from "../../../src/content/_internal/internalContentUtils";
import { IHubRequestOptions, IModel } from "../../../src/types";
import { cloneObject } from "../../../src/util";
import { MOCK_HUB_REQOPTS } from "../../mocks/mock-auth";

describe("getContentEditUrl", () => {
  let requestOptions: IHubRequestOptions;
  beforeEach(async () => {
    requestOptions = cloneObject(MOCK_HUB_REQOPTS);
  });

  it("adds storymap content edit link for storymap item type", () => {
    const item: IItem = {
      type: "StoryMap",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe("https://storymaps.arcgis.com/stories/9001/edit");
  });

  it("adds Insights content edit link for Insights Page item type", () => {
    const item: IItem = {
      type: "Insights Page",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe("https://myorg.maps.arcgis.com/home/item.html?id=9001");
  });

  it("adds Insights content edit link for Insights item type", () => {
    const item: IItem = {
      type: "Insights",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe("https://myorg.maps.arcgis.com/home/item.html?id=9001");
  });

  it("adds Insights content edit link for Insights Workbook item type", () => {
    const item: IItem = {
      type: "Insights Workbook",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe("https://insights.arcgis.com/#/edit/9001");
  });

  it("adds Web Experience content edit link for Web Experience item type", () => {
    const item: IItem = {
      type: "Web Experience",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe("https://experience.arcgis.com/builder/?id=9001");
  });

  it("adds Web AppBuilder content edit link for Web AppBuilder item type", () => {
    const item: IItem = {
      type: "AppBuilder Extension",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
      typeKeywords: ["Web AppBuilder"],
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe(
      "https://myorg.maps.arcgis.com/apps/webappbuilder/index.html?id=9001"
    );
  });

  it("adds Survey123 content edit link for Surve123 Form item type", () => {
    const item: IItem = {
      type: "Form",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
      typeKeywords: ["Survey123"],
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe(
      "https://survey123.arcgis.com/surveys/9001/design?portalUrl=https://myorg.maps.arcgis.com"
    );
  });

  it("adds item home link for Survey123 Connect item type", () => {
    const item: IItem = {
      type: "Form",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
      typeKeywords: ["Survey123 Connect"],
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe("https://myorg.maps.arcgis.com/home/item.html?id=9001");
  });

  it("adds StoryMap content edit link for StoryMap item type", () => {
    const item: IItem = {
      type: "StoryMap",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe("https://storymaps.arcgis.com/stories/9001/edit");
  });

  it("adds Urban Model content edit link for Urban Model item type", () => {
    const item: IItem = {
      type: "Urban Model",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe("https://urban.arcgis.com/?id=9001");
  });

  it("adds Dashboard content edit link for Dashboard item type", () => {
    const item: IItem = {
      type: "Dashboard",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe(
      "https://myorg.maps.arcgis.com/apps/opsdashboard/index.html#/9001?mode=edit"
    );
  });

  it("adds ArcGIS Dashboard content edit link for Dashboard item type", () => {
    const item: IItem = {
      type: "Dashboard",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
      typeKeywords: ["ArcGIS Dashboards"],
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe(
      "https://myorg.maps.arcgis.com/apps/dashboards/9001#mode=edit"
    );
  });

  it("adds Storymap content edit link for Web Mapping Application item type with story map type keyword", () => {
    const item: IItem = {
      type: "Web Mapping Application",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
      typeKeywords: ["Story Map"],
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe("https://storymaps.arcgis.com/stories/9001/edit");
  });

  it("adds Experience builder content edit link for Web Mapping Experience item type with EXB Experience type keyword", () => {
    const item: IItem = {
      type: "Web Mapping Experience",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
      typeKeywords: ["EXB Experience"],
    } as IItem;

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe("https://experience.arcgis.com/builder/?id=9001");
  });

  it("adds Insights portal content edit link for Insights Workbook item type", () => {
    const item: IItem = {
      type: "Insights Workbook",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
    } as IItem;

    requestOptions.portal = "https://myserver.gis";

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe("https://myserver.gis/home/item.html?id=9001");
  });

  it("adds Urban Model content edit link for Urban Model item type", () => {
    const item: IItem = {
      type: "Urban Model",
      id: "9001",
      created: new Date().getTime(),
      modified: new Date().getTime(),
      properties: {
        boundary: "none",
      },
    } as IItem;

    requestOptions.portal = "https://myserver.gis";

    const chk = getContentEditUrl(item, requestOptions);

    expect(chk).toBe("https://myserver.gis/home/item.html?id=9001");
  });
});
