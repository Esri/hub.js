import { updateSite } from '../src';
import { SITE_ITEM_RESPONSE, SITE_DATA_RESPONSE, SITE_RESOURCES_RESPONSE } from './site-responses.test';
import * as layoutModule from '../src/layout';
import * as commonModule from '@esri/hub-common';
import * as portalModule from '@esri/arcgis-rest-portal';

describe('update site', function () {
  let getModelSpy: jasmine.Spy;
  let updateSpy: jasmine.Spy;
  let removeResourcesSpy: jasmine.Spy;

  beforeEach(() => {
    getModelSpy = spyOn(commonModule, 'getModel')
    .and.returnValue(Promise.resolve({
      item: SITE_ITEM_RESPONSE,
      data: SITE_DATA_RESPONSE
    }))

    updateSpy = spyOn(portalModule, 'updateItem')
      .and.returnValue(Promise.resolve({ success: true, id: '3ef' }));

    removeResourcesSpy = spyOn(layoutModule, 'removeUnusedResources')
      .and.returnValue(Promise.resolve());
  })

  it('ago with allowList and resources to remove', async function () {
    // create a siteModel from the fixtures
    const localSite = {
      item: commonModule.cloneObject(SITE_ITEM_RESPONSE),
      data: commonModule.cloneObject(SITE_DATA_RESPONSE)
    };
    // ensure that the localItem is older than the upstream
    localSite.item.modified = SITE_ITEM_RESPONSE.modified - 1;
    // and apply some changes to the local model
    localSite.item.properties.newProp = 'red';
    // change a prop that's not in the allowList so we can ensure it's not sent
    localSite.item.title = 'WOOT I CHANGED THIS';
    // remove the background image from the first section
    delete localSite.data.values.layout.sections[0].style.background.fileSrc;
    delete localSite.data.values.layout.sections[0].style.background.cropSrc;

    const ro = {
      authentication: {}
    } as commonModule.IHubRequestOptions

    const result = await updateSite(localSite, ['item.properties', 'data.layout'], ro);

    // Model should be fetched when allow-list is passed in
    expect(getModelSpy).toHaveBeenCalledWith(localSite.item.id, ro);
    expect(result.success).toBeTruthy('should return sucess');
    expect(updateSpy).toHaveBeenCalled();

    const updateItem = updateSpy.calls.argsFor(0)[0].item;
    // title wasn't on allow list, so shouldn't update
    expect(updateItem.title).not.toBe(localSite.item.title);
    // newprop was on allow list, so should update
    expect(updateItem.properties.newProp).toBe(localSite.item.properties.newProp);

    const resourcesArgs = removeResourcesSpy.calls.argsFor(0);
    expect([resourcesArgs[0], resourcesArgs[2]]).toEqual([localSite.item.id, ro]);
  });

  it('ago without allowList or resources to remove', async function() {
    // create a siteModel from the fixtures
    const localSite = {
      item: commonModule.cloneObject(SITE_ITEM_RESPONSE),
      data: commonModule.cloneObject(SITE_DATA_RESPONSE)
    };
    // ensure that the localItem is older than the upstream
    localSite.item.modified = SITE_ITEM_RESPONSE.modified - 1;
    // and apply some changes to the local model
    localSite.item.properties.newProp = 'red';
    // change a prop that's not in the allowList so we can ensure it's not sent
    localSite.item.title = 'WOOT I CHANGED THIS';
    // remove the background image from the first section
    delete localSite.data.values.layout.sections[0].style.background.fileSrc;
    delete localSite.data.values.layout.sections[0].style.background.cropSrc;

    const ro = {
      authentication: {}
    } as commonModule.IHubRequestOptions

    const result = await updateSite(localSite, null, ro);

    expect(result.success).toBeTruthy('should return sucess');

    // Model should NOT be fetched when allow-list is NOT passed in
    expect(getModelSpy).not.toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    const updateItem = updateSpy.calls.argsFor(0)[0].item;
    const updateParams = updateSpy.calls.argsFor(0)[0].params;
    expect(updateParams.clearEmptyFields).toBe(true, 'it should pass clearEmptyFields parameter');
    // no allow list, so shouldn't update
    expect(updateItem.title).toBe(localSite.item.title);
    // no allow list, so should update
    expect(updateItem.properties.newProp).toBe(localSite.item.properties.newProp);

    const resourcesArgs = removeResourcesSpy.calls.argsFor(0);
    expect([resourcesArgs[0], resourcesArgs[2]]).toEqual([localSite.item.id, ro]);
  });

  it('portal', async function() {
    // create a siteModel from the fixtures
    const localSite = {
      item: commonModule.cloneObject(SITE_ITEM_RESPONSE),
      data: commonModule.cloneObject(SITE_DATA_RESPONSE)
    };
    // ensure that the localItem is older than the upstream
    localSite.item.modified = SITE_ITEM_RESPONSE.modified - 1;

    const subdomain = 'foo-bar-baz'
    localSite.data.values.subdomain = subdomain;

    const ro = {
      isPortal: true,
      authentication: {}
    } as commonModule.IHubRequestOptions

    // WITH ALLOW LIST
    const result = await updateSite(localSite, ['item.properties'], ro);

    expect(result.success).toBeTruthy('should return success');
    // Model should NOT be fetched when allow-list is NOT passed in
    expect(updateSpy).toHaveBeenCalled();
    const updateItem = updateSpy.calls.argsFor(0)[0].item;
    // adds domain typeKeyword when allow list
    expect(updateItem.typeKeywords).toContain(`hubsubdomain|${subdomain}`);

    // WITH ALLOW LIST
    updateSpy.calls.reset();
    const result2 = await updateSite(localSite, null, ro);

    expect(result2.success).toBeTruthy('should return success');
    // Model should NOT be fetched when allow-list is NOT passed in
    expect(updateSpy).toHaveBeenCalled();
    const updateItem2 = updateSpy.calls.argsFor(0)[0].item;
    // adds domain typeKeyword when allow list
    expect(updateItem2.typeKeywords).toContain(`hubsubdomain|${subdomain}`);
  });

  it('rejects if fails', async function() {
    // create a siteModel from the fixtures
    const localSite = {
      item: commonModule.cloneObject(SITE_ITEM_RESPONSE),
      data: commonModule.cloneObject(SITE_DATA_RESPONSE)
    };

    const ro = {
      authentication: {}
    } as commonModule.IHubRequestOptions

    updateSpy.and.returnValue(Promise.reject());

    // WITH ALLOW LIST
    try {
      await updateSite(localSite, ['item.properties'], ro);
      fail('should reject')
    } catch (err) {
      expect(err).toBeDefined();
    }

  });
});