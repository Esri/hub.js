import {
  computeProps,
  deriveLocationFromItemExtent,
  getExtentObject,
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

    expect(chk.location?.type).toBe("item");
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
});

describe("getItemExtent", () => {
  it("getItemExtent isBBox is true", () => {
    const chk = getExtentObject([
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
    expect(chk.type).toBe("item");
  });
});
