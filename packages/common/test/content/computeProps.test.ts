import {
  computeProps,
  deriveLocationFromItemExtent,
  getExtentObject,
} from "../../src/content/_internal/computeProps";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import { IItemAndIServerEnrichments } from "../../src/items/_enrichments";
import { IHubRequestOptions, IModel } from "../../src/types";
import { cloneObject } from "../../src/util";
import { MOCK_HUB_REQOPTS } from "../mocks/mock-auth";

describe("content computeProps", () => {
  let requestOptions: IHubRequestOptions;
  beforeEach(async () => {
    requestOptions = cloneObject(MOCK_HUB_REQOPTS);
  });

  it("handles when properties are undefined", () => {
    const model: IModel = {
      item: {
        type: "Feature Service",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      },
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

  it("handles when boundary is undefined", () => {
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

  it("handles when boundary defined as none", () => {
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

  it("adds server based enrichments if available", () => {
    const model: IModel = {
      item: {
        type: "Feature Service",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {},
      },
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
    };
    const enrichments: IItemAndIServerEnrichments = {
      server: { capabilities: "Extract" },
    };

    const chk = computeProps(model, content, requestOptions, enrichments);
    expect(chk.serverExtractCapability).toBeTruthy();
  });

  it("handles when authentication isn't defined", () => {
    const model: IModel = {
      item: {
        type: "Feature Service",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {},
      },
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Feature Service",
      id: "9001",
    };
    const withoutAuth = cloneObject(requestOptions);
    delete withoutAuth.authentication;

    const chk = computeProps(model, content, withoutAuth);
    expect(chk.thumbnail).toBeUndefined();
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
