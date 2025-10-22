import { setItemThumbnail } from "../../src/items/setItemThumbnail";
import * as portalModule from "../../src/rest/portal/wrappers";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("setItemThumbnail:", () => {
  afterEach(() => vi.restoreAllMocks());

  it("calls updateItem with expected params", async () => {
    const updateSpy = vi
      .spyOn(portalModule as any, "updateItem")
      .mockResolvedValue({ success: true });
    await setItemThumbnail(
      "3ef",
      "fakeFile",
      "mything.png",
      {
        authentication: MOCK_AUTH,
      } as any,
      "fakeOwner"
    );
    expect(updateSpy).toHaveBeenCalledTimes(1);
    const args = updateSpy.mock.calls[0][0];
    expect(args.item.id).toBe("3ef");
    expect(args.params.thumbnail).toEqual("fakeFile");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("throws hub error if update fails", async () => {
    vi.spyOn(portalModule as any, "updateItem").mockResolvedValue({
      success: false,
    });
    try {
      await setItemThumbnail(
        "3ef",
        "fakeFile",
        "mything.png",
        {
          authentication: MOCK_AUTH,
        } as any,
        "fakeOwner"
      );
    } catch (err) {
      const error = err as { name?: string };
      expect(error.name).toBe("HubError");
    }
  });

  it("throws hub error if update rejects with error", async () => {
    vi.spyOn(portalModule as any, "updateItem").mockRejectedValue(
      new Error("Fake Rejection")
    );
    try {
      await setItemThumbnail(
        "3ef",
        "fakeFile",
        "mything.png",
        {
          authentication: MOCK_AUTH,
        } as any,
        "fakeOwner"
      );
    } catch (err) {
      const error = err as { name?: string };
      expect(error.name).toBe("HubError");
    }
  });

  it("throws hub error if update rejects", async () => {
    vi.spyOn(portalModule as any, "updateItem").mockRejectedValue(
      "something else"
    );
    try {
      await setItemThumbnail(
        "3ef",
        "fakeFile",
        "mything.png",
        {
          authentication: MOCK_AUTH,
        } as any,
        "fakeOwner"
      );
    } catch (err) {
      const error = err as { name?: string };
      expect(error.name).toBe("HubError");
    }
  });
});
