import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as checkPerm from "../../../src/permissions/checkPermission";
import { getSiteSchema } from "../../../src/sites/_internal/SiteSchema";
import {
  ENTERPRISE_SITE_ENTITY_NAME_SCHEMA,
  SITE_ENTITY_NAME_SCHEMA,
} from "../../../src/core/schemas/shared/subschemas";

describe("SiteSchema getSiteSchema", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns enterprise name schema when permission grants access", () => {
    vi.spyOn(checkPerm, "checkPermission").mockReturnValue({
      access: true,
    } as any);
    const schema = getSiteSchema("site123", {} as any);
    expect(schema.properties.name).toBe(ENTERPRISE_SITE_ENTITY_NAME_SCHEMA);
  });

  it("returns site name schema when permission denies access", () => {
    vi.spyOn(checkPerm, "checkPermission").mockReturnValue({
      access: false,
    } as any);
    const schema = getSiteSchema("site123", {} as any);
    expect(schema.properties.name).toBe(SITE_ENTITY_NAME_SCHEMA);
  });
});
