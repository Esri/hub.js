import type { IGroup } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH, createMockContext } from "../../mocks/mock-auth";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { convertGroupToHubGroup } from "../../../src/groups/_internal/convertGroupToHubGroup";
import {
  EntitySettingType,
  IEntitySetting,
} from "../../../src/discussions/api/types";

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
    const settings = {
      id: "abc",
      type: "group" as EntitySettingType,
      settings: {},
    } as IEntitySetting;
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    const authdCtxMgr = {
      context: createMockContext({
        authentication: MOCK_AUTH,
        currentUser: {
          username: "casey",
        } as unknown as PortalModule.IUser,
        portalSelf: {
          name: "DC R&D Center",
          id: "BRXFAKE",
          urlKey: "fake-org",
        } as unknown as PortalModule.IPortal,
        portalUrl: "https://myserver.com",
      }),
    } as unknown as ArcGISContextManager;
    const chk = convertGroupToHubGroup(
      group,
      settings,
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
