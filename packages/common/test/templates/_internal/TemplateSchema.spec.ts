import { describe, it, expect } from "vitest";
import { TemplateSchema } from "../../../src/templates/_internal/TemplateSchema";

describe("TemplateSchema", () => {
  it("exposes previewUrl property", () => {
    expect(TemplateSchema.properties).toBeDefined();
    const props = TemplateSchema.properties as Record<string, any>;
    expect(props.previewUrl).toBeDefined();
    expect(props.previewUrl.type).toBe("string");
  });
});
