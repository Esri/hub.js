import * as getSiteByIdModule from "../src/get-site-by-id";
import { SITE_ITEM_RESPONSE, SITE_DATA_RESPONSE } from "./site-responses.test";
import * as commonModule from "@esri/hub-common";
import * as portalModule from "@esri/arcgis-rest-portal";
import { updateSite } from "../src";

describe("update site", function() {
  let getSiteByIdSpy: jasmine.Spy;
  let updateSpy: jasmine.Spy;
  let localSite: commonModule.IModel;

  beforeEach(() => {
    getSiteByIdSpy = spyOn(getSiteByIdModule, "getSiteById").and.returnValue(
      Promise.resolve({
        item: SITE_ITEM_RESPONSE,
        data: SITE_DATA_RESPONSE
      })
    );

    updateSpy = spyOn(portalModule, "updateItem").and.returnValue(
      Promise.resolve({ success: true, id: "3ef" })
    );

    const siteItemClone = commonModule.cloneObject(SITE_ITEM_RESPONSE);
    siteItemClone.properties.schemaVersion =
      siteItemClone.properties.schemaVersion - 0.1;

    localSite = {
      item: siteItemClone,
      data: commonModule.cloneObject(SITE_DATA_RESPONSE)
    };
  });

  it("ago with allowList, resources to remove & updateVersions", async function() {
    // apply some changes to the local model
    localSite.item.properties.newProp = "red";
    // change a prop that's not in the allowList so we can ensure it's not sent
    localSite.item.title = "WOOT I CHANGED THIS";
    // remove the background image from the first section
    delete localSite.data.values.layout.sections[0].style.background.fileSrc;
    delete localSite.data.values.layout.sections[0].style.background.cropSrc;

    const updateSiteOptions = {
      authentication: {},
      allowList: ["item.properties", "data.layout"]
    } as commonModule.IUpdateSiteOptions;

    const result = await updateSite(localSite, updateSiteOptions);

    // Model should be fetched when allow-list is passed in
    expect(getSiteByIdSpy).toHaveBeenCalledWith(
      localSite.item.id,
      updateSiteOptions
    );
    expect(result.success).toBeTruthy("should return sucess");
    expect(updateSpy).toHaveBeenCalled();

    const updateItem = updateSpy.calls.argsFor(0)[0].item;
    // title wasn't on allow list, so shouldn't update
    expect(updateItem.title).not.toBe(localSite.item.title);
    // newprop was on allow list, so should update
    expect(updateItem.properties.newProp).toBe(
      localSite.item.properties.newProp
    );
    // versions updated
    expect(updateItem.properties.schemaVersion).toEqual(
      localSite.item.properties.schemaVersion
    );
  });

  it("ago with allowList and not updateVersions", async function() {
    // apply some changes to the local model
    localSite.item.properties.newProp = "red";
    // change a prop that's not in the allowList so we can ensure it's not sent
    localSite.item.title = "WOOT I CHANGED THIS";
    // remove the background image from the first section
    delete localSite.data.values.layout.sections[0].style.background.fileSrc;
    delete localSite.data.values.layout.sections[0].style.background.cropSrc;

    const updateSiteOptions = {
      authentication: {},
      allowList: ["item.properties", "data.layout"],
      updateVersions: false
    } as commonModule.IUpdateSiteOptions;

    const result = await updateSite(localSite, updateSiteOptions);

    // Model should be fetched when allow-list is passed in
    expect(getSiteByIdSpy).toHaveBeenCalledWith(
      localSite.item.id,
      updateSiteOptions
    );
    expect(result.success).toBeTruthy("should return sucess");
    expect(updateSpy).toHaveBeenCalled();

    const updateItem = updateSpy.calls.argsFor(0)[0].item;
    // title wasn't on allow list, so shouldn't update
    expect(updateItem.title).not.toBe(localSite.item.title);
    // newprop was on allow list, so should update
    expect(updateItem.properties.newProp).toBe(
      localSite.item.properties.newProp
    );
    // versions not updated
    expect(updateItem.properties.schemaVersion).toEqual(
      SITE_ITEM_RESPONSE.properties.schemaVersion
    );
  });

  it("ago without allowList or resources to remove", async function() {
    // apply some changes to the local model
    localSite.item.properties.newProp = "red";
    // change a prop that's not in the allowList so we can ensure it's not sent
    localSite.item.title = "WOOT I CHANGED THIS";
    // remove the background image from the first section
    delete localSite.data.values.layout.sections[0].style.background.fileSrc;
    delete localSite.data.values.layout.sections[0].style.background.cropSrc;

    const ro = {
      authentication: {}
    } as commonModule.IHubRequestOptions;

    const result = await updateSite(localSite, {
      ...ro,
      allowList: null
    });

    expect(result.success).toBeTruthy("should return sucess");

    // Model should NOT be fetched when allow-list is NOT passed in
    expect(getSiteByIdSpy).not.toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    const updateItem = updateSpy.calls.argsFor(0)[0].item;
    const updateParams = updateSpy.calls.argsFor(0)[0].params;
    expect(updateParams.clearEmptyFields).toBe(
      true,
      "it should pass clearEmptyFields parameter"
    );
    // no allow list, so shouldn't update
    expect(updateItem.title).toBe(localSite.item.title);
    // no allow list, so should update
    expect(updateItem.properties.newProp).toBe(
      localSite.item.properties.newProp
    );
    // versions updated
    expect(updateItem.properties.schemaVersion).toEqual(
      localSite.item.properties.schemaVersion
    );
  });

  it("portal", async function() {
    const subdomain = "foo-bar-baz";
    localSite.data.values.subdomain = subdomain;

    const ro = {
      isPortal: true,
      authentication: {}
    } as commonModule.IHubRequestOptions;

    // WITH ALLOW LIST
    const result = await updateSite(localSite, {
      ...ro,
      allowList: ["item.properties"]
    });

    expect(result.success).toBeTruthy("should return success");
    // Model should NOT be fetched when allow-list is NOT passed in
    expect(updateSpy).toHaveBeenCalled();
    const updateItem = updateSpy.calls.argsFor(0)[0].item;
    // adds domain typeKeyword when allow list
    expect(updateItem.typeKeywords).toContain(`hubsubdomain|${subdomain}`);

    // WITH ALLOW LIST
    updateSpy.calls.reset();
    const result2 = await updateSite(localSite, {
      ...ro,
      allowList: null
    });

    expect(result2.success).toBeTruthy("should return success");
    // Model should NOT be fetched when allow-list is NOT passed in
    expect(updateSpy).toHaveBeenCalled();
    const updateItem2 = updateSpy.calls.argsFor(0)[0].item;
    // adds domain typeKeyword when allow list
    expect(updateItem2.typeKeywords).toContain(`hubsubdomain|${subdomain}`);
  });

  it("rejects if fails", async function() {
    // create a siteModel from the fixtures
    const ro = {
      authentication: {}
    } as commonModule.IHubRequestOptions;

    updateSpy.and.returnValue(Promise.reject());

    // WITH ALLOW LIST
    try {
      await updateSite(localSite, {
        ...ro,
        allowList: ["item.properties"]
      });
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
