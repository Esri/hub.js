import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "@esri/hub-common";

import { UserSession } from "@esri/arcgis-rest-auth";

import { removeUnusedResources } from "../../src/layout";
import * as _getImageCropIdsFromLayout from "../../src/layout/_get-image-crop-ids-from-layout";

import { ISection } from "../../src/layout/types";

describe("removeUnusedResources", function() {
  const mockUserSession = new UserSession({
    username: "vader",
    password: "123456",
    token: "fake-token",
    tokenExpires: new Date(),
    portal: "https://vader.maps.arcgis.com/sharing/rest"
  });  

  const hubRequestOptions: IHubRequestOptions = {
    isPortal: false,
    hubApiUrl: "",
    portalSelf: {
      id: "",
      name: "",
      isPortal: true,
      portalHostname: "portal-hostname"
    },
    authentication: mockUserSession
  };

  it("all cards in all row in section should should have dependencies extracted", async function () {
    spyOn(
      _getImageCropIdsFromLayout,
      "_getImageCropIdsFromLayout"
    ).and.returnValue(["cropId 1", "cropId 3", "cropId 5"])

    const getItemResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValue(Promise.resolve({
      resources: [
        {
          resource: 'hub-image-card-crop-cropId 2.png'
        },
        {
          resource: 'hub-image-card-crop-cropId 3.png'
        },
        {
          resource: 'hub-image-card-crop-cropId 4.png'
        }
      ]
    }));

    const removeItemResourceSpy = spyOn(portalModule, "removeItemResource")
      .and.returnValues(
        Promise.resolve('removed hub-image-card-crop-cropId 2.png'),
        Promise.resolve('removed hub-image-card-crop-cropId 4.png')
      )

    const layout = {
      sections: [] as ISection[]
    }
  
    const res = await removeUnusedResources('id value', layout, hubRequestOptions)

    expect(getItemResourcesSpy).toHaveBeenCalledTimes(1)

    expect(removeItemResourceSpy).toHaveBeenCalledTimes(2)
    expect(removeItemResourceSpy).toHaveBeenCalledWith({
      id: 'id value',
      resource: 'hub-image-card-crop-cropId 2.png',
      authentication: mockUserSession
    })
    expect(removeItemResourceSpy).toHaveBeenCalledWith({
      id: 'id value',
      resource: 'hub-image-card-crop-cropId 4.png',
      authentication: mockUserSession
    })

    expect(res).toEqual([
      'removed hub-image-card-crop-cropId 2.png',
      'removed hub-image-card-crop-cropId 4.png'
    ]);
  });

  it("layout with 0 cropIds should remove all ", async function () {
    spyOn(
      _getImageCropIdsFromLayout,
      "_getImageCropIdsFromLayout"
    ).and.returnValue([])

    const getItemResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValue(Promise.resolve({
      resources: [
        {
          resource: 'hub-image-card-crop-cropId 1.png'
        },
        {
          resource: 'hub-image-card-crop-cropId 2.png'
        },
        {
          resource: 'hub-image-card-crop-cropId 3.png'
        }
      ]
    }));

    const removeItemResourceSpy = spyOn(portalModule, "removeItemResource")
      .and.returnValues(
        Promise.resolve('removed hub-image-card-crop-cropId 1.png'),
        Promise.resolve('removed hub-image-card-crop-cropId 2.png'),
        Promise.resolve('removed hub-image-card-crop-cropId 3.png')
      )

    const layout = {
      sections: [] as ISection[]
    }
  
    const res = await removeUnusedResources('id value', layout, hubRequestOptions)

    expect(getItemResourcesSpy).toHaveBeenCalledTimes(1)

    expect(removeItemResourceSpy).toHaveBeenCalledTimes(3)

    expect(res).toEqual([
      'removed hub-image-card-crop-cropId 1.png',
      'removed hub-image-card-crop-cropId 2.png',
      'removed hub-image-card-crop-cropId 3.png'
    ]);
  });

  it("layout containing 0 imageCropIds should remove all resources that start with 'hub-image-card-crop-'", async function () {
    spyOn(
      _getImageCropIdsFromLayout,
      "_getImageCropIdsFromLayout"
    ).and.returnValue(["cropId 1", "cropId 2", "cropId 3"])

    const getItemResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValue(Promise.resolve({
      resources: [
        {
          resource: 'hub-image-card-crop-1'
        },
        {
          resource: 'hub-image-card-crop-2'
        },
        {
          resource: 'non hub-image-card-crop-3'
        },
        {
          resource: 'hub-image-card-crop-4'
        }
      ]
    }));


    const removeItemResourceSpy = spyOn(portalModule, "removeItemResource")
      .and.returnValues(
        Promise.resolve('removed hub-image-card-crop-1'),
        Promise.resolve('removed hub-image-card-crop-2'),
        Promise.resolve('removed hub-image-card-crop-4')
      )

    const layout = {
      sections: [] as ISection[]
    }
  
    const res = await removeUnusedResources('id value', layout, hubRequestOptions)

    expect(getItemResourcesSpy).toHaveBeenCalledTimes(1)

    expect(removeItemResourceSpy).toHaveBeenCalledTimes(3)
    expect(removeItemResourceSpy).toHaveBeenCalledWith({
      id: 'id value',
      resource: 'hub-image-card-crop-1',
      authentication: mockUserSession
    })
    expect(removeItemResourceSpy).toHaveBeenCalledWith({
      id: 'id value',
      resource: 'hub-image-card-crop-2',
      authentication: mockUserSession
    })
    expect(removeItemResourceSpy).toHaveBeenCalledWith({
      id: 'id value',
      resource: 'hub-image-card-crop-4',
      authentication: mockUserSession
    })

    expect(res).toEqual([
      'removed hub-image-card-crop-1',
      'removed hub-image-card-crop-2',
      'removed hub-image-card-crop-4'
    ])
  });

  it("getItemResources returning 0 resources should not call removeItemResource at all", async function () {
    spyOn(
      _getImageCropIdsFromLayout,
      "_getImageCropIdsFromLayout"
    ).and.returnValue(["cropId 1", "cropId 2", "cropId 3"])

    const getItemResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValue(Promise.resolve({}));

    const removeItemResourceSpy = spyOn(portalModule, "removeItemResource")

    const layout = {
      sections: [] as ISection[]
    }
  
    const res = await removeUnusedResources('id value', layout, hubRequestOptions)

    expect(getItemResourcesSpy).toHaveBeenCalledTimes(1)

    expect(removeItemResourceSpy).toHaveBeenCalledTimes(0)

    expect(res).toEqual([])
  });

  it("getItemResources throwing error should rethrow it", async function () { 
    spyOn(
      portalModule,
      "getItemResources"
    ).and.throwError('getItemResources threw an error for some reason');

    const layout = {
      sections: [] as ISection[]
    }

    try {
      await removeUnusedResources('id value', layout, hubRequestOptions)
    } catch (err) {
      expect(err).toEqual(new Error('getItemResources threw an error for some reason'))
    }
  });
});
