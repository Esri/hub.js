import { IGroup, IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH, createMockContext } from "../../mocks/mock-auth";
import { vi } from "vitest";
import { computeProps } from "../../../src/groups/_internal/computeProps";
import { IHubGroup } from "../../../src/core/types/IHubGroup";
import * as computeLinksModule from "../../../src/groups/_internal/computeLinks";
import { EntitySettingType } from "../../../src/discussions/api/types";

describe("groups: computeProps:", () => {
  let group: IGroup;
  let hubGroup: Partial<IHubGroup>;
  let authdCtxMgr: any;
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
    const contextOptions = {
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:createGroup"],
      } as unknown as IUser,
      portalSelf: {
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
    };
    authdCtxMgr = {
      context: createMockContext(contextOptions),
    } as unknown as any;
  });
  describe("computeProps:", () => {
    describe("computed props", () => {
      it("computes the correct props", async () => {
        const settings = {
          id: "abc",
          type: "group" as EntitySettingType,
          settings: {},
        };
        let chk = computeProps(
          group,
          hubGroup,
          settings,
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
        authdCtxMgr = {
          context: createMockContext({
            authentication: undefined,
            currentUser: {
              username: "casey",
              privileges: ["portal:user:createGroup"],
            } as unknown as IUser,
            portalSelf: {
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
          }),
        } as unknown as any;
        chk = computeProps(
          group,
          hubGroup,
          settings,
          authdCtxMgr.context.requestOptions
        );
        expect(chk.thumbnailUrl).toBe(
          "https://org.maps.arcgis.com/sharing/rest/community/groups/3ef/info/group.jpg"
        );
      });
      it("generates a links hash", () => {
        const settings = {
          id: "abc",
          type: "group" as EntitySettingType,
          settings: {},
        };
        const computeLinksSpy = vi
          .spyOn(computeLinksModule, "computeLinks")
          .mockReturnValue({ self: "some-link" });
        const chk = computeProps(
          group,
          hubGroup,
          settings,
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
        const settings = {
          id: "abc",
          type: "group" as EntitySettingType,
          settings: {},
        };
        const chk = computeProps(
          group,
          hubGroup,
          settings,
          authdCtxMgr.context.requestOptions
        );
        expect(chk.memberType).toBeFalsy();
        expect(chk.canEdit).toBeFalsy();
        expect(chk.canDelete).toBeFalsy();
      });
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
  });
});
