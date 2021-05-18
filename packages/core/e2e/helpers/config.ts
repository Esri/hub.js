/* Copyright (c) 2018-2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 * Configuration for the e2e suite
 */
import { getProp } from "@esri/hub-common";

let PWD;
if (typeof window === "undefined" && process.env) {
  if (!process.env.QACREDS_PSW) {
    throw new Error(
      "QACREDS_PSW Could not be read! Please ensure you have a .env file configured! Use the .env-example file and ask others on the team where to get the values!"
    );
  } else {
    PWD = process.env.QACREDS_PSW;
  }
} else {
  if (!getProp(window, "__env__.QACREDS_PSW")) {
    throw new Error(
      "QACREDS_PSW Could not be read! Please ensure you have a .env file configured! Use the .env-example file and ask others on the team where to get the values!"
    );
  } else {
    PWD = getProp(window, "__env__.QACREDS_PSW");
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
            username: "qa_pre_sol_admin",
            password: PWD
          },
          user: {
            username: "qa_pre_sol_user",
            password: PWD
          },
          fixtures: {
            domains: {
              privateSite: {
                hostname: "basic-fixture-site-qa-pre-hub.hubqa.arcgis.com",
                siteId: "5741debb4bd9476e9511035126c7edb6"
              },
              publicSite: {
                hostname: "basic-public-site-qa-pre-hub.hubqa.arcgis.com",
                siteId: "ad0892fbba08438eab66989d908324f6"
              }
            }
          }
        },
        hubBasic: {
          orgShort: "qa-bas-hub",
          orgUrl: "https://qa-bas-hub.mapsqa.arcgis.com",
          admin: {
            username: "qa_bas_sol_admin",
            password: PWD
          },
          user: {
            username: "qa_bas_sol_user",
            password: PWD
          },
          fixtures: {}
        }
        // portal: {
        //   homeUrl: 'https://portal.hubqa.arcgis.com/portal/apps/sites/#/home',
        //   harnessSite: 'https://portal.hubqa.arcgis.com/portal/apps/sites/#/harness',
        //   admin: {
        //     username: 'e2eadmin',
        //     password: process.env.QA_PORTAL_CREDS_PSW
        //   },
        //   publisher: {
        //     username: 'e2epublisher',
        //     password: process.env.QA_PORTAL_CREDS_PSW
        //   },
        //   fixtures: {

        //   }
        // }
      }
    },
    prod: {
      agoBaseDomain: "maps.arcgis.com",
      hubBaseDomain: "hub.arcgis.com",
      orgs: {
        dc: {
          fixtures: {
            domains: {
              dcopendata: {
                hostname: "opendata.dc.gov",
                siteId: "3adff78f286e4ecf936bdefdfeca9890"
              }
            }
          }
        }
      }
    }
  }
};

export default config;
