import {
  computeProps,
  deriveLocationFromItemExtent,
  getItemExtent,
} from "../../src/content/_internal/computeProps";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IUser } from "@esri/arcgis-rest-types";
import { IHubEditableContent, IModel } from "../../src";

describe("content computeProps", () => {
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:createItem"],
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
  it("getItemExtent isBBox is true", () => {
    const chk = getItemExtent([
      [100, 100],
      [120, 120],
    ]);
    expect(chk.xmin).toBe(100);
    expect(chk.ymin).toBe(100);
    expect(chk.xmax).toBe(120);
    expect(chk.ymax).toBe(120);
  });

  it("deriveLocationFromItemExtent valid extent", () => {
    const chk = deriveLocationFromItemExtent([
      [100, 100],
      [120, 120],
    ]);
    expect(chk.geometries?.length).toBe(1);
    expect(chk.type).toBe("custom");
  });

  it("computeProps model boundary undefined", () => {
    const model: IModel = {
      item: {
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          // nothing set in properties
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      // no location set
    };

    const chk = computeProps(
      model,
      content,
      authdCtxMgr.context.requestOptions
    );

    expect(chk.location?.type).toBe("custom");
  });

  it("computeProps boundary defined as none", () => {
    const model: IModel = {
      item: {
        created: new Date().getTime(),
        modified: new Date().getTime(),
        properties: {
          boundary: "none",
        },
      },
      data: {},
      // no boundary set
    } as IModel;
    const content: Partial<IHubEditableContent> = {
      // no location set
    };

    const chk = computeProps(
      model,
      content,
      authdCtxMgr.context.requestOptions
    );

    expect(chk.location?.type).toBe("none");
  });
});
