import {
  describe,
  it,
  expect,
  beforeEach,
} from "vitest";
import type { IItem, IUser } from "@esri/arcgis-rest-portal";
import { computeLinks } from "../../../src/sites/_internal/computeLinks";
import { MOCK_AUTH, createMockContext } from "../../mocks/mock-auth";
import { IPortal } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";

describe("computeLinks", () => {
  let authdCtxMgr: ArcGISContextManager;
  let item: IItem;

  beforeEach(async () => {
    item = {
      type: "Hub Site Application",
      id: "00c",
      url: "https://some-url.com",
    } as IItem;
    authdCtxMgr = {
      context: createMockContext({
        authentication: MOCK_AUTH,
        currentUser: {} as IUser,
        portalSelf: {
          name: "DC R&D Center",
          id: "BRXFAKE",
          urlKey: "fake-org",
          properties: {
            hub: { enabled: true },
          },
        } as unknown as IPortal,
        portalUrl: "https://org.maps.arcgis.com",
      }),
    } as unknown as ArcGISContextManager;
  });

  it("returns a links hash for sites", () => {
    const chk = computeLinks(item, authdCtxMgr.context.requestOptions);

    expect(chk.self).toBe("https://some-url.com");
    expect(chk.siteRelative).toBe("/content/00c");
    expect(chk.siteRelativeEntityType).toBe("");
    expect(chk.workspaceRelative).toBe("/workspace/sites/00c");
    expect(chk.layoutRelative).toBe("/edit");
  });
});
