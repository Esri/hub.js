import { addSiteDomains } from "../../../src";
import * as commonModule from "@esri/hub-common";
import { IHubRequestOptions, IModel } from "@esri/hub-common";

describe("_addSiteDomains", () => {
  it("adds site domains", async () => {
    const addSpy = spyOn(commonModule, "addDomain").and.returnValue(
      Promise.resolve({})
    );

    const model = {
      item: {
        id: "123",
        title: "some-title",
      },
      data: {
        values: {
          clientId: "clientId",
          defaultHostname: "default-hostname",
        },
      },
    } as unknown as IModel;

    const ro = {
      portalSelf: {
        id: "org-id",
        name: "portal-name",
        urlKey: "org-key",
      },
    } as unknown as IHubRequestOptions;

    await addSiteDomains(model, ro);

    expect(addSpy.calls.count()).toBe(1);
    expect(addSpy.calls.argsFor(0)[0]).toEqual(
      {
        hostname: "default-hostname",
        clientKey: model.data.values.clientId,
        orgId: ro.portalSelf.id,
        orgTitle: ro.portalSelf.name,
        orgKey: ro.portalSelf.urlKey,
        siteId: model.item.id,
        siteTitle: model.item.title,
        sslOnly: true,
      },
      "addDomain called correctly"
    );
  });

  it("does nothing on portal", async () => {
    const addSpy = spyOn(commonModule, "addDomain").and.returnValue(
      Promise.resolve({})
    );

    const model = {
      item: {
        id: "123",
        title: "some-title",
      },
      data: {
        values: {
          clientId: "clientId",
          defaultHostname: "default-hostname",
          customHostname: "custom-hostname",
        },
      },
    } as unknown as IModel;

    const ro = {
      isPortal: true,
      portalSelf: {
        id: "org-id",
        name: "portal-name",
        urlKey: "org-key",
      },
    } as unknown as IHubRequestOptions;

    await addSiteDomains(model, ro);

    expect(addSpy.calls.count()).toBe(0);
  });
});
