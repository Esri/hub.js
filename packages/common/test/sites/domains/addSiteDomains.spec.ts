import type { IHubRequestOptions, IModel } from "../../../src/hub-types";
import * as addDomainModule from "../../../src/sites/domains/add-domain";

import { addSiteDomains } from "../../../src/sites/domains/addSiteDomains";
import { vi } from "vitest";

describe("addSiteDomains", () => {
  afterEach(() => vi.restoreAllMocks());

  it("adds site domains", async () => {
    const addSpy = vi
      .spyOn(addDomainModule, "addDomain")
      .mockReturnValue(Promise.resolve({}) as any);

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

    expect((addSpy as any).mock.calls.length).toBe(1);
    expect((addSpy as any).mock.calls[0][0]).toEqual(
      {
        hostname: "default-hostname",
        clientKey: model.data?.values.clientId,
        orgId: ro.portalSelf?.id,
        orgTitle: ro.portalSelf?.name,
        orgKey: ro.portalSelf?.urlKey,
        siteId: model.item.id,
        siteTitle: model.item.title,
        sslOnly: true,
      },
      "addDomain called correctly"
    );
  });

  it("does nothing on portal", async () => {
    const addSpy = vi
      .spyOn(addDomainModule, "addDomain")
      .mockReturnValue(Promise.resolve({}) as any);

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

    const result = await addSiteDomains(model, ro);

    expect(result[0].clientKey).toBe(
      "arcgisonline",
      "returns portal client key"
    );

    expect((addSpy as any).mock.calls.length).toBe(0);
  });
});
