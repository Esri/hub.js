import { IGroup } from "@esri/arcgis-rest-types";
import {
  ArcGISContextManager,
  getCatalogContentConfig,
  IHubCatalog,
} from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IPortal, IUser } from "@esri/arcgis-rest-portal";

describe("getCatalogContentConfig:", () => {
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
          filters: [{ predicates: [{ group: "group1" }] }],
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

    const chk = getCatalogContentConfig(catalog, licensedUserCtxMgr.context);
    // We are not doing in-depth validation of the content config here
    // as that's handled in the tests for `getQueryContentConfig`
    // We are just validating that the expected collections are returned
    expect(chk.collections.length).toBe(2);
    expect(chk.collections[0].label).toBe("Collection 1");
    expect(chk.collections[0].key).toBe("collection1");
    expect(chk.collections[0].targetEntity).toBe("item");
    expect(chk.collections[0].create).toBeDefined();
    expect(chk.collections[0].existing).toBeDefined();
    expect(chk.collections[1].label).toBe("Synthetic event");
    expect(chk.collections[1].key).toBe("synthetic-event");
  });
});
