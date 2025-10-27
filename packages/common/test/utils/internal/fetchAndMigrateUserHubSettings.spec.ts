import { describe, it, expect, vi } from "vitest";

vi.mock("../../../src/utils/internal/userAppResources", () => ({
  getUserResource: vi.fn().mockResolvedValue({
    schemaVersion: 1.0,
    preview: { workspace: true },
  }),
}));

import { fetchAndMigrateUserHubSettings } from "../../../src/utils/internal/fetchAndMigrateUserHubSettings";

describe("fetchAndMigrateUserHubSettings", () => {
  it("fetches settings and applies migrations", async () => {
    const res = await fetchAndMigrateUserHubSettings(
      "jsmith",
      "https://org",
      "tok"
    );
    expect(res.schemaVersion).toBe(1.1);
    expect((res as any).preview).toBeUndefined();
    expect((res as any).features).toBeDefined();
  });
});
