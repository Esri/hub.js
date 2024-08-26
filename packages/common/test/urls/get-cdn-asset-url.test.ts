import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getCdnAssetUrl } from "../../src/urls/get-cdn-asset-url";

describe("getCdnAssetUrl", () => {
  const assetPath =
    "/ember-arcgis-opendata-components/assets/images/placeholders/user.svg";

  const ENVS = {
    dev: {
      anonymous: {
        portal: "https://devext.arcgis.com/sharing/rest",
        expected: `https://hubdevcdn.arcgis.com/opendata-ui/assets${assetPath}`,
      },
      authenticated: {
        portal: "https://dev-pre-a-hub.mapsdevext.arcgis.com/sharing/rest",
        expected: `https://hubdevcdn.arcgis.com/opendata-ui/assets${assetPath}`,
      },
    },
    qa: {
      anonymous: {
        portal: "https://qaext.arcgis.com/sharing/rest",
        expected: `https://hubqacdn.arcgis.com/opendata-ui/assets${assetPath}`,
      },
      authenticated: {
        portal: "https://qa-pre-a-hub.mapsqa.arcgis.com/sharing/rest",
        expected: `https://hubqacdn.arcgis.com/opendata-ui/assets${assetPath}`,
      },
    },
    prod: {
      anonymous: {
        portal: "https://www.arcgis.com/sharing/rest",
        expected: `https://hubcdn.arcgis.com/opendata-ui/assets${assetPath}`,
      },
      authenticated: {
        portal: "https://prod-pre-a-hub.maps.arcgis.com/sharing/rest",
        expected: `https://hubcdn.arcgis.com/opendata-ui/assets${assetPath}`,
      },
    },
    enterpriseSites: {
      anonymous: {
        // this doesn't seem right, but is what's observed on enterprise sites today for anonymous users...
        portal: "../../sharing/rest",
        expected: `../../apps/sites${assetPath}`,
      },
      authenticated: {
        portal: "https://rqawinbi01pt.ags.esri.com/gis/sharing/rest",
        expected: `https://rqawinbi01pt.ags.esri.com/gis/apps/sites${assetPath}`,
      },
    },
  };

  Object.entries(ENVS).forEach(([env, envConfig]) => {
    Object.entries(envConfig).forEach(([userType, { portal, expected }]) => {
      it(`it should return "${expected}" for ${userType} in ${env}`, () => {
        const requestOptions = { portal } as IRequestOptions;
        const result = getCdnAssetUrl(assetPath, requestOptions);
        expect(result).toEqual(expected);
      });
    });
  });

  it('prefixes the assetPath with "/"', () => {
    const requestOptions = {
      portal: ENVS.qa.authenticated.portal,
    } as IRequestOptions;
    const result = getCdnAssetUrl(assetPath.substring(1), requestOptions);
    expect(result).toEqual(ENVS.qa.authenticated.expected);
  });
});
