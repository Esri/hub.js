import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager, IHubProject } from "../../../../src";
import { MOCK_AUTH } from "../../../mocks/mock-auth";
import { getAuthedImageUrl } from "../../../../src/core/_internal/getAuthedImageUrl";

describe("getAuthedImageUrl:", () => {
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
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
    });
  });
  it("adds token and cache bust", () => {
    const entity = {
      view: {
        featuredImageUrl:
          "https://www.arcgis.com/sharing/rest/content/items/1234567890abcdef1234567890abcdef/info/thumbnail/ago_downloaded.png",
      },
    } as unknown as IHubProject;

    const url = getAuthedImageUrl(
      entity.view?.featuredImageUrl as string,
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

    const url = getAuthedImageUrl(entity.view?.featuredImageUrl as string, {});
    expect(url?.includes("token=fake-token")).toBeFalsy();
    expect(url?.includes("v=")).toBeTruthy();
  });
  it("returns undefined if a featured image url is not defined on the entity", () => {
    const entity = {} as IHubProject;
    const url = getAuthedImageUrl(
      entity.view?.featuredImageUrl as string,
      authdCtxMgr.context.requestOptions
    );

    expect(url).toBeUndefined();
  });
});
