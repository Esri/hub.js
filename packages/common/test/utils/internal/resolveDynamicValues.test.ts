import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { resolveDynamicValues } from "../../../src/utils/internal/resolveDynamicValues";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { IArcGISContext } from "../../../src/types/IArcGISContext";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { DynamicValueDefinition } from "../../../src/core/types/DynamicValues";
import * as resolveDynamicValuesModule from "../../../src/utils/internal/resolveDynamicValues";

describe("resolveDynamicValues:", () => {
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

  it("delegates to resolveDynamicValue", async () => {
    const fnSpy = spyOn(
      resolveDynamicValuesModule._INTERNAL_FNS,
      "resolveDynamicValue"
    ).and.callFake(() => Promise.resolve({}));
    const def: DynamicValueDefinition = {
      type: "static-value",
      value: 12,
      outPath: "cost",
    };
    await resolveDynamicValues([def], context);
    expect(fnSpy).toHaveBeenCalled();
    const chkDef = fnSpy.calls.mostRecent().args[0];
    expect(chkDef).toEqual(def);
  });
});
