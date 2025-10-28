import { describe, it, expect } from "vitest";
import { getHubRelativeUrl } from "../../../src/content/_internal/internalContentUtils";

describe("getHubRelativeUrl pages route", () => {
  it("returns pages path when type is a Hub Page", () => {
    const url = getHubRelativeUrl("Hub Page");
    expect(url).toBe(""); // no identifier, pages don't have an entities route -> should be empty
  });

  it("returns page route when identifier provided for Site Page type", () => {
    const url = getHubRelativeUrl("Site Page", "page-slug");
    expect(url).toBe(`/pages/page-slug`);
  });
});
