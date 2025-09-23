import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { deepContains } from "../src/core/_internal/deepContains";
import { getProp } from "../src/objects/get-prop";
import { IDeepCatalogInfo } from "../src/search/types/types";
import { IHubCatalog } from "../src/search/types/IHubCatalog";

// Fixtures
//
// Site: c84347eb5d0a4a7b84c334fe84a5bbfe
// - Catalog Group: b29562e1236f4743bc08d2444497b008
//   - Content
//     - Initiative: 270b4696648e4e4a8767a1dc9753ae34
//     - Unique Web App: 7da7ea6055d34afd9125a2ccd63be5e1
//     - Common Web App: 63c765456d23439e8faf0e4172fc9b23
// Initiative: 270b4696648e4e4a8767a1dc9753ae34
// - Catalog Group: 1d568e44a1b043529f67122340a33890#overview
//   - Content:
//     - Project: 9c0ecf87bcc04a1d93dec04b54332458
//     - Unique Web App: c4597275ee874820bf578cdee3106e2f
//     - Common Web App: 63c765456d23439e8faf0e4172fc9b23
// Project: 9c0ecf87bcc04a1d93dec04b54332458
// - Catalog Group: 5d92405aaa2b414d8632a469f9983be8
//   - Content
//     - Unique Web App: a88285b001574cf3bfc91c4da11391cf
//     - Common Web App: 63c765456d23439e8faf0e4172fc9b23

