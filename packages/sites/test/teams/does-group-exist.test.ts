import { doesGroupExist } from "../../src";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "@esri/hub-common";

describe("doesGroupExist", () => {
  const ro = {
    portalSelf: {
      id: "some-org"
    },
    authentication: { token: "foo" }
  } as IHubRequestOptions;

  it("should resolve true when group with same name exists", async () => {
    const spy = spyOn(portalModule, "searchGroups").and.returnValue(
      Promise.resolve({
        results: [{}]
      })
    );

    const res = await doesGroupExist("exists", ro);

    expect(res).toBeTruthy();
    const expectedSearchOpts = {
      q: `(title:"exists" accountid:${ro.portalSelf.id})`,
      authentication: ro.authentication
    };
    expect(spy.calls.argsFor(0)[0]).toEqual(
      expectedSearchOpts,
      "searchGroups called with correct options"
    );
  });

  it("should resolve false when group with same name NOT exists", async () => {
    const spy = spyOn(portalModule, "searchGroups").and.returnValue(
      Promise.resolve({
        results: [] // empty
      })
    );

    const res = await doesGroupExist("not-exists", ro);

    expect(res).toBeFalsy();
    const expectedSearchOpts = {
      q: `(title:"not-exists" accountid:${ro.portalSelf.id})`,
      authentication: ro.authentication
    };
    expect(spy.calls.argsFor(0)[0]).toEqual(
      expectedSearchOpts,
      "searchGroups called with correct options"
    );
  });

  it("should reject if error", async () => {
    spyOn(portalModule, "searchGroups").and.returnValue(Promise.reject());

    try {
      await doesGroupExist("not-exists", ro);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
