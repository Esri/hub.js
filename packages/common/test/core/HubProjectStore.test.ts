import { ArcGISContextManager } from "../../src";
import { HubProjectStore } from "../../src";

describe("HubProjectStore:", () => {
  it("exists", async () => {
    const mgr = await ArcGISContextManager.create();
    const chk = await HubProjectStore.create(mgr);
    expect(chk).toBeDefined();
  });
});
