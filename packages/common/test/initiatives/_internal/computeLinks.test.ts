import { IItem, IUser } from "@esri/arcgis-rest-types";
import { computeLinks } from "../../../src/initiatives/_internal/computeLinks";
import { ArcGISContextManager, setProp } from "../../../src";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { IPortal } from "@esri/arcgis-rest-portal";

describe("computeLinks", () => {
  let authdCtxMgr: ArcGISContextManager;
  let item: IItem;

  beforeEach(async () => {
    item = {
      type: "Hub Initiative",
      id: "00c",
    } as IItem;
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {} as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        properties: {
          hub: { enabled: true },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.maps.arcgis.com",
    });
  });

  it("generates a links hash using the initiative's slug", () => {
    setProp("properties.slug", "mock-slug", item);
    const chk = computeLinks(item, authdCtxMgr.context.requestOptions);

    expect(chk.siteRelative).toBe("/initiatives2/mock-slug");
    expect(chk.workspaceRelative).toBe("/workspace/initiatives/mock-slug");
  });
  it("generates a links hash using the initiative's id when no slug is available", () => {
    const chk = computeLinks(item, authdCtxMgr.context.requestOptions);

    expect(chk.siteRelative).toBe("/initiatives2/00c");
    expect(chk.workspaceRelative).toBe("/workspace/initiatives/00c");
  });
});
