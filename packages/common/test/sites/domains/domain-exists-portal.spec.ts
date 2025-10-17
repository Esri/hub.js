import { IHubRequestOptions } from "../../../src/hub-types";
import * as _lookupPortalModule from "../../../src/sites/domains/_lookup-portal";
import { domainExistsPortal } from "../../../src/sites/domains/domain-exists-portal";
import { vi } from "vitest";

describe("domainExistsPortal", function () {
  afterEach(() => vi.restoreAllMocks());

  it("resolves to true when exists", async function () {
    vi.spyOn(_lookupPortalModule, "_lookupPortal").mockReturnValue(
      Promise.resolve({}) as any
    );

    const res = await domainExistsPortal("domain", {} as IHubRequestOptions);

    expect(res).toBeTruthy();
  });

  it("resolves to false when NOT exists", async function () {
    vi.spyOn(_lookupPortalModule, "_lookupPortal").mockReturnValue(
      Promise.reject() as any
    );

    const res = await domainExistsPortal("domain", {} as IHubRequestOptions);

    expect(res).toBeFalsy();
  });
});
