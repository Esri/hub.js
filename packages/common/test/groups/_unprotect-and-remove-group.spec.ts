import { describe, it, expect, vi, afterEach } from "vitest";

// Mock the portal module namespace so its exports are overridable
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    unprotectGroup: vi.fn(),
    removeGroup: vi.fn(),
  } as any;
});

import * as portal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { _unprotectAndRemoveGroup } from "../../src/groups/_unprotect-and-remove-group";

describe("_unprotectAndRemoveGroup", function () {
  afterEach(() => vi.restoreAllMocks());

  it("unprotects and removes a group", async function () {
    const unprotectGroupSpy = (portal.unprotectGroup as any).mockResolvedValue({
      success: true,
    });
    const removeGroupSpy = (portal.removeGroup as any).mockResolvedValue({
      success: true,
    });

    const res = await _unprotectAndRemoveGroup({
      id: "foo-baz",
      authentication: mockUserSession,
    });

    expect(res.success).toBeTruthy();
    expect(unprotectGroupSpy).toHaveBeenCalledTimes(1);
    expect(removeGroupSpy).toHaveBeenCalledTimes(1);
  });

  it("is impervious to failures", async function () {
    (portal.unprotectGroup as any).mockRejectedValue(undefined as any);
    (portal.removeGroup as any).mockRejectedValue(undefined as any);

    let res;
    try {
      res = await _unprotectAndRemoveGroup({
        id: "foo-baz",
        authentication: mockUserSession,
      });
    } catch (_) {
      fail(Error("function rejected"));
    }

    expect(res.success).toBeTruthy();
  });
});
