import {
  computeProps,
  deriveLocationFromItemExtent,
  getItemExtent,
} from "../../src/content/_internal/computeProps";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import { IHubRequestOptions, IModel } from "../../src/types";
import { cloneObject } from "../../src/util";
import { MOCK_HUB_REQOPTS } from "../mocks/mock-auth";

describe("content computeProps", () => {
  let requestOptions: IHubRequestOptions;
  beforeEach(async () => {
    requestOptions = cloneObject(MOCK_HUB_REQOPTS);
  });

  it("computeProps model boundary undefined", () => {
    const model: IModel = {
      item: {
        type: "Feature Service",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          // nothing set in properties
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.location?.type).toBe("custom");
  });

  it("computeProps boundary defined as none", () => {
    const model: IModel = {
      item: {
        type: "Feature Service",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.location?.type).toBe("none");
  });

  it("adds relative link when no slug is available", () => {
    const model: IModel = {
      item: {
        type: "Feature Service",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.siteRelative).toBe("/maps/9001");
  });

  it("adds relative link when a slug is available", () => {
    const model: IModel = {
      item: {
        type: "Feature Service",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.siteRelative).toBe("/maps/my-slug");
  });

  it("adds storymap content edit link for storymap item type", () => {
    const model: IModel = {
      item: {
        type: "StoryMap",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://storymaps.arcgis.com/stories/9001/edit"
    );
  });

  it("adds Insights content edit link for Insights Page item type", () => {
    const model: IModel = {
      item: {
        type: "Insights Page",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://insights.arcgis.com/#/edit/9001"
    );
  });

  it("adds Insights content edit link for Insights item type", () => {
    const model: IModel = {
      item: {
        type: "Insights",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://insights.arcgis.com/#/edit/9001"
    );
  });

  it("adds Insights content edit link for Insights Workbook item type", () => {
    const model: IModel = {
      item: {
        type: "Insights Workbook",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://insights.arcgis.com/#/edit/9001"
    );
  });

  it("adds Web Experience content edit link for Web Experience item type", () => {
    const model: IModel = {
      item: {
        type: "Web Experience",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://experience.arcgis.com/builder/?id=9001"
    );
  });

  it("adds Web AppBuilder content edit link for Web AppBuilder item type", () => {
    const model: IModel = {
      item: {
        type: "AppBuilder Extension",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
        typeKeywords: ["Web AppBuilder"],
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://myorg.maps.arcgis.com/apps/webappbuilder/index.html?id=9001"
    );
  });

  it("adds Survey123 content edit link for Surve123 Form item type", () => {
    const model: IModel = {
      item: {
        type: "Form",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
        typeKeywords: ["Survey123"],
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://survey123.arcgis.com/surveys/9001/design?portalUrl=https://myorg.maps.arcgis.com"
    );
  });

  it("adds item home link for Survey123 Connect item type", () => {
    const model: IModel = {
      item: {
        type: "Form",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
        typeKeywords: ["Survey123 Connect"],
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://myorg.maps.arcgis.com/home/item.html?id=9001"
    );
  });

  it("adds StoryMap content edit link for StoryMap item type", () => {
    const model: IModel = {
      item: {
        type: "StoryMap",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://storymaps.arcgis.com/stories/9001/edit"
    );
  });

  it("adds Urban Model content edit link for Urban Model item type", () => {
    const model: IModel = {
      item: {
        type: "Urban Model",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe("https://urban.arcgis.com/?id=9001");
  });

  it("adds Dashboard content edit link for Dashboard item type", () => {
    const model: IModel = {
      item: {
        type: "Dashboard",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://myorg.maps.arcgis.com/apps/opsdashboard/index.html#/9001?mode=edit"
    );
  });

  it("adds ArcGIS Dashboard content edit link for Dashboard item type", () => {
    const model: IModel = {
      item: {
        type: "Dashboard",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
        typeKeywords: ["ArcGIS Dashboards"],
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://myorg.maps.arcgis.com/apps/dashboards/9001#mode=edit"
    );
  });

  it("adds Storymap content edit link for Web Mapping Application item type with story map type keyword", () => {
    const model: IModel = {
      item: {
        type: "Web Mapping Application",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
        typeKeywords: ["Story Map"],
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://storymaps.arcgis.com/stories/9001/edit"
    );
  });

  it("adds Experience builder content edit link for Web Mapping Experience item type with EXB Experience type keyword", () => {
    const model: IModel = {
      item: {
        type: "Web Mapping Experience",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
        typeKeywords: ["EXB Experience"],
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://experience.arcgis.com/builder/?id=9001"
    );
  });

  it("adds Insights portal content edit link for Insights Workbook item type", () => {
    const model: IModel = {
      item: {
        type: "Insights Workbook",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    requestOptions.portal = "https://myserver.gis";

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://myserver.gis/home/item.html?id=9001"
    );
  });

  it("adds Urban Model content edit link for Urban Model item type", () => {
    const model: IModel = {
      item: {
        type: "Urban Model",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
      slug: "my-slug",
      // no location set
    };

    requestOptions.portal = "https://myserver.gis";

    const chk = computeProps(model, content, requestOptions);

    expect(chk.links.contentEditUrl).toBe(
      "https://myserver.gis/home/item.html?id=9001"
    );
  });
});

describe("getItemExtent", () => {
  it("getItemExtent isBBox is true", () => {
    const chk = getItemExtent([
      [100, 100],
      [120, 120],
    ]);
    expect(chk.xmin).toBe(100);
    expect(chk.ymin).toBe(100);
    expect(chk.xmax).toBe(120);
    expect(chk.ymax).toBe(120);
  });
});

describe("deriveLocationFromItemExtent", () => {
  it("deriveLocationFromItemExtent valid extent", () => {
    const chk = deriveLocationFromItemExtent([
      [100, 100],
      [120, 120],
    ]);
    expect(chk.geometries?.length).toBe(1);
    expect(chk.type).toBe("custom");
  });
});
