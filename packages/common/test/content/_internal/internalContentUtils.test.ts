import type { IItem } from "@esri/arcgis-rest-types";
import {
  getContentEditUrl,
  getExtentObject,
  deriveLocationFromItem,
  getHubRelativeUrl,
} from "../../../src/content/_internal/internalContentUtils";
import * as internalContentUtils from "../../../src/content/_internal/internalContentUtils";
import * as Compose from "../../../src/content/compose";
import { IHubRequestOptions } from "../../../src/hub-types";
import { cloneObject } from "../../../src/util";
import { MOCK_HUB_REQOPTS } from "../../mocks/mock-auth";
import { IHubLocation } from "../../../src";
import * as _enrichmentsModule from "../../../src/items/_enrichments";

describe("getContentEditUrl", () => {
  let requestOptions: IHubRequestOptions;
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {});
  });
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

describe("getExtentObject", () => {
  it("getExtentObject isBBox is true", () => {
    const chk = getExtentObject([
      [100, 100],
      [120, 120],
    ]);
    expect(chk.xmin).toBe(100);
    expect(chk.ymin).toBe(100);
    expect(chk.xmax).toBe(120);
    expect(chk.ymax).toBe(120);
  });
  it("getExtentObject isBBox is true", () => {
    const chk = getExtentObject([]);
    expect(chk).toBeUndefined();
  });
});

describe("deriveLocationFromItem", () => {
  const item: IItem = {
    type: "Dashboard",
    id: "9001",
    created: new Date().getTime(),
    modified: new Date().getTime(),
    properties: {},
    typeKeywords: ["ArcGIS Dashboards"],
  } as IItem;
  it("should return existing IHubLocation", () => {
    const _item = cloneObject(item);
    const location = {
      type: "custom",
      extent: [[0], [0]],
    } as IHubLocation;
    _item.properties = {
      location,
    };
    const chk = deriveLocationFromItem(_item);
    expect(chk).toEqual(location);
  });
  it("should return boundary if type none", () => {
    const _item = cloneObject(item);
    _item.properties = {
      boundary: { type: "none" },
    };
    const chk = deriveLocationFromItem(_item);
    expect(chk).toEqual({ type: "none" });
  });
  it("should return boundary if no extent on item", () => {
    const _item = cloneObject(item);
    const chk = deriveLocationFromItem(_item);
    expect(chk).toEqual({ type: "none" });
  });
  it("should set correct location source type based on item type", () => {
    const isSiteTypeSpy = spyOn(Compose, "isSiteType").and.callThrough();
    const _item = cloneObject(item);
    _item.type = "Site Application";
    _item.extent = [
      [0, 0],
      [0, 0],
    ];
    const chk = deriveLocationFromItem(_item);
    expect(chk.type).toEqual("org");
    expect(isSiteTypeSpy).toHaveBeenCalled();
    expect(isSiteTypeSpy).toHaveBeenCalledWith("Site Application");
    _item.type = "Feature Service";
    const chk2 = deriveLocationFromItem(_item);
    expect(chk2.type).toEqual("custom");
  });
  it("should create custom location from item extent", () => {
    const getExtentObjectSpy = spyOn(
      internalContentUtils,
      "getExtentObject"
    ).and.callThrough();
    const _item = cloneObject(item);
    _item.extent = [
      [0, 0],
      [0, 0],
    ];
    const chk = deriveLocationFromItem(_item);
    expect(chk).toEqual({
      type: "custom",
      extent: [
        [0, 0],
        [0, 0],
      ],
      geometries: [
        {
          xmin: 0,
          ymin: 0,
          xmax: 0,
          ymax: 0,
          spatialReference: {
            wkid: 4326,
          },
          type: "extent",
        } as any,
      ],
      spatialReference: {
        wkid: 4326,
      },
    });
  });
  it("should construct location from geojson if getExtentObject undefined", () => {
    const _item = cloneObject(item);
    _item.spatialReference = "102100" as any;
    _item.extent = {
      type: "Polygon",
      coordinates: [
        [
          [-14999967.4259, 6499962.1704],
          [-6200050.3592, 6499962.1704],
          [-6200050.3592, 2352563.6343],
          [-14999967.4259, 2352563.6343],
          [-14999967.4259, 6499962.1704],
        ],
      ],
    } as any;
    const chk = deriveLocationFromItem(_item);
    expect(chk).toEqual({
      type: "custom",
      extent: [
        [-14999967.4259, 2352563.6343],
        [-6200050.3592, 6499962.1704],
      ],
      geometries: [
        {
          type: "polygon",
          rings: [
            [
              [-14999967.4259, 6499962.1704],
              [-6200050.3592, 6499962.1704],
              [-6200050.3592, 2352563.6343],
              [-14999967.4259, 2352563.6343],
              [-14999967.4259, 6499962.1704],
            ],
          ],
          spatialReference: {
            wkid: 102100,
          } as any,
        } as any,
      ],
      spatialReference: {
        wkid: 102100,
      },
    });
  });
  it("should construct location from geojson and return default spatial reference if none defined", () => {
    const _item = cloneObject(item);
    _item.extent = {
      type: "Polygon",
      coordinates: [
        [
          [-14999967.4259, 6499962.1704],
          [-6200050.3592, 6499962.1704],
          [-6200050.3592, 2352563.6343],
          [-14999967.4259, 2352563.6343],
          [-14999967.4259, 6499962.1704],
        ],
      ],
    } as any;
    const chk = deriveLocationFromItem(_item);
    expect(chk).toEqual({
      type: "custom",
      extent: [
        [-14999967.4259, 2352563.6343],
        [-6200050.3592, 6499962.1704],
      ],
      geometries: [
        {
          type: "polygon",
          rings: [
            [
              [-14999967.4259, 6499962.1704],
              [-6200050.3592, 6499962.1704],
              [-6200050.3592, 2352563.6343],
              [-14999967.4259, 2352563.6343],
              [-14999967.4259, 6499962.1704],
            ],
          ],
          spatialReference: {
            wkid: 4326,
          } as any,
        } as any,
      ],
      spatialReference: {
        wkid: 4326,
      },
    });
  });
});

