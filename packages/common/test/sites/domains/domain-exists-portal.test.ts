import { IHubRequestOptions } from "../../../src/hub-types";
import * as _lookupPortalModule from "../../../src/sites/domains/_lookup-portal";
import { domainExistsPortal } from "../../../src/sites/domains/domain-exists-portal";

describe("domainExistsPortal", function () {
  it("resolves to true when exists", async function () {
    spyOn(_lookupPortalModule, "_lookupPortal").and.returnValue(
      Promise.resolve({})
    );

    const res = await domainExistsPortal("domain", {} as IHubRequestOptions);

    expect(res).toBeTruthy();
  });

  it("resolves to false when NOT exists", async function () {
    spyOn(_lookupPortalModule, "_lookupPortal").and.returnValue(
      Promise.reject()
    );

    const res = await domainExistsPortal("domain", {} as IHubRequestOptions);

    expect(res).toBeFalsy();
  });
});
