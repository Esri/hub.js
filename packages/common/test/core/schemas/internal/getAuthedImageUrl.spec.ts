import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH, createMockContext } from "../../../mocks/mock-auth";
import { getAuthedImageUrl } from "../../../../src/core/_internal/getAuthedImageUrl";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { IHubProject } from "../../../../src/core/types/IHubProject";

describe("getAuthedImageUrl:", () => {
  let authdCtxMgr: any;
  beforeEach(async () => {
    const contextOptions = {
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        groups: [
          { id: "efView", capabilities: [] },
          { id: "efUpdate", capabilities: ["updateitemcontrol"] },
        ],
        privileges: [],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        customBaseUrl: "fakemaps.arcgis.com",
      } as unknown as IPortal,
    };
    authdCtxMgr = {
      context: createMockContext(contextOptions),
    } as unknown as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
  });
  it("adds token and cache bust", () => {
    const entity = {
      view: {
        featuredImageUrl:
          "https://www.arcgis.com/sharing/rest/content/items/1234567890abcdef1234567890abcdef/info/thumbnail/ago_downloaded.png",
      },
    } as unknown as IHubProject;

    const url = getAuthedImageUrl(
      entity.view?.featuredImageUrl,
      authdCtxMgr.context.requestOptions
    );
    expect(url?.includes("token=fake-token")).toBeTruthy();
    expect(url?.includes("v=")).toBeTruthy();
  });
  it("skips token if not authd", () => {
    const entity = {
      view: {
        featuredImageUrl:
          "https://www.arcgis.com/sharing/rest/content/items/1234567890abcdef1234567890abcdef/info/thumbnail/ago_downloaded.png",
      },
    } as unknown as IHubProject;

    const url = getAuthedImageUrl(entity.view?.featuredImageUrl, {});
    expect(url?.includes("token=fake-token")).toBeFalsy();
    expect(url?.includes("v=")).toBeTruthy();
  });
  it("returns undefined if a featured image url is not defined on the entity", () => {
    const entity = {} as IHubProject;
    const url = getAuthedImageUrl(
      entity.view?.featuredImageUrl,
      authdCtxMgr.context.requestOptions
    );

    expect(url).toBeUndefined();
  });
});
