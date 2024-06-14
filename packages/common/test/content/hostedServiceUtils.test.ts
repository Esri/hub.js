import { IItem } from "@esri/arcgis-rest-portal";
import { IFeatureServiceDefinition } from "@esri/arcgis-rest-types";
import { IHubEditableContent } from "../../src";
import {
  hasServiceCapability,
  isHostedFeatureServiceEntity,
  isHostedFeatureServiceItem,
  isHostedFeatureServiceMainEntity,
  isHostedFeatureServiceMainItem,
  ServiceCapabilities,
  toggleServiceCapability,
} from "../../src/content/hostedServiceUtils";

// NOTE: isHostedFeatureServiceItem is deprecated. Remove this test when the function is removed.
describe("isHostedFeatureServiceItem", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {});
  });
  it("returns true for hosted feature service items", () => {
    const item = {
      type: "Feature Service",
      typeKeywords: ["Hosted Service"],
    } as IItem;

    expect(isHostedFeatureServiceItem(item)).toBeTruthy();
  });

  it("returns false for other items", () => {
    const item = { type: "PDF" } as IItem;
    expect(isHostedFeatureServiceItem(item)).toBeFalsy();
  });
});

describe("isHostedFeatureServiceMainItem", () => {
  it("returns true for hosted feature service main items", () => {
    const item = {
      type: "Feature Service",
      typeKeywords: ["Hosted Service"],
    } as IItem;

    expect(isHostedFeatureServiceMainItem(item)).toBeTruthy();
  });

  it("returns false for hosted feature service reference items", () => {
    const item = {
      type: "Feature Service",
    } as IItem;

    expect(isHostedFeatureServiceMainItem(item)).toBeFalsy();
  });

  it("returns false for other items", () => {
    const item = { type: "PDF" } as IItem;
    expect(isHostedFeatureServiceMainItem(item)).toBeFalsy();
  });
});

// NOTE: isHostedFeatureServiceEntity is deprecated. Remove this test when the function is removed.
describe("isHostedFeatureServiceEntity", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {});
  });
  it("returns true for hosted feature service content entities", () => {
    const entity = {
      type: "Feature Service",
      typeKeywords: ["Hosted Service"],
    } as IHubEditableContent;

    expect(isHostedFeatureServiceEntity(entity)).toBeTruthy();
  });

  it("returns false for other content entities", () => {
    const entity = { type: "PDF" } as IHubEditableContent;
    expect(isHostedFeatureServiceEntity(entity)).toBeFalsy();
  });
});

describe("isHostedFeatureServiceMainEntity", () => {
  it("returns true for main hosted feature service content entities", () => {
    const entity = {
      type: "Feature Service",
      typeKeywords: ["Hosted Service"],
    } as IHubEditableContent;

    expect(isHostedFeatureServiceMainEntity(entity)).toBeTruthy();
  });

  it("returns false for reference hosted feature service content entities", () => {
    const entity = {
      type: "Feature Service",
    } as IHubEditableContent;

    expect(isHostedFeatureServiceMainEntity(entity)).toBeFalsy();
  });

  it("returns false for other content entities", () => {
    const entity = { type: "PDF" } as IHubEditableContent;
    expect(isHostedFeatureServiceMainEntity(entity)).toBeFalsy();
  });
});

describe("hasServiceCapability", () => {
  it("returns false when no capabilities are defined", () => {
    const result = hasServiceCapability(
      ServiceCapabilities.EXTRACT,
      {} as Partial<IFeatureServiceDefinition>
    );
    expect(result).toBeFalsy();
  });
  it("returns false when capability is not included in the list", () => {
    const result = hasServiceCapability(ServiceCapabilities.EXTRACT, {
      capabilities: "Query",
    } as Partial<IFeatureServiceDefinition>);
    expect(result).toBeFalsy();
  });
  it("returns true when capability is included in the list", () => {
    const result = hasServiceCapability(ServiceCapabilities.EXTRACT, {
      capabilities: "Query,Extract",
    } as Partial<IFeatureServiceDefinition>);
    expect(result).toBeTruthy();
  });
});

describe("toggleServiceCapability", () => {
  it("turns capability on if none are defined", () => {
    const result = toggleServiceCapability(
      ServiceCapabilities.EXTRACT,
      {} as Partial<IFeatureServiceDefinition>
    );
    expect(result.capabilities).toBe("Extract");
  });
  it("turns capability on if not present", () => {
    const result = toggleServiceCapability(ServiceCapabilities.EXTRACT, {
      capabilities: "Query",
    } as Partial<IFeatureServiceDefinition>);
    expect(result.capabilities).toBe("Query,Extract");
  });
  it("turns capability off if present", () => {
    const result = toggleServiceCapability(ServiceCapabilities.EXTRACT, {
      capabilities: "Query,Extract",
    } as Partial<IFeatureServiceDefinition>);
    expect(result.capabilities).toBe("Query");
  });
});
