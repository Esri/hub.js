import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";

vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  searchItems: vi.fn(),
}));

import * as portalModule from "@esri/arcgis-rest-portal";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { doesItemExistWithTitle } from "../../src/items/does-item-exist-with-title";

afterEach(() => vi.restoreAllMocks());

describe("doesItemExistWithTitle", () => {
  const options = {
    typekeywords: "foo",
  };

  const authMgr = {} as IAuthenticationManager;

  it("should resolve true when item with same name exists", async () => {
    const spy = vi
      .spyOn(portalModule as any, "searchItems")
      .mockResolvedValue({ results: [{}] });
    const res = await doesItemExistWithTitle("exists", options, authMgr);
    expect(res).toBeTruthy();

    const expectedSearchOpts = {
      q: `title:"exists" AND typekeywords:"foo"`,
      authentication: authMgr,
    };
    expect((spy as any).mock.calls[0][0]).toEqual(expectedSearchOpts);
  });

  it("should resolve false when item with same name DOES NOT exist", async () => {
    const spy = vi
      .spyOn(portalModule as any, "searchItems")
      .mockResolvedValue({ results: [] });
    const res = await doesItemExistWithTitle("not-exists", options, authMgr);
    expect(res).toBeFalsy();

    const expectedSearchOpts = {
      q: `title:"not-exists" AND typekeywords:"foo"`,
      authentication: authMgr,
    };
    expect((spy as any).mock.calls[0][0]).toEqual(expectedSearchOpts);
  });

  it("should reject if error", async () => {
    vi.spyOn(portalModule as any, "searchItems").mockRejectedValue(new Error());
    await expect(
      doesItemExistWithTitle("not-exists", options, authMgr)
    ).rejects.toBeDefined();
  });
});
