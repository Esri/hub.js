import { buildUiSchema as buildUiSchemaFollowers } from "../../../src/sites/_internal/SiteUiSchemaFollowers";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as checkPermissionModule from "../../../src/permissions/checkPermission";
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from "vitest";

describe("SiteUiSchemaFollowers", () => {
  beforeEach(() => {
    vi.spyOn(getLocationExtentModule, "getLocationExtent").mockReturnValue(
      Promise.resolve([]) as any
    );
    vi.spyOn(getLocationOptionsModule, "getLocationOptions").mockReturnValue(
      Promise.resolve([]) as any
    );
    vi.spyOn(checkPermissionModule, "checkPermission").mockReturnValue(
      false as any
    );
  });

  it("builds followers ui schema", async () => {
    const schema = await buildUiSchemaFollowers("scope", {} as any, {} as any);
    expect(schema).toBeDefined();
  });
});