describe("getHubRelativeUrl", () => {
  describe("handle when there is an identifier", () => {
    const identifier = "a-slug";
    it("should handle a family that does not have a puralized route", () => {
      // 'report template' should be in the 'content' family
      const result = getHubRelativeUrl("report template", identifier);
      expect(result).toBe(`/content/${identifier}`);
    });
    it("should handle initiatives", () => {
      const result = getHubRelativeUrl("Hub Initiative", identifier);
      expect(result).toBe(`/initiatives/${identifier}`);
    });
    it("should handle projects", () => {
      const result = getHubRelativeUrl("Hub Project", identifier);
      expect(result).toBe(`/projects/${identifier}`);
    });
    it("should handle initiative templates", () => {
      let result = getHubRelativeUrl("Hub Initiative", identifier, [
        "hubInitiativeTemplate",
      ]);
      expect(result).toBe(`/initiatives/templates/${identifier}/about`);
      result = getHubRelativeUrl("Hub Initiative Template", identifier);
      expect(result).toBe(`/initiatives/templates/${identifier}/about`);
    });
    it("should handle solution templates", () => {
      let result = getHubRelativeUrl("Web Mapping Application", identifier, [
        "hubSolutionTemplate",
      ]);
      expect(result).toBe(`/templates/${identifier}/about`);
      result = getHubRelativeUrl("Web Mapping Application", identifier);
      expect(result).toBe(`/apps/${identifier}`);
      result = getHubRelativeUrl("Solution", identifier);
      expect(result).toBe(`/templates/${identifier}/about`);
      result = getHubRelativeUrl("Solution", identifier, ["Deployed"]);
      expect(result).toBe(`/content/${identifier}/about`);
    });
    it("should handle feedback", () => {
      const result = getHubRelativeUrl("Form", identifier);
      expect(result).toBe(`/feedback/surveys/${identifier}`);
    });
    it("should handle discussion", () => {
      const result = getHubRelativeUrl("Discussion", identifier);
      expect(result).toBe(`/discussions/${identifier}`);
    });
  });
  describe("handle when there is no identifier", () => {
    it("should handle a family that does not have a puralized route", () => {
      // 'report template' should be in the 'content' family
      let result = getHubRelativeUrl("report template");
      expect(result).toBe("");
      result = getHubRelativeUrl("StoryMap");
      expect(result).toBe("");
    });
    it("should handle initiatives", () => {
      const result = getHubRelativeUrl("Hub Initiative");
      expect(result).toBe(`/initiatives`);
    });
    it("should handle projects", () => {
      const result = getHubRelativeUrl("Hub Project");
      expect(result).toBe(`/projects`);
    });
    it("should handle feedback", () => {
      const result = getHubRelativeUrl("Form");
      expect(result).toBe("");
    });
    it("should handle discussion", () => {
      const result = getHubRelativeUrl("Discussion");
      expect(result).toBe("");
    });
  });
});
