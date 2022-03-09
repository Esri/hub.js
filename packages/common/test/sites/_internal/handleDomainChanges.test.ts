import { handleDomainChanges } from "../../../src/sites/_internal/handleDomainChanges";
import * as commonModule from "../../../src";
import { MOCK_HUB_REQOPTS } from "../test-helpers.test";

const currentModel = {
  item: {
    id: "bc3",
    title: "City Site",
  },
  data: {
    values: {
      customHostname: "site.city.gov",
      defaultHostname: "site-city.hub.arcgis.com",
    },
  },
} as unknown as commonModule.IModel;
const updatedModel = {
  item: {
    id: "bc3",
    title: "City Site",
  },
  data: {
    values: {
      customHostname: "new-site.city.gov",
      defaultHostname: "site-city.hub.arcgis.com",
    },
  },
} as unknown as commonModule.IModel;

describe("handleDomainChanges", () => {
  it("adds and removed changed domains", async () => {
    const addSpy = spyOn(commonModule, "addDomain").and.returnValue(
      Promise.resolve()
    );
    const removeSpy = spyOn(
      commonModule,
      "removeDomainByHostname"
    ).and.returnValue(Promise.resolve());
    const c = commonModule.cloneObject(currentModel);
    const u = commonModule.cloneObject(updatedModel);

    await handleDomainChanges(u, c, MOCK_HUB_REQOPTS);

    expect(addSpy.calls.count()).toBe(1);
    expect(removeSpy.calls.count()).toBe(1);
  });
});
