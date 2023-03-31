import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import {
  ArcGISContextManager,
  IArcGISContext,
  DynamicValueDefinition,
} from "../../../src";
import { resolvePortalValues } from "../../../src/utils/internal/resolvePortalValues";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as portal from "@esri/arcgis-rest-portal";

describe("resolvePortalValues:", () => {
  let context: IArcGISContext;
  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    const authdCtxMgr = await ArcGISContextManager.create({
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
    context = authdCtxMgr.context;
  });

  it("calls memoized portalSelf", async () => {
    const def: DynamicValueDefinition = {
      type: "portal",
      sourcePath: "orgKey",
      outPath: "urlKey",
    };
    const fnSpy = spyOn(portal, "getSelf").and.callFake(() =>
      Promise.resolve({
        fake: "portal",
        orgKey: "fake",
      })
    );

    const result = await resolvePortalValues(def, context);
    expect(result).toEqual({ urlKey: "fake" });
    expect(fnSpy).toHaveBeenCalled();
    await resolvePortalValues(def, context);
    await resolvePortalValues(def, context);
    expect(fnSpy.calls.count()).toBe(1);
  });
});
