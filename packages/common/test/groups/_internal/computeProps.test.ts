import { IGroup, IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { computeProps } from "../../../src/groups/_internal/computeProps";
import { IHubGroup } from "../../../src/core/types/IHubGroup";
import * as computeLinksModule from "../../../src/groups/_internal/computeLinks";

describe("groups: computeProps:", () => {
  let group: IGroup;
  let hubGroup: Partial<IHubGroup>;
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    group = {
      id: "3ef",
      name: "Test group",
      created: 123456789,
      modified: 123456789,
      thumbnail: "group.jpg",
      membershipAccess: "collaboration",
      userMembership: {
        memberType: "admin",
      },
    } as unknown as IGroup;
    hubGroup = {
      id: "3ef",
      name: "Test group",
    };
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:createGroup"],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        properties: {
          hub: {
            enabled: true,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.maps.arcgis.com",
    });
  });
  describe("computeProps:", () => {
    describe("computed props", () => {
      it("computes the correct props", async () => {
        let chk = computeProps(
          group,
          hubGroup,
          authdCtxMgr.context.requestOptions
        );
        expect(chk.createdDate).toBeDefined();
        expect(chk.createdDateSource).toBe("group.created");
        expect(chk.updatedDate).toBeDefined();
        expect(chk.updatedDateSource).toBe("group.modified");
        expect(chk.isDiscussable).toBeTruthy();
        expect(chk.thumbnailUrl).toBe(
          "https://fake-org.undefined/sharing/rest/community/groups/3ef/info/group.jpg?token=fake-token"
        );
        expect(chk.membershipAccess).toBe("collaborators");
        authdCtxMgr = await ArcGISContextManager.create({
          authentication: undefined,
          currentUser: {
            username: "casey",
            privileges: ["portal:user:createGroup"],
          } as unknown as IUser,
          portal: {
            name: "DC R&D Center",
            id: "BRXFAKE",
            urlKey: "fake-org",
            properties: {
              hub: {
                enabled: true,
              },
            },
          } as unknown as IPortal,
          portalUrl: "https://org.maps.arcgis.com",
        });
        chk = computeProps(group, hubGroup, authdCtxMgr.context.requestOptions);
        expect(chk.thumbnailUrl).toBe(
          "https://org.maps.arcgis.com/sharing/rest/community/groups/3ef/info/group.jpg"
        );
      });
      it("generates a links hash", () => {
        const computeLinksSpy = spyOn(
          computeLinksModule,
          "computeLinks"
        ).and.returnValue({ self: "some-link" });
        const chk = computeProps(
          group,
          hubGroup,
          authdCtxMgr.context.requestOptions
        );
        expect(computeLinksSpy).toHaveBeenCalledTimes(1);
        expect(chk.links).toEqual({ self: "some-link" });
      });
      it("computes the correct props when no userMembership", () => {
        group = {
          id: "3ef",
          name: "Test group",
        } as unknown as IGroup;
        const chk = computeProps(
          group,
          hubGroup,
          authdCtxMgr.context.requestOptions
        );
        expect(chk.memberType).toBeFalsy();
        expect(chk.canEdit).toBeFalsy();
        expect(chk.canDelete).toBeFalsy();
      });
    });
  });
});
