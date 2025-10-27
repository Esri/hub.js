import { computeItemLinks } from "../../../src/core/_internal/computeItemLinks";
import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";
import * as getRelWorkspace from "../../../src/core/getRelativeWorkspaceUrl";
import * as getThumb from "../../../src/resources/get-item-thumbnail-url";
import * as getItemIdentifierMod from "../../../src/items/getItemIdentifier";
import * as getItemHomeUrlMod from "../../../src/urls/get-item-home-url";
import * as getHubRel from "../../../src/content/_internal/internalContentUtils";

describe("computeItemLinks", () => {
  const item = {
    id: "i-123",
    type: "Hub Initiative",
    typeKeywords: ["kw1"],
  } as any;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("computes links without authentication (no token)", () => {
    // spy/mocks for helper functions
    vi.spyOn(getItemHomeUrlMod, "getItemHomeUrl").mockReturnValue("home-url");
    const gh = vi
      .spyOn(getHubRel, "getHubRelativeUrl")
      .mockImplementationOnce(() => "site-rel")
      .mockImplementationOnce(() => "site-rel-entity-type");
    vi.spyOn(getRelWorkspace, "getRelativeWorkspaceUrl").mockReturnValue(
      "workspace-url"
    );
    vi.spyOn(getItemIdentifierMod, "getItemIdentifier").mockReturnValue(
      "slug-or-id"
    );
    const thumbSpy = vi
      .spyOn(getThumb, "getItemThumbnailUrl")
      .mockReturnValue("thumb-url");

    const res = computeItemLinks(item, {} as any);

    expect(res.self).toEqual("home-url");
    expect(res.siteRelative).toEqual("site-rel");
    expect(res.siteRelativeEntityType).toEqual("site-rel-entity-type");
    expect(res.workspaceRelative).toEqual("workspace-url");
    expect(res.thumbnail).toEqual("thumb-url");

    // thumbnail called with token undefined
    expect(thumbSpy).toHaveBeenCalledWith(item, {}, undefined);
    expect(gh.mock.calls.length).toBe(2);
  });

  it("passes token when authentication provided", () => {
    vi.spyOn(getItemHomeUrlMod, "getItemHomeUrl").mockReturnValue("home-url-2");
    vi.spyOn(getHubRel, "getHubRelativeUrl").mockImplementation(
      () => "site-rel-2"
    );
    vi.spyOn(getRelWorkspace, "getRelativeWorkspaceUrl").mockReturnValue(
      "workspace-url-2"
    );
    vi.spyOn(getItemIdentifierMod, "getItemIdentifier").mockReturnValue(
      "slug-2"
    );
    const thumbSpy = vi
      .spyOn(getThumb, "getItemThumbnailUrl")
      .mockReturnValue("thumb-url-2");

    const req = { authentication: { token: "tok-123" } } as any;
    const res = computeItemLinks(item, req);

    expect(res.thumbnail).toEqual("thumb-url-2");
    expect(thumbSpy).toHaveBeenCalledWith(item, req, "tok-123");
  });
});
