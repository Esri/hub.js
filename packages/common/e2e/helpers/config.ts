/* Copyright (c) 2018-2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getProp } from "../../src/objects/get-prop";

/**
 * Configuration for the e2e suite
 */

let QA_PWD;
let USER_PWD;
let PROD_PWD;
let DEV_PWD;
const list = [
  "QA_CREDS_PSW",
  "QA_CREDS_USER_PSW",
  "PROD_CREDS_PSW",
  "DEV_CREDS_PSW",
];

if (typeof window === "undefined" && process.env) {
  const missing = list.filter((key) => !getProp(process.env, key));
  if (missing.length) {
    throw new Error(
      `${missing.join(
        ", "
      )} Could not be read! Please ensure you have a .env file configured! Use the .env-example file and ask others on the team where to get the values!`
    );
  } else {
    QA_PWD = process.env.QA_CREDS_PSW;
    USER_PWD = process.env.QA_CREDS_USER_PSW;
  }
} else {
  const missing = list.filter((key) => !getProp(window, `__env__.${key}`));
  if (missing.length) {
    throw new Error(
      `${missing.join(
        ", "
      )} Could not be read! Please ensure you have a .env file configured! Use the .env-example file and ask others on the team where to get the values!`
    );
  } else {
    QA_PWD = getProp(window, "__env__.QA_CREDS_PSW");
    USER_PWD = getProp(window, "__env__.QA_CREDS_USER_PSW");
    PROD_PWD = getProp(window, "__env__.PROD_CREDS_PSW");
    DEV_PWD = getProp(window, "__env__.DEV_CREDS_PSW");
  }
}

/**
 * This is pretty complex, but for the most part we want to isolate the tests from details of the running environment
 * identities, and artifacts (item ids etc). This means that we have many sets of hashes to work with.
 * We expose all this via the Artifactory class.
 */
const config = {
  envs: {
    qaext: {
      agoBaseDomain: "mapsqa.arcgis.com",
      hubBaseDomain: "hubqa.arcgis.com",
      orgs: {
        hubPremium: {
          orgShort: "qa-pre-hub",
          orgUrl: "https://qa-pre-hub.mapsqa.arcgis.com",
          admin: {
            username: "e2e_pre_pub_admin",
            password: QA_PWD,
          },
          user: {
            username: "e2e_pre_pub_publisher",
            password: QA_PWD,
          },
          fixtures: {
            items: {
              sitePageMapViewsLayersTable: "5741debb4bd9476e9511035126c7edb6",
              mapViewsLayersTable: "be81062c50534a8abddd5927f4f41316",
            },
          },
        },
        hubPremiumAlpha: {
          orgShort: "qa-pre-a-hub",
          orgUrl: "https://qa-pre-a-hub.mapsqa.arcgis.com",
          admin: {
            username: "e2e_pre_a_pub_admin",
            password: QA_PWD,
          },
          user: {
            username: "e2e_pre_a_pub_publisher",
            password: QA_PWD,
          },
          paige: {
            username: "paige_pa",
            password: USER_PWD,
          },
          fixtures: {
            items: {
              sitePageMapViewsLayersTable: "5741debb4bd9476e9511035126c7edb6",
              mapViewsLayersTable: "be81062c50534a8abddd5927f4f41316",
            },
          },
        },
        hubBasic: {
          orgShort: "qa-bas-hub",
          orgUrl: "https://qa-bas-hub.mapsqa.arcgis.com",
          admin: {
            username: "e2e_bas_pub_admin",
            password: QA_PWD,
          },
          user: {
            username: "e2e_bas_pub_publisher",
            password: QA_PWD,
          },
          fixtures: {
            items: {
              livingAtlasWebMapPublic: "9218fd27932f43aca023d4f7f55cf090",
              livingAtlasWebMapOrg: "9ee53fa3cd60467086a4e5ebbac6d487",
            },
          },
        },

        // NOTE - this does not work b/c CORS is blocking access
        portal: {
          isPortal: true,
          orgUrl: "https://rqawinbi01pt.ags.esri.com/gis",

          publisher: {
            username: "creator1",
            password: process.env.QA_PORTAL_CREDS_PSW,
          },
          fixtures: {},
        },
      },
    },
    devext: {
      agoBaseDomain: "mapsdevext.arcgis.com",
      hubBaseDomain: "hubdev.arcgis.com",
      orgs: {
        hubPremium: {
          orgShort: "dev-pre-hub",
          orgUrl: "https://dev-pre-hub.mapsdevext.arcgis.com",
          admin: {
            username: "e2e_pre_pub_admin",
            password: DEV_PWD,
          },
          user: {
            username: "e2e_pre_pub_publisher",
            password: DEV_PWD,
          },
        },
      },
    },
    prod: {
      agoBaseDomain: "maps.arcgis.com",
      hubBaseDomain: "hub.arcgis.com",
      orgs: {
        hubPremium: {
          orgShort: "prod-pre-hub",
          orgUrl: "https://prod-pre-hub.maps.arcgis.com",
          admin: {
            username: "e2e_pre_pub_admin",
            password: PROD_PWD,
          },
        },
      },
    },
  },
};

export default config;
