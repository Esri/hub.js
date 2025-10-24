vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    updateGroup: vi.fn(),
  };
});

import { setGroupThumbnail } from "../../src/groups/setGroupThumbnail";
import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { describe, it, expect, afterEach, vi } from "vitest";

afterEach(() => vi.restoreAllMocks());

describe("setGroupThumbnail:", () => {
  it("calls updateGroup with expected params", async () => {
    const updateSpy = (portalModule.updateGroup as any).mockResolvedValue({
      success: true,
    });
    await setGroupThumbnail(
      "3ef",
      "fakeFile",
      "mything.png",
      {
        authentication: MOCK_AUTH,
      },
      "fakeOwner"
    );
    expect(updateSpy).toHaveBeenCalledTimes(1);
    const args = updateSpy.mock.calls[0][0];
    expect(args.group.id).toBe("3ef");
    expect(args.params.thumbnail).toEqual("fakeFile");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("throws hub error if update fails", async () => {
    (portalModule.updateGroup as any).mockResolvedValue({ success: false });
    try {
      await setGroupThumbnail(
        "3ef",
        "fakeFile",
        "mything.png",
        {
          authentication: MOCK_AUTH,
        },
        "fakeOwner"
      );
    } catch (err) {
      expect((err as Error).name).toBe("HubError");
    }
  });
  it("throws hub error if update rejects with error", async () => {
    (portalModule.updateGroup as any).mockRejectedValue(
      new Error("Fake Rejection")
    );
    try {
      await setGroupThumbnail(
        "3ef",
        "fakeFile",
        "mything.png",
        {
          authentication: MOCK_AUTH,
        },
        "fakeOwner"
      );
    } catch (err) {
      expect((err as Error).name).toBe("HubError");
    }
  });
  it("throws hub error if update rejects", async () => {
    (portalModule.updateGroup as any).mockRejectedValue("something else");
    try {
      await setGroupThumbnail(
        "3ef",
        "fakeFile",
        "mything.png",
        {
          authentication: MOCK_AUTH,
        },
        "fakeOwner"
      );
    } catch (err) {
      expect((err as Error).name).toBe("HubError");
    }
  });
});
