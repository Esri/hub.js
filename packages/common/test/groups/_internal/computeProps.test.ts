import { IGroup, IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { computeProps } from "../../../src/groups/_internal/computeProps";
import { IHubGroup } from "../../../src/core/types/IHubGroup";

describe("groups: computeProps:", () => {
  let authdCtxMgr: ArcGISContextManager;
  describe("computeProps:", () => {
    it("computes the correct props", async () => {
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
      const group = {
        id: "3ef",
        name: "Test group",
        created: 123456789,
        modified: 123456789,
        thumbnail: "group.jpg",
      } as unknown as IGroup;
      const hubGroup: Partial<IHubGroup> = {
        id: "3ef",
        name: "Test group",
      };
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
  });
});
