import type { IGroup } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { IHubCatalog } from "../../src/search/types/IHubCatalog";
import { getCatalogGroups } from "../../src/search/getCatalogGroups";

describe("getCatalogGroups:", () => {
  let licensedUserCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    licensedUserCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        orgId: "BRXFAKE",
        privileges: ["portal:user:createItem", "portal:user:shareToGroup"],
        groups: [
          {
            id: "group1",
            isViewOnly: false,
            userMembership: {
              memberType: "admin",
            },
          } as unknown as IGroup,
          {
            id: "group2",
            isViewOnly: false,
            userMembership: {
              memberType: "member",
            },
          } as unknown as IGroup,
          {
            id: "group3",
            isViewOnly: true,
            userMembership: {
              memberType: "member",
            },
          } as unknown as IGroup,
        ],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        portalProperties: {
          hub: {
            enabled: true,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.mapsqa.arcgis.com",
      properties: {
        alphaOrgs: ["BRXFAKE"],
      },
    });
  });
  it("returns the content config for a catalog", () => {
    const catalog: IHubCatalog = {
      title: "DC R&D Center",
      schemaVersion: 1,
      scopes: {
        item: {
          targetEntity: "item",
          filters: [
            { predicates: [{ group: ["group1", "group2", "group3"] }] },
          ],
        },
        event: {
          targetEntity: "event",
          filters: [{ predicates: [{ group: "group1" }] }],
        },
      },
      collections: [
        {
          key: "collection1",
          label: "Collection 1",
          targetEntity: "item",
          scope: {
            targetEntity: "item",
            filters: [{ predicates: [{ type: "Hub Project" }] }],
          },
        },
      ],
    };

    const chk = getCatalogGroups(catalog, licensedUserCtxMgr.context);
    // We are not doing in-depth validation of the content config here
    // as that's handled in the tests for `getQueryContentConfig`
    // We are just validating that the expected collections are returned
    // console.log(JSON.stringify(chk, null, 2));

    // TODO: debug the getCatalogGroups function

    expect(chk.admin).toEqual(["group1"]);
    expect(chk.owner).toEqual([]);
    expect(chk.member).toEqual(["group2"]);
  });
  it("works without collections", () => {
    const catalog: IHubCatalog = {
      title: "DC R&D Center",
      schemaVersion: 1,
      scopes: {
        item: {
          targetEntity: "item",
          filters: [
            { predicates: [{ group: ["group1", "group2", "group3"] }] },
          ],
        },
        event: {
          targetEntity: "event",
          filters: [{ predicates: [{ group: "group1" }] }],
        },
      },
    };

    const chk = getCatalogGroups(catalog, licensedUserCtxMgr.context);
    // We are not doing in-depth validation of the content config here
    // as that's handled in the tests for `getQueryContentConfig`
    // We are just validating that the expected collections are returned
    // console.log(JSON.stringify(chk, null, 2));

    // TODO: debug the getCatalogGroups function

    expect(chk.admin).toEqual(["group1"]);
    expect(chk.owner).toEqual([]);
    expect(chk.member).toEqual(["group2"]);
  });
});
