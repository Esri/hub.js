import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import {
  ArcGISContextManager,
  IArcGISContext,
  DynamicValueDefinition,
} from "../../../src";
import { resolveDynamicValues } from "../../../src/utils/internal/resolveDynamicValues";
import { MOCK_AUTH } from "../../mocks/mock-auth";

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

  it("delegates to resolveDynamicValue", () => {
    const fnSpy = spyOn(
      require("../../../src/utils/internal/resolveDynamicValue"),
      "resolveDynamicValue"
    ).and.callFake(() => Promise.resolve({}));
    const def: DynamicValueDefinition = {
      type: "static-value",
      value: 12,
      outPath: "cost",
      source: {
        type: "Hub Project",
        id: "ff3",
        label: "Test Item Source",
      },
    };
    const result = resolveDynamicValues([def], context);
    expect(fnSpy).toHaveBeenCalled();
    const chkDef = fnSpy.calls.mostRecent().args[0];
    expect(chkDef).toEqual(def);
  });
});
