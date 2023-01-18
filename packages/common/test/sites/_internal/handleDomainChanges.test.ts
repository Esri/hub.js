import { handleDomainChanges } from "../../../src/sites/_internal/handleDomainChanges";
import * as domainModule from "../../../src/sites/domains";
import { MOCK_HUB_REQOPTS } from "../test-helpers.test";
import { cloneObject } from "../../../src/util";
import { IModel } from "../../../src/types";

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
} as unknown as IModel;
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
} as unknown as IModel;

describe("handleDomainChanges", () => {
  it("adds and removed changed domains", async () => {
    const addSpy = spyOn(domainModule, "addDomain").and.returnValue(
      Promise.resolve()
    );
    const removeSpy = spyOn(
      domainModule,
      "removeDomainByHostname"
    ).and.returnValue(Promise.resolve());
    const c = cloneObject(currentModel);
    const u = cloneObject(updatedModel);

    await handleDomainChanges(u, c, MOCK_HUB_REQOPTS);

    expect(addSpy.calls.count()).toBe(1);
    expect(removeSpy.calls.count()).toBe(1);
  });
});
