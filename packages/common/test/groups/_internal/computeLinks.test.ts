import { IGroup, IUser } from "@esri/arcgis-rest-types";
import { computeLinks } from "../../../src/groups/_internal/computeLinks";
import { ArcGISContextManager } from "../../../src";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { IPortal } from "@esri/arcgis-rest-portal";

describe("computeLinks", () => {
  let authdCtxMgr: ArcGISContextManager;
  let group: IGroup;

  beforeEach(async () => {
    group = {
      id: "00c",
    } as IGroup;
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

  it("generates a links hash", () => {
    const chk = computeLinks(group, authdCtxMgr.context.requestOptions);

    expect(chk.siteRelative).toBe("/teams/00c");
    expect(chk.workspaceRelative).toBe("/workspace/groups/00c");
  });
});
