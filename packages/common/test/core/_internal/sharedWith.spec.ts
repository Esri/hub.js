import { describe, it, expect, vi, afterEach } from "vitest";
import { sharedWith } from "../../../src/core/_internal/sharedWith";
import type { IRequestOptions } from "@esri/arcgis-rest-request";
import type { IGroup } from "@esri/arcgis-rest-portal";

vi.mock("@esri/arcgis-rest-portal", () => ({
  getItemGroups: vi.fn(),
}));

import { getItemGroups } from "@esri/arcgis-rest-portal";

describe("sharedWith", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("gets groups and re-formats response", async () => {
    (getItemGroups as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      admin: [{ id: "3ef", name: "Test Group 1" }],
      member: [{ id: "5ef", name: "Test Group 2" }],
      other: [{ id: "6ef", name: "Test Group 3" }],
    });

    const groups: IGroup[] = await sharedWith("00c", {} as IRequestOptions);

    expect(getItemGroups).toHaveBeenCalledTimes(1);
    expect(groups.length).toBe(3);
    expect(groups[0].id).toBe("3ef");
    expect(groups[1].id).toBe("5ef");
    expect(groups[2].id).toBe("6ef");
  });
});
