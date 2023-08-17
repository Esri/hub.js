import { IGroup } from "@esri/arcgis-rest-types";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { convertGroupToHubGroup } from "../../../src/groups/_internal/convertGroupToHubGroup";

describe("groups: convertGroupToHubGroup:", () => {
  it("converts an IGroup to a HubGroup", async () => {
    const group = {
      id: "3ef",
      name: "Test group",
      created: 123456789,
      modified: 123456789,
      thumbnail: "group.jpg",
      membershipAccess: "collaboration",
      userMembership: {
        memberType: "admin",
      },
      capabilities: ["updateitemcontrol"],
    } as unknown as IGroup;
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    const authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as PortalModule.IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://myserver.com",
    });
    const chk = convertGroupToHubGroup(
      group,
      authdCtxMgr.context.userRequestOptions
    );
    expect(chk.id).toBe("3ef");
    // we convert some props in IGroup to something else
    // in HubGroup, checking them is a good way to
    // varify the IGroup -> Hubgroup convertion
    expect(chk.membershipAccess).toBe("collaborators");
    expect(chk.isSharedUpdate).toBeTruthy();
    expect(chk.canEdit).toBeTruthy();
    expect(chk.canDelete).toBeTruthy();
  });
});
