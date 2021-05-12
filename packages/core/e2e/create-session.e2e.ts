/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getSiteById, lookupDomain, IDomainEntry } from "@esri/hub-sites";
// NOTE: Need to import from this package via relative paths
import { getDefaultRequestOptions } from "../src/utils/getDefaultRequestOptions";
import { IModel } from "@esri/hub-common";
import { buildHubSession } from "../src/factories";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

// ----------------------------------------------------------------
// This set of tests flexes two important aspects of HubSession
// - correct determination of the Hub Api Url, derived from
//   the portal url - the lookupDomain calls verify this
// - ability to use HubSession as an IHubRequestOptions, and
//   delegated all the way through to restjs as IRequestOptions
//   The getSiteById verify this
// ----------------------------------------------------------------
fdescribe("HubSession Creation", () => {
  let factory: Artifactory;

  describe("default request options:", () => {
    describe("prod:", () => {
      beforeAll(() => {
        factory = new Artifactory(config, "prod");
      });
      it("can get a public site on prod", () => {
        const ro = getDefaultRequestOptions();
        const testDomain = factory.getFixture(
          "dc",
          "domains.dcopendata.hostname"
        );
        const testId = factory.getFixture("dc", "domains.dcopendata.siteId");
        return lookupDomain(testDomain, ro)
          .then(result => {
            expect(result.siteId).toEqual(testId);
            return getSiteById(result.siteId, ro);
          })
          .then((siteModel: IModel) => {
            expect(siteModel.item.id).toEqual(testId);
          });
      });
      it("throws for a non-public/non-existant site", () => {
        const ro = getDefaultRequestOptions();
        return lookupDomain("not-real-domain.dc.gov", ro).catch(err => {
          expect(err.message).toBe(
            "Domain record not found :: A domain record with hostname = not-real-domain.dc.gov does not exist :: 404"
          );
        });
      });
    });
    describe("qaext:", () => {
      beforeAll(() => {
        factory = new Artifactory(config);
      });
      it("can get a public site from qa", () => {
        const testDomain = factory.getFixture(
          "hubPremium",
          "domains.publicSite.hostname"
        );
        const testId = factory.getFixture(
          "hubPremium",
          "domains.publicSite.siteId"
        );
        const ro = getDefaultRequestOptions(
          "https://qaext.arcgis.com/sharing/rest"
        );

        return lookupDomain(testDomain, ro)
          .then(result => {
            expect(result.siteId).toEqual(testId);
            return getSiteById(result.siteId, ro);
          })
          .then((siteModel: IModel) => {
            expect(siteModel.item.id).toEqual(testId);
          });
      });
      it("throws without auth on private site", () => {
        const testDomain = factory.getFixture(
          "hubPremium",
          "domains.privateSite.hostname"
        );
        const testId = factory.getFixture(
          "hubPremium",
          "domains.privateSite.siteId"
        );
        const ro = getDefaultRequestOptions(
          "https://qaext.arcgis.com/sharing/rest"
        );

        return lookupDomain(testDomain, ro)
          .then(result => {
            expect(result.siteId).toEqual(testId);
            return getSiteById(result.siteId, ro);
          })
          .catch(err => {
            expect(err.message).toBe(
              "GWM_0003: You do not have permissions to access this resource or perform this operation."
            );
          });
      });
    });
  });

  describe("HubSession: qaext:", () => {
    beforeAll(() => {
      factory = new Artifactory(config);
    });
    const orgName = "hubPremium";
    let adminSession: UserSession;
    beforeEach(() => {
      adminSession = factory.getSession(orgName, "admin");
    });
    it("gets private site", async () => {
      const testDomain = factory.getFixture(
        "hubPremium",
        "domains.privateSite.hostname"
      );
      const testId = factory.getFixture(
        "hubPremium",
        "domains.privateSite.siteId"
      );
      // create a session from the userSession
      const session = await buildHubSession(adminSession);

      return lookupDomain(testDomain, session)
        .then(result => {
          expect(result.siteId).toEqual(testId);
          return getSiteById(result.siteId, session);
        })
        .then((siteModel: IModel) => {
          expect(siteModel.item.id).toEqual(testId);
        });
    });
    it("helper getters", async () => {
      const session = await buildHubSession(adminSession);
      expect(session.userGroupCount).toBeGreaterThan(
        3,
        "should have more than three groups"
      );
      expect(session.canCreateGroup).toBeTruthy("can create a group");
      expect(session.canCreateUpdateGroup).toBeTruthy(
        "can create a update group"
      );
      expect(session.hasAllPrivs(["foo", "bar"])).toBeFalsy();
    });
  });
});
