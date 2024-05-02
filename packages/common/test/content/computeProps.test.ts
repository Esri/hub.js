import * as internalContentUtilsModule from "../../src/content/_internal/internalContentUtils";
import { computeProps } from "../../src/content/_internal/computeProps";
import { IHubAdditionalResource } from "../../src/core/types/IHubAdditionalResource";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import { IHubEditableContentEnrichments } from "../../src/items/_enrichments";
import { IHubRequestOptions, IModel } from "../../src/types";
import { cloneObject } from "../../src/util";
import { MOCK_HUB_REQOPTS } from "../mocks/mock-auth";

describe("content computeProps", () => {
  let requestOptions: IHubRequestOptions;
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {});
  });
  beforeEach(async () => {
    requestOptions = cloneObject(MOCK_HUB_REQOPTS);
  });

  it("handles when properties are undefined", () => {
    const model: IModel = {
      item: {
        extent: [
          [0, 0],
          [0, 0],
        ],
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

    expect(chk.location?.type).toBe("custom");
  });

  it("handles when boundary is undefined", () => {
    const model: IModel = {
      item: {
        extent: [
          [0, 0],
          [0, 0],
        ],
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

    expect(chk.location?.type).toBe("custom");
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
    const enrichments: IHubEditableContentEnrichments = {
      server: {
        capabilities: "Extract",
        supportedExportFormats: "csv,geojson",
      } as unknown as IHubEditableContentEnrichments["server"],
    };

    const chk = computeProps(model, content, requestOptions, enrichments);
    expect(chk.serverExtractCapability).toBeTruthy();
    expect(chk.serverExtractFormats).toEqual(["csv", "geojson"]);
  });

  it("calculates additionalResources if available", () => {
    const metadata = { key: "value" } as any;
    const enrichments: IHubEditableContentEnrichments = { metadata };
    const additionalResources: IHubAdditionalResource[] = [
      {
        name: "My Resource",
        url: "https://example.com/my-resource",
        isDataSource: false,
      },
    ];
    const getAdditionalResourcesSpy = spyOn(
      internalContentUtilsModule,
      "getAdditionalResources"
    ).and.returnValue(additionalResources);

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

    const chk = computeProps(model, content, requestOptions, enrichments);
    expect(chk.additionalResources).toEqual(additionalResources);
    expect(getAdditionalResourcesSpy).toHaveBeenCalledTimes(1);
    expect(getAdditionalResourcesSpy).toHaveBeenCalledWith(
      model.item,
      metadata,
      requestOptions
    );
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
