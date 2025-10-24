import {
  describe,
  it,
  expect,
  vi,
} from "vitest";
import { handleDomainChanges } from "../../../src/sites/_internal/handleDomainChanges";
import * as addDomainModule from "../../../src/sites/domains/add-domain";
import * as removeDomainByHostnameModule from "../../../src/sites/domains/removeDomainByHostname";
import { MOCK_HUB_REQOPTS } from "../test-helpers";
import { cloneObject } from "../../../src/util";
import { IModel } from "../../../src/hub-types";

const currentModel = {
  item: {
    id: "bc3",
    title: "City Site",
  },
  data: {
    values: {
      customHostname: "site.city.gov",
      defaultHostname: "site-CITY.hub.arcgis.com",
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
    const addSpy = vi
      .spyOn(addDomainModule, "addDomain")
      .mockReturnValue(Promise.resolve());
    const removeSpy = vi
      .spyOn(removeDomainByHostnameModule, "removeDomainByHostname")
      .mockReturnValue(Promise.resolve());
    const c = cloneObject(currentModel);
    const u = cloneObject(updatedModel);

    await handleDomainChanges(u, c, MOCK_HUB_REQOPTS);

    expect(addSpy.mock.calls.length).toBe(1);
    expect(removeSpy.mock.calls.length).toBe(1);
  });

  it("does not attempt to update domains that have not changed", async () => {
    const addSpy = vi
      .spyOn(addDomainModule, "addDomain")
      .mockReturnValue(Promise.resolve());
    const removeSpy = vi
      .spyOn(removeDomainByHostnameModule, "removeDomainByHostname")
      .mockReturnValue(Promise.resolve());
    const c = cloneObject(currentModel);
    (c as any).data.values = {
      customHostname: "site.city.gov",
    };
    const u = cloneObject(updatedModel);
    (u as any).data.values = {
      customHostname: "site.city.gov",
      defaultHostname: "",
    };

    await handleDomainChanges(u, c, MOCK_HUB_REQOPTS);

    expect(addSpy.mock.calls.length).toBe(0);
    expect(removeSpy.mock.calls.length).toBe(0);
  });

  it("does not attempt to update domains that only have case changes", async () => {
    const addSpy = vi
      .spyOn(addDomainModule, "addDomain")
      .mockReturnValue(Promise.resolve());
    const removeSpy = vi
      .spyOn(removeDomainByHostnameModule, "removeDomainByHostname")
      .mockReturnValue(Promise.resolve());
    const c = cloneObject(currentModel);
    (c as any).data.values = {
      defaultHostname: "luke-REBELS.hub.arcgis.com",
    };
    const u = cloneObject(updatedModel);
    (u as any).data.values = {
      defaultHostname: "luke-rebels.hub.arcgis.com",
      customHostname: "",
    };

    await handleDomainChanges(u, c, MOCK_HUB_REQOPTS);

    expect(addSpy.mock.calls.length).toBe(0);
    expect(removeSpy.mock.calls.length).toBe(0);
  });
});
