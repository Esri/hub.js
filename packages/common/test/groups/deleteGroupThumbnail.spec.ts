// register the async mock before importing the module so ESM namespace exports
// can be overridden in tests
vi.mock("@esri/arcgis-rest-request", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    request: vi.fn(),
  };
});

import * as RequestModule from "@esri/arcgis-rest-request";
import { deleteGroupThumbnail } from "../../src/groups/deleteGroupThumbnail";
import { describe, it, expect, afterEach, vi } from "vitest";

afterEach(() => vi.restoreAllMocks());

describe("deleteGroupThumbnail:", () => {
  it("makes request to API", async () => {
    const spy = (RequestModule.request as any).mockResolvedValue({} as any);
    await deleteGroupThumbnail("3ef", {
      authentication: {},
      portal: "https://www.arcgis.com/sharing/rest",
    } as any);
    expect(spy).toHaveBeenCalledTimes(1);
    const args = spy.mock.calls[0][0];

    expect(args).toBe(
      "https://www.arcgis.com/sharing/rest/community/groups/3ef/deleteThumbnail"
    );
  });
});
