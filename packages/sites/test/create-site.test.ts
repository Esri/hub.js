import { createSite } from "../src";
import * as commonModule from "@esri/hub-common";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as registerAsAppModule from "../src/register-site-as-application";
import * as addDomainsModule from "../src/_add-site-domains";
import { expectAllCalled, expectAll } from "./test-helpers.test";
import { IModel } from "@esri/hub-common";

describe("create site :: ", function() {
  const APP_REGISTRATION_RESPONSE: any = {
    itemId: "3ef",
    client_id: "031AYEM9fd1X1ac9",
    client_secret: "f44501a0ab744463af5ce338429833db",
    appType: "browser",
    redirect_uris: [
      "http://my-site.com",
      "https://my-site.com",
      "https://name-org.hub.arcgis.com",
      "http://name-org.hub.arcgis.com"
    ],
    registered: 1580932896000,
    modified: 1580932896000,
    apnsProdCert: null,
    apnsSandboxCert: null,
    gcmApiKey: null
  };

  let createSpy: jasmine.Spy;
  let protectSpy: jasmine.Spy;
  let registerSpy: jasmine.Spy;
  let updateSpy: jasmine.Spy;
  let domainsSpy: jasmine.Spy;
  let uploadResourcesSpy: jasmine.Spy;
  let shareSpy: jasmine.Spy;
  beforeEach(function() {
    createSpy = spyOn(portalModule, "createItem").and.returnValue(
      Promise.resolve({ success: true, id: "3ef" })
    );
    protectSpy = spyOn(portalModule, "protectItem").and.returnValue(
      Promise.resolve({ success: true, id: "3ef" })
    );
    registerSpy = spyOn(
      registerAsAppModule,
      "registerSiteAsApplication"
    ).and.returnValue(Promise.resolve(APP_REGISTRATION_RESPONSE));
    updateSpy = spyOn(portalModule, "updateItem").and.returnValue(
      Promise.resolve({ success: true, id: "3ef" })
    );
    domainsSpy = spyOn(addDomainsModule, "_addSiteDomains").and.returnValue(
      Promise.resolve({})
    );
    uploadResourcesSpy = spyOn(
      commonModule,
      "uploadResourcesFromUrl"
    ).and.returnValue(Promise.resolve({}));
    shareSpy = spyOn(portalModule, "shareItemWithGroup").and.returnValue(
      Promise.resolve({})
    );
  });

  const ro = {
    authentication: {}
  } as commonModule.IHubRequestOptions;

  it("happy path", async function() {
    const site = ({
      item: {
        owner: "luke",
        title: "Death Star Plans"
      },
      data: {
        values: {
          defaultHostname: "name-org.hub.arcgis.com",
          customHostname: "my-site.com",
          verifySecondPass: "this should be {{appid}} interpolated"
        }
      }
    } as unknown) as commonModule.IModel;

    const result = await createSite(site, {}, ro);

    expect(result.item.id).toBe("3ef", "should attach id into returned model");
    expect(result.data.values.clientId).toBe(
      "031AYEM9fd1X1ac9",
      "should attach client Id into returned model"
    );
    expect(result.item.typeKeywords).toContain(
      "hubSite",
      "should add missing typeKeywords array and add hubSite"
    );
    expect(result.data.values.verifySecondPass).toBe(
      "this should be 3ef interpolated",
      "should do second pass appid interpolation"
    );

    // no collab group, so no sharing call
    expect(shareSpy).not.toHaveBeenCalled();
    expectAllCalled(
      [
        createSpy,
        protectSpy,
        registerSpy,
        updateSpy,
        domainsSpy,
        uploadResourcesSpy
      ],
      expect
    );
  });

  it("shares with collab group if id exists", async function() {
    const site = ({
      item: {
        owner: "luke",
        title: "Death Star Plans",
        properties: {
          collaborationGroupId: "foo-bar-baz"
        }
      },
      data: {
        values: {
          defaultHostname: "name-org.hub.arcgis.com",
          customHostname: "my-site.com",
          verifySecondPass: "this should be {{appid}} interpolated"
        }
      }
    } as unknown) as commonModule.IModel;

    const result = await createSite(site, {}, ro);

    expect(result.item.id).toBe("3ef", "should attach id into returned model");
    expect(result.data.values.clientId).toBe(
      "031AYEM9fd1X1ac9",
      "should attach client Id into returned model"
    );
    expect(result.item.typeKeywords).toContain(
      "hubSite",
      "should add missing typeKeywords array and add hubSite"
    );
    expect(result.data.values.verifySecondPass).toBe(
      "this should be 3ef interpolated",
      "should do second pass appid interpolation"
    );

    // collab group, should share
    expect(shareSpy).toHaveBeenCalled();
    expect(shareSpy.calls.argsFor(0)[0].groupId).toBe("foo-bar-baz");
    expectAllCalled(
      [
        createSpy,
        protectSpy,
        registerSpy,
        updateSpy,
        domainsSpy,
        uploadResourcesSpy
      ],
      expect
    );
  });

  it("dcatConfig not interpolated", async function() {
    const site = ({
      item: {
        owner: "luke",
        title: "Death Star Plans",
        properties: {
          collaborationGroupId: "foo-bar-baz"
        }
      },
      data: {
        values: {
          defaultHostname: "name-org.hub.arcgis.com",
          customHostname: "my-site.com",
          verifySecondPass: "this should be {{appid}} interpolated",
          dcatConfig: {
            foo: "{{some.undefined.thing}}"
          }
        }
      }
    } as unknown) as commonModule.IModel;

    const result = await createSite(site, {}, ro);

    expect(result.data.values.dcatConfig.foo).toBe(
      "{{some.undefined.thing}}",
      "dcatConfig not interpolated"
    );
  });

  it("critical failure", async function() {
    createSpy.and.returnValue(Promise.reject({}));
    const site = ({
      item: {
        owner: "luke",
        title: "Death Star Plans"
      },
      data: {
        values: {
          defaultHostname: "name-org.hub.arcgis.com",
          customHostname: "my-site.com"
        }
      }
    } as unknown) as IModel;

    try {
      await createSite(site, {}, ro);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }

    expect(createSpy).toHaveBeenCalled();
    expectAll(
      [
        protectSpy,
        registerSpy,
        updateSpy,
        domainsSpy,
        uploadResourcesSpy,
        shareSpy
      ],
      "toHaveBeenCalled",
      false,
      expect
    );
  });
});
