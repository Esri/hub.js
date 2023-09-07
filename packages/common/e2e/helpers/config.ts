/* Copyright (c) 2018-2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 * Configuration for the e2e suite
 */
import { getProp } from "../../src";

let PWD;
let USER_PWD;
if (typeof window === "undefined" && process.env) {
  if (!process.env.QACREDS_PSW || !process.env.QACREDS_USER_PSW) {
    throw new Error(
      "QACREDS_PSW or QACREDS_USER_PSW Could not be read! Please ensure you have a .env file configured! Use the .env-example file and ask others on the team where to get the values!"
    );
  } else {
    PWD = process.env.QACREDS_PSW;
    USER_PWD = process.env.QACREDS_USER_PSW;
  }
} else {
  if (
    !getProp(window, "__env__.QACREDS_PSW") ||
    !getProp(window, "__env__.QACREDS_USER_PSW")
  ) {
    throw new Error(
      "QACREDS_PSW or QACREDS_USER_PSW Could not be read! Please ensure you have a .env file configured! Use the .env-example file and ask others on the team where to get the values!"
    );
  } else {
    PWD = getProp(window, "__env__.QACREDS_PSW");
    USER_PWD = getProp(window, "__env__.QACREDS_USER_PSW");
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
            password: PWD,
          },
          user: {
            username: "e2e_pre_pub_publisher",
            password: PWD,
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
            password: PWD,
          },
          user: {
            username: "e2e_pre_a_pub_publisher",
            password: PWD,
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
            password: PWD,
          },
          user: {
            username: "e2e_bas_pub_publisher",
            password: PWD,
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
  },
};

export default config;