describe("deepContains:", () => {
  const siteItemId = "c84347eb5d0a4a7b84c334fe84a5bbfe";
  const siteAppItemId = "7da7ea6055d34afd9125a2ccd63be5e1";
  const projectItemId = "9c0ecf87bcc04a1d93dec04b54332458";
  const projectAppItemId = "a88285b001574cf3bfc91c4da11391cf";
  const initiativeItemId = "270b4696648e4e4a8767a1dc9753ae34";
  const initiativeAppItemId = "c4597275ee874820bf578cdee3106e2f";
  const commonAppItemId = "63c765456d23439e8faf0e4172fc9b23";
  const notContainedItemId = "00000000000000000000000000000000";

  let factory: Artifactory;
  const orgName = "hubBasic";
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  describe(" passing only id:", () => {
    it("finds app in site catalog", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const siteCatalogInfo: IDeepCatalogInfo = {
        id: siteItemId,
        hubEntityType: "site",
      };
      const chk = await deepContains(
        siteAppItemId,
        "content",
        [siteCatalogInfo],
        ctxMgr.context
      );
      expect(chk.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(`App in Site Catalog: Time: ${chk.duration} ms`);

      // hold the catalog and do another check
      siteCatalogInfo.catalog = getProp(
        chk,
        `catalogInfo.${siteItemId}.catalog`
      );
      const chk2 = await deepContains(
        commonAppItemId,
        "content",
        [siteCatalogInfo],
        ctxMgr.context
      );
      expect(chk2.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(`App in Site Catalog (cached): Time: ${chk2.duration} ms`);
    });
    it("does not finds item in site catalog", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const siteCatalogInfo: IDeepCatalogInfo = {
        id: siteItemId,
        hubEntityType: "site",
      };
      const chk = await deepContains(
        notContainedItemId,
        "content",
        [siteCatalogInfo],
        ctxMgr.context
      );
      expect(chk.isContained).toBeFalsy();
      // tslint:disable-next-line:no-console
      console.info(`Item not in Site Catalog: Time: ${chk.duration} ms`);
    });

    it("finds app in initiative catalog", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const siteCatalogInfo: IDeepCatalogInfo = {
        id: siteItemId,
        hubEntityType: "site",
      };
      const initiativeCatalogInfo: IDeepCatalogInfo = {
        id: initiativeItemId,
        hubEntityType: "initiative",
      };

      const chk = await deepContains(
        initiativeAppItemId,
        "content",
        [initiativeCatalogInfo, siteCatalogInfo],
        ctxMgr.context
      );

      expect(chk.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(`App in Initiative Catalog: Time: ${chk.duration} ms`);
    });

    it("finds app in project catalog", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const siteCatalogInfo: IDeepCatalogInfo = {
        id: siteItemId,
        hubEntityType: "site",
      };
      const initiativeCatalogInfo: IDeepCatalogInfo = {
        id: initiativeItemId,
        hubEntityType: "initiative",
      };
      const projectCatalogInfo: IDeepCatalogInfo = {
        id: projectItemId,
        hubEntityType: "project",
      };

      const chk = await deepContains(
        projectAppItemId,
        "content",
        [projectCatalogInfo, initiativeCatalogInfo, siteCatalogInfo],
        ctxMgr.context
      );

      expect(chk.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(`App in Project Catalog: Time: ${chk.duration} ms`);
    });
    it("does not finds item in project catalog", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const siteCatalogInfo: IDeepCatalogInfo = {
        id: siteItemId,
        hubEntityType: "site",
      };
      const initiativeCatalogInfo: IDeepCatalogInfo = {
        id: initiativeItemId,
        hubEntityType: "initiative",
      };
      const projectCatalogInfo: IDeepCatalogInfo = {
        id: projectItemId,
        hubEntityType: "project",
      };

      const chk = await deepContains(
        notContainedItemId,
        "content",
        [projectCatalogInfo, initiativeCatalogInfo, siteCatalogInfo],
        ctxMgr.context
      );

      expect(chk.isContained).toBeFalsy();
      // tslint:disable-next-line:no-console
      console.info(`Item not in Project Catalog: Time: ${chk.duration} ms`);
    });
  });
  describe("pass in catalogs", () => {
    it("finds app in site catalog", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const siteCatalogInfo: IDeepCatalogInfo = {
        id: siteItemId,
        hubEntityType: "site",
        catalog: createCatalog("b29562e1236f4743bc08d2444497b008"),
      };
      const chk = await deepContains(
        siteAppItemId,
        "content",
        [siteCatalogInfo],
        ctxMgr.context
      );
      expect(chk.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(`App in Site Catalog (passed in): Time: ${chk.duration} ms`);
    });
    it("find app in initiative catalog", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const siteCatalogInfo: IDeepCatalogInfo = {
        id: siteItemId,
        hubEntityType: "site",
        catalog: createCatalog("b29562e1236f4743bc08d2444497b008"),
      };
      const initiativeCatalogInfo: IDeepCatalogInfo = {
        id: initiativeItemId,
        hubEntityType: "initiative",
        catalog: createCatalog("1d568e44a1b043529f67122340a33890"),
      };

      const chk = await deepContains(
        initiativeAppItemId,
        "content",
        [initiativeCatalogInfo, siteCatalogInfo],
        ctxMgr.context
      );

      expect(chk.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(
        `App in Initiative Catalog (passed in): Time: ${chk.duration} ms`
      );
    });
    it("find app in project catalog", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const siteCatalogInfo: IDeepCatalogInfo = {
        id: siteItemId,
        hubEntityType: "site",
        catalog: createCatalog("b29562e1236f4743bc08d2444497b008"),
      };
      const initiativeCatalogInfo: IDeepCatalogInfo = {
        id: initiativeItemId,
        hubEntityType: "initiative",
        catalog: createCatalog("1d568e44a1b043529f67122340a33890"),
      };
      const projectCatalogInfo: IDeepCatalogInfo = {
        id: projectItemId,
        hubEntityType: "project",
        catalog: createCatalog("5d92405aaa2b414d8632a469f9983be8"),
      };

      const chk = await deepContains(
        projectAppItemId,
        "content",
        [projectCatalogInfo, initiativeCatalogInfo, siteCatalogInfo],
        ctxMgr.context
      );

      expect(chk.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(
        `App in Project Catalog (passed in): Time: ${chk.duration} ms`
      );
    });
  });
});

function createCatalog(groupId: string): IHubCatalog {
  return {
    schemaVersion: 1,
    title: "Default Catalog",
    scopes: {
      item: {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                group: [groupId],
              },
            ],
          },
        ],
      },
    },
    collections: [],
  };
}
