/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe("Team Creation Validation:", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
  });

  // Not entirely sure about breaking the products into
  // separate describe blocks, because that means duplicate
  // test cases (it blocks)
  describe("Hub Basic:", () => {
    const orgName = "hubBasic";
    let adminSession: ArcGISIdentityManager;
    beforeEach(() => {
      adminSession = factory.getSession(orgName, "admin");
    });
    it("gets admin self", () => {
      return adminSession.getUser().then((user) => {
        expect(user.groups?.length).toBeGreaterThan(
          0,
          "user should have groups"
        );
        expect(user.username).toBe(
          config.envs.qaext.orgs.hubBasic.admin.username,
          "should be basic admin"
        );
      });
    });
  });

  describe("Hub Premium:", () => {
    const orgName = "hubPremium";
    let adminSession: ArcGISIdentityManager;
    beforeEach(() => {
      adminSession = factory.getSession(orgName, "admin");
    });
    it("gets admin self", () => {
      return adminSession.getUser().then((user) => {
        expect(user.groups?.length).toBeGreaterThan(
          0,
          "user should have groups"
        );
        expect(user.username).toBe(
          config.envs.qaext.orgs.hubPremium.admin.username,
          "should be premium admin"
        );
      });
    });
  });
});
