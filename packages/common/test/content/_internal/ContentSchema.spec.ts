import { expect } from "vitest";
import { ContentSchema } from "../../../src/content/_internal/ContentSchema";

describe("ContentSchema", () => {
  it("should be an object and contain expected properties", () => {
    expect(typeof ContentSchema).toBe("object");
    // the schema extends HubItemEntitySchema.properties
    expect(ContentSchema.properties).toBeDefined();
    // file adds licenseInfo and schedule
    expect(ContentSchema.properties.licenseInfo).toBeDefined();
    expect(ContentSchema.properties.schedule).toBeDefined();
    // _forceUpdate should exist as an array schema
    expect(ContentSchema.properties._forceUpdate).toBeDefined();
  });
});
