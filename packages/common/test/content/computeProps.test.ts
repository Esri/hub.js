import * as internalContentUtilsModule from "../../src/content/_internal/internalContentUtils";
import { computeProps } from "../../src/content/_internal/computeProps";
import { IHubAdditionalResource } from "../../src/core/types/IHubAdditionalResource";
import {
  IContentExtendedProps,
  IHubEditableContent,
  IServiceExtendedProps,
} from "../../src/core/types/IHubEditableContent";
import { IHubEditableContentEnrichments } from "../../src/items/_enrichments";
import { IHubRequestOptions, IModel } from "../../src/types";
import { cloneObject } from "../../src/util";
import { MOCK_HUB_REQOPTS } from "../mocks/mock-auth";
import * as validateUrlHelpersModule from "../../src/resources/_internal/_validate-url-helpers";

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

  it("adds content extended props for non-service items", () => {
    spyOn(validateUrlHelpersModule, "isService").and.returnValue(false);
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
        type: "Web Map",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Web Map",
      id: "9001",
    };
    const enrichments: IHubEditableContentEnrichments = {
      data: { data: "enrichment" },
      metadata: { metadata: "enrichment" },
    };

    const chk = computeProps(model, content, requestOptions, enrichments);
    const extendedProps = chk.extendedProps as IContentExtendedProps;

    expect(extendedProps.data).toEqual(enrichments.data);
    expect(extendedProps.metadata).toEqual(enrichments.metadata);
    expect(extendedProps.additionalResources).toEqual(additionalResources);
    // NOTE: Remove this check once IHubEditableContent.additionalResources is removed
    expect(chk.additionalResources).toEqual(additionalResources);
    // NOTE: the function is called twice because we still support the deprecated
    // IHubEditableContent.additionalResources property. Once that is removed,
    // this function will only be called once.
    expect(getAdditionalResourcesSpy).toHaveBeenCalledTimes(2);
    expect(getAdditionalResourcesSpy).toHaveBeenCalledWith(
      model.item,
      enrichments.metadata,
      requestOptions
    );
  });

  it("adds service extended props for service items", () => {
    spyOn(validateUrlHelpersModule, "isService").and.returnValue(true);
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
        type: "Web Map",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Web Map",
      id: "9001",
    };
    const enrichments: IHubEditableContentEnrichments = {
      data: { data: "enrichment" },
      metadata: { metadata: "enrichment" },
      server: {
        capabilities: "Extract,Query",
        supportedExportFormats: "csv,geojson",
      } as unknown as IHubEditableContentEnrichments["server"],
    };

    const chk = computeProps(model, content, requestOptions, enrichments);
    const extendedProps = chk.extendedProps as IServiceExtendedProps;

    // TODO: Remove these checks once .serverQueryCapability, .serverExtractCapability, and .serverExtractFormats are removed
    expect(chk.serverExtractCapability).toBeTruthy();
    expect(chk.serverQueryCapability).toBeTruthy();
    expect(chk.serverExtractFormats).toEqual(["csv", "geojson"]);

    expect(extendedProps.serverExtractCapability).toBeTruthy();
    expect(extendedProps.serverQueryCapability).toBeTruthy();
    expect(extendedProps.serverExtractFormats).toEqual(["csv", "geojson"]);

    expect(extendedProps.data).toEqual(enrichments.data);
    expect(extendedProps.metadata).toEqual(enrichments.metadata);
    expect(extendedProps.additionalResources).toEqual(additionalResources);
    // NOTE: Remove this check once IHubEditableContent.additionalResources is removed
    expect(chk.additionalResources).toEqual(additionalResources);
    // NOTE: the function is called twice because we still support the deprecated
    // IHubEditableContent.additionalResources property. Once that is removed,
    // this function will only be called once.
    expect(getAdditionalResourcesSpy).toHaveBeenCalledTimes(2);
    expect(getAdditionalResourcesSpy).toHaveBeenCalledWith(
      model.item,
      enrichments.metadata,
      requestOptions
    );
  });

  it("handles service extended props for service items when enrichments are missing", () => {
    spyOn(validateUrlHelpersModule, "isService").and.returnValue(true);
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
        type: "Web Map",
        id: "9001",
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      type: "Web Map",
      id: "9001",
    };
    const enrichments: IHubEditableContentEnrichments = {
      data: { data: "enrichment" },
      metadata: { metadata: "enrichment" },
    };

    const chk = computeProps(model, content, requestOptions, enrichments);
    const extendedProps = chk.extendedProps as IServiceExtendedProps;

    // TODO: Remove these checks once .serverQueryCapability, .serverExtractCapability, and .serverExtractFormats are removed
    expect(chk.serverExtractCapability).toBeUndefined();
    expect(chk.serverQueryCapability).toBeUndefined();
    expect(chk.serverExtractFormats).toBeUndefined();

    expect(extendedProps.serverExtractCapability).toBeUndefined();
    expect(extendedProps.serverQueryCapability).toBeUndefined();
    expect(extendedProps.serverExtractFormats).toBeUndefined();

    expect(extendedProps.data).toEqual(enrichments.data);
    expect(extendedProps.metadata).toEqual(enrichments.metadata);
    expect(extendedProps.additionalResources).toEqual(additionalResources);
    // NOTE: Remove this check once IHubEditableContent.additionalResources is removed
    expect(chk.additionalResources).toEqual(additionalResources);
    // NOTE: the function is called twice because we still support the deprecated
    // IHubEditableContent.additionalResources property. Once that is removed,
    // this function will only be called once.
    expect(getAdditionalResourcesSpy).toHaveBeenCalledTimes(2);
    expect(getAdditionalResourcesSpy).toHaveBeenCalledWith(
      model.item,
      enrichments.metadata,
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
