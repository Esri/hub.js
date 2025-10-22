afterEach(() => vi.restoreAllMocks());

describe("deleteItemThumbnail:", () => {
  it("makes request to API", async () => {
    const spy = vi.spyOn(RequestModule as any, "request").mockResolvedValue({});
    await deleteItemThumbnail("3ef", "fakeOwner", {
      authentication: {},
      portal: "https://www.arcgis.com/sharing/rest",
    } as any);
    expect((spy as any).mock.calls.length).toBe(1);
    const args = (spy as any).mock.calls[0][0];

    expect(args).toBe(
      "https://www.arcgis.com/sharing/rest/content/users/fakeOwner/items/3ef/deleteThumbnail"
    );
  });
});
vi.mock("@esri/arcgis-rest-request", async (importOriginal) => ({
  ...(await importOriginal()),
  request: vi.fn(),
}));

import * as RequestModule from "@esri/arcgis-rest-request";
import { deleteItemThumbnail } from "../../src/items/deleteItemThumbnail";
